from fastapi import APIRouter, HTTPException, Request
from db import (
    add_receipt, get_receipt_by_id, list_receipts,
    list_receipts_by_owner, update_receipt, delete_receipt
)
import uuid

router = APIRouter()

# ✅ Submit Receipt (Manual or OCR)
@router.post("/upload")
async def upload_receipt(request: Request):
    data = await request.json()

    # 🔄 Rename fields from frontend to backend format
    if "userId" in data:
        data["owner"] = data.pop("userId")
    if "amount" in data:
        data["total"] = float(data.pop("amount"))

    required_fields = ["owner", "business", "date", "total", "category"]
    if not all(f in data for f in required_fields):
        raise HTTPException(status_code=400, detail="Missing fields")

    data["receipt_id"] = str(uuid.uuid4())
    result = add_receipt(data)
    return {"inserted_id": str(result.inserted_id)}


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
