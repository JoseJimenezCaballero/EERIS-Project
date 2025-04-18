from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Form
from db import (
    add_receipt, get_receipt_by_id, list_receipts,
    list_receipts_by_owner, update_receipt, delete_receipt,
    add_transaction
)
import uuid
from datetime import datetime
from PIL import Image
import pytesseract
import io
import re

router = APIRouter()


# ✅ [1] OCR IMAGE UPLOAD: Receives file, returns parsed fields
@router.post("/upload-image")
async def upload_receipt_image(
    file: UploadFile = File(...),
    userId: str = Form(...)
):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        text = pytesseract.image_to_string(image)

        # --- OCR Debugging ---
        print("\n--- OCR Output ---")
        print(text)
        print("------------------")

        # --- Extract Date (format: DD-MM-YYYY or YYYY-MM-DD or similar) ---
        date_match = re.search(r"\d{2}[-/]\d{2}[-/]\d{4}", text)
        date = date_match.group(0) if date_match else "N/A"

        # --- Extract Amount (Look for line with AMOUNT and grab number nearby) ---
        amount_match = re.search(r"(AMOUNT|Total|Balance).{0,20}?(\d+\.\d{2})", text, re.IGNORECASE)
        amount = float(amount_match.group(2)) if amount_match else 0.0

        # --- Extract Business Name (use top line or label “Receipt” as fallback) ---
        lines = text.strip().split('\n')
        business = "Unknown"
        for line in lines:
            if "receipt" not in line.lower() and line.strip():
                business = line.strip()
                break

        return {
            "parsed": {
                "business": business,
                "date": date,
                "amount": amount
            },
            "userId": userId
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {e}")


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
