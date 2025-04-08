from fastapi import APIRouter, HTTPException
from db import add_transaction, update_budget, get_budget_by_employee
from datetime import datetime

router = APIRouter()

@router.post("/submit_transaction")
def submit_transaction(data: dict):
    try:
        data["submitted_at"] = datetime.now().isoformat()
        data["status"] = "pending"
        add_transaction(data)

        budget = get_budget_by_employee(data["employee"])
        if budget:
            updated_spent = budget["spent"] + data["amount"]
            update_budget(data["employee"], {"spent": updated_spent})
        return {"message": "Transaction submitted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
