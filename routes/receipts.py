from fastapi import APIRouter, HTTPException, Request
from db import (
    add_receipt, get_receipt_by_id, list_receipts,
    list_receipts_by_owner, update_receipt, delete_receipt,
    add_transaction # <--- IMPORT add_transaction
)
import uuid
from datetime import datetime # Import datetime if needed for transaction date

router = APIRouter()

# ✅ Submit Receipt (Manual or OCR) - MODIFIED
@router.post("/upload")
async def upload_receipt(request: Request):
    print("\n--- Received request for /upload ---")
    try:
        data = await request.json()
        print(f"DEBUG: Received data: {data}")
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Invalid JSON body: {e}")

    receipt_data = data.copy() # Keep original data for receipt processing

    # --- Prepare data for the receipt ---
    owner_email = receipt_data.get("userId") # Expecting userId from frontend
    if not owner_email:
         raise HTTPException(status_code=400, detail="Missing userId")
    receipt_data["owner"] = receipt_data.pop("userId") # Rename for receipt schema

    if "amount" in receipt_data:
        try:
            receipt_data["total"] = float(receipt_data.pop("amount")) # Rename & ensure float
        except ValueError:
             raise HTTPException(status_code=400, detail="Invalid amount format")
    else:
         raise HTTPException(status_code=400, detail="Missing amount")


    required_receipt_fields = ["owner", "business", "date", "total", "category"]
    missing_fields = [f for f in required_receipt_fields if f not in receipt_data]
    if missing_fields:
        raise HTTPException(status_code=400, detail=f"Missing required fields for receipt: {', '.join(missing_fields)}")

    receipt_id = str(uuid.uuid4()) # Generate a unique ID
    receipt_data["receipt_id"] = receipt_id
    receipt_data["status"] = "processed" # Or suitable initial status

    # --- Add the receipt ---
    try:
        receipt_result = add_receipt(receipt_data)
        if not receipt_result.inserted_id:
             raise Exception("Failed to insert receipt (no ID returned)")
    except Exception as e:
        # Handle potential database errors for adding receipt
        raise HTTPException(status_code=500, detail=f"Failed to add receipt: {e}")

    # --- Prepare data for the transaction ---
    transaction_data = {
        "employee": owner_email, # Use the email from original userId field
        "receipt_id": receipt_id, # Link to the receipt
        "amount": receipt_data["total"], # Use the numeric amount saved in receipt
        "status": "pending", # Initial status for transactions needing approval
        "date": receipt_data["date"], # Add date from receipt
        "business": receipt_data["business"], # Add business from receipt
        "category": receipt_data["category"] # Add category from receipt
        # Add department if available/needed, maybe from user profile?
        # "department": "Default"
    }

    required_transaction_fields = ["employee", "receipt_id", "amount", "status", "date", "business", "category"]
    missing_tx_fields = [f for f in required_transaction_fields if f not in transaction_data or transaction_data[f] is None]
    if missing_tx_fields:
         # This shouldn't happen if receipt fields were present, but good check
        raise HTTPException(status_code=500, detail=f"Missing derived fields for transaction: {', '.join(missing_tx_fields)}")

    # --- Add the transaction ---
    try:
        transaction_result = add_transaction(transaction_data) # CALL add_transaction
        if not transaction_result.inserted_id:
             raise Exception("Failed to insert transaction (no ID returned)")
    except Exception as e:
         # Handle potential database errors for adding transaction
         # Consider how to handle failure here (e.g., log error, maybe delete the receipt?)
         # For now, raise an error indicating transaction failed
         raise HTTPException(status_code=500, detail=f"Receipt added, but failed to add corresponding transaction: {e}")

    # Return success with IDs from both operations
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
