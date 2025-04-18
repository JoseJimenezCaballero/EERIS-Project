from fastapi import APIRouter, HTTPException, Request
from db import (
    add_transaction, get_receipt_by_id,
    list_transactions, list_transactions_by_employee,
    update_transaction, update_transaction_by_id
)

router = APIRouter()

# ✅ Add Transaction (Employee)
@router.post("/submit")
def submit_transaction(data: dict):
    required_fields = ["employee", "receipt_id", "amount", "status"]
    if not all(f in data for f in required_fields):
        raise HTTPException(status_code=400, detail="Missing fields")

    data["status"] = "pending"
    result = add_transaction(data)
    return {"inserted_id": str(result.inserted_id)}

# ✅ Approve or Reject (Manager)
@router.patch("/{receipt_id}/status")
def change_status(receipt_id: str, update: dict):
    status = update.get("status")
    if status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    update_transaction(receipt_id, {"status": status})
    return {"message": f"Transaction {status}"}

# ✅ View all transactions for employee (email)
@router.get("/employee/{employee}")
def get_employee_transactions(employee: str):
    txns = list_transactions_by_employee(employee)
    for t in txns:
        t["_id"] = str(t["_id"])
    return txns

# ✅ View all transactions (for manager summary)
@router.get("/")
def all_transactions():
    txns = list_transactions()
    for t in txns:
        t["_id"] = str(t["_id"])
    return txns

# ✅ Update pending transaction only
@router.patch("/update/{receipt_id}")
def update_txn(receipt_id: str, update_data: dict):
    txn = get_receipt_by_id(receipt_id)
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if txn["status"] != "pending":
        raise HTTPException(status_code=400, detail="Only pending transactions can be updated")

    update_transaction(receipt_id, update_data)
    return {"message": "Transaction updated"}
