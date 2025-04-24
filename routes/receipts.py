from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Form
from db import (
    add_receipt, get_receipt_by_id, list_receipts,
    list_receipts_by_owner, update_receipt, delete_receipt,
    add_transaction
)
import uuid
import json
from datetime import datetime
from PIL import Image
import pytesseract
import io
import re
import easyocr
import openai
import base64
import os
openai.api_key = "" #add api key
router = APIRouter()
reader = easyocr.Reader(['en'], gpu=False)  # Use CPU

@router.post("/upload-image")
async def upload_receipt_image(
    file: UploadFile = File(...),
    userId: str = Form(...)
):
    try:
        # Read and parse image with EasyOCR
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        image.save("temp.jpg")
        result = reader.readtext("temp.jpg", detail=0)
        ocr_text = "\n".join(result)

        print("🧾 OCR TEXT:\n", ocr_text)

        # Use GPT-3.5 to format the text into structured JSON
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Extract the business name, date (MM/DD/YYYY or similar), "
                        f"and total amount (highest number) from the following receipt text:\n\n"
                        f"{ocr_text}\n\n"
                        f"Return only this JSON:\n"
                        f"{{\n  \"business\": \"...\",\n  \"date\": \"...\",\n  \"amount\": 0.00\n}}"
                    )
                }
            ],
            max_tokens=300
        )

        structured_output = completion['choices'][0]['message']['content']
        print("🤖 GPT OUTPUT:\n", structured_output)

        # Extract JSON from GPT's response
        match = json.loads(structured_output.strip())

        return {
            "parsed": match,
            "userId": userId
        }

    except Exception as e:
        print("❌ Hybrid OCR+GPT Error:", e)
        raise HTTPException(status_code=500, detail=f"Failed to process receipt: {str(e)}")
    
# ✅ [2] FINAL FORM SUBMISSION: Save receipt and transaction (manual or image-based)
@router.post("/upload")
async def upload_receipt(request: Request):
    print("\n--- Received request for /upload ---")
    try:
        data = await request.json()
        print(f"DEBUG: Received data: {data}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON body: {e}")

    receipt_data = data.copy()

    # --- Validate and convert fields ---
    owner_email = receipt_data.get("userId")
    if not owner_email:
        raise HTTPException(status_code=400, detail="Missing userId")
    receipt_data["owner"] = receipt_data.pop("userId")

    if "amount" in receipt_data:
        try:
            receipt_data["total"] = float(receipt_data.pop("amount"))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid amount format")
    else:
        raise HTTPException(status_code=400, detail="Missing amount")

    required_receipt_fields = ["owner", "business", "date", "total", "category"]
    missing_fields = [f for f in required_receipt_fields if f not in receipt_data]
    if missing_fields:
        raise HTTPException(status_code=400, detail=f"Missing fields for receipt: {', '.join(missing_fields)}")

    receipt_id = str(uuid.uuid4())
    receipt_data["receipt_id"] = receipt_id
    receipt_data["status"] = "processed"

    # --- Save receipt ---
    try:
        receipt_result = add_receipt(receipt_data)
        if not receipt_result.inserted_id:
            raise Exception("Failed to insert receipt")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add receipt: {e}")

    # --- Prepare transaction ---
    transaction_data = {
        "employee": owner_email,
        "receipt_id": receipt_id,
        "amount": receipt_data["total"],
        "status": "pending",
        "date": receipt_data["date"],
        "business": receipt_data["business"],
        "category": receipt_data["category"]
    }

    required_transaction_fields = ["employee", "receipt_id", "amount", "status", "date", "business", "category"]
    missing_tx_fields = [f for f in required_transaction_fields if f not in transaction_data or transaction_data[f] is None]
    if missing_tx_fields:
        raise HTTPException(status_code=500, detail=f"Missing derived fields for transaction: {', '.join(missing_tx_fields)}")

    try:
        transaction_result = add_transaction(transaction_data)
        if not transaction_result.inserted_id:
            raise Exception("Failed to insert transaction")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Receipt added, but failed to add transaction: {e}")

    return {
        "message": "Receipt and transaction submitted successfully",
        "receipt_inserted_id": str(receipt_result.inserted_id),
        "transaction_inserted_id": str(transaction_result.inserted_id),
        "receipt_id": receipt_id
    }


# ✅ View all receipts by employee (email as owner)
@router.get("/employee/{owner_email}")
def get_employee_receipts(owner_email: str):
    results = list_receipts_by_owner(owner_email)
    for r in results:
        r["_id"] = str(r["_id"])
    return results


# ✅ View one receipt
@router.get("/{receipt_id}")
def get_receipt(receipt_id: str):
    receipt = get_receipt_by_id(receipt_id)
    if not receipt:
        raise HTTPException(status_code=404, detail="Not found")
    receipt["_id"] = str(receipt["_id"])
    return receipt


# ✅ Update receipt (can be used for OCR cleanup)
@router.patch("/{receipt_id}")
def edit_receipt(receipt_id: str, updates: dict):
    update_receipt(receipt_id, updates)
    return {"message": "Updated"}


# ✅ Delete a receipt
@router.delete("/{receipt_id}")
def delete(receipt_id: str):
    delete_receipt(receipt_id)
    return {"message": "Deleted"}
