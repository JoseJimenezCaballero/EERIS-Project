from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from db import add_receipt, add_transaction, update_budget, get_budget_by_employee
from datetime import datetime
from PIL import Image
import pytesseract
import uuid
import io
import re

router = APIRouter()

@router.post("/upload_receipt")
async def upload_receipt(
    file: UploadFile = File(...),
    owner: str = Form(...)
):
    try:
        # Load image and run OCR
        image = Image.open(io.BytesIO(await file.read()))
        text = pytesseract.image_to_string(image)

        # Extract fields using regex
        store = extract_store_name(text)
        total = extract_total_amount(text)
        date = extract_date(text)

        if not all([store, total, date]):
            raise ValueError("Failed to extract all required fields.")

        receipt_id = int(uuid.uuid4().int % 100000)

        receipt_data = {
            "receipt_id": receipt_id,
            "owner": owner,
            "store": store,
            "date": date,
            "items": [],  # optional extension
            "total": total,
            "category": "Uncategorized",
            "sub_category": "",
            "image_url": f"/receipts/{file.filename}"
        }

        transaction_data = {
            "employee": owner,
            "receipt_id": receipt_id,
            "status": "pending",
            "submitted_at": datetime.now().isoformat(),
            "manager_review": None,
            "amount": total
        }

        # Save to DB
        add_receipt(receipt_data)
        add_transaction(transaction_data)

        # Update budget
        budget = get_budget_by_employee(owner)
        if budget:
            update_budget(owner, {"spent": budget["spent"] + total})

        return {
            "message": "Receipt scanned and submitted",
            "receipt": receipt_data,
            "transaction": transaction_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Utility functions ---
def extract_store_name(text):
    lines = text.strip().split('\n')
    for line in lines:
        if re.search(r'(Store|Staples|Walmart|Target|Best Buy)', line, re.IGNORECASE):
            return line.strip()
    return lines[0] if lines else "Unknown Store"

def extract_total_amount(text):
    matches = re.findall(r'(?i)(Total|Amount Due|Paid)[^\d]*(\d+\.\d{2})', text)
    if matches:
        return float(matches[-1][1])  # Take last match (usually final total)
    amounts = re.findall(r'\d+\.\d{2}', text)
    return float(max(amounts, key=float)) if amounts else None

def extract_date(text):
    match = re.search(r'(\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})', text)
    if match:
        return match.group(1)
    return datetime.now().strftime("%Y-%m-%d")
