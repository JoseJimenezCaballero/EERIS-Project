from fastapi import APIRouter, HTTPException
from bson.objectid import ObjectId
from db import (
    list_transactions_by_employee,
    update_transaction,
    get_budget_by_employee,
    update_budget,
    list_transactions,
    get_transaction_by_id,
    update_transaction_by_id,
    list_users

)
from db import get_employee_total_spending

router = APIRouter()

# ✅ Get summary for one employee
@router.get("/budget-summary/{email}")
def budget_summary(email: str):
    budget_data = get_budget_by_employee(email)
    if not budget_data:
        raise HTTPException(status_code=404, detail="Budget not found")

    budget = budget_data.get("allocated", 0)

    #  Calculate total spent
    total_spent = get_employee_total_spending(email)

    return {
        "budget": budget,
        "totalSpent": total_spent
    }




@router.patch("/status-by-transId")
def approve_by_transaction_id(data: dict):
    trans_id = data.get("transId")
    decision = data.get("decision")

    if not trans_id or decision not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid input")

    try:
        obj_id = ObjectId(trans_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid transaction ID")

    txn = get_transaction_by_id(obj_id)
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")

    update_transaction_by_id(obj_id, {"status": decision})
    return {"message": f"Transaction {decision}"}


# ✅ Adjust budget (with guard to avoid underbudgeting)
@router.patch("/adjust-budget/{employee_email}")
def adjust_budget(employee_email: str, update: dict):
    new_budget = update.get("budget")
    if new_budget is None:
        raise HTTPException(status_code=400, detail="Budget value required")

    current_budget = get_budget_by_employee(employee_email)
    if not current_budget:
        raise HTTPException(status_code=404, detail="Employee budget not found")

    total_spent = current_budget.get("spent", 0)
    if new_budget < total_spent:
        raise HTTPException(status_code=400, detail="New budget is below total spent")

    update_budget(employee_email, {"allocated": new_budget})
    return {"message": "Budget updated"}

@router.patch("/adjust-budget-by-id")
def adjust_budget_by_id(data: dict):
    emp_id = data.get("empId")
    budget = data.get("amount")

    if not emp_id or budget is None:
        raise HTTPException(status_code=400, detail="empId and amount required")

    user = next((u for u in list_users() if str(u.get("empId")) == str(emp_id)), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    email = user["email"]
    update_budget(email, {"allocated": float(budget)})

    return {"message": "Budget updated"}

