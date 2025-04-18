from fastapi import APIRouter, HTTPException
from db import add_user, delete_user, list_users, get_user_by_email

router = APIRouter()

# ✅ Add a new employee with initial budget
@router.post("/add-employee-ui")
def add_employee_ui(user: dict):
    required = ("firstName", "lastName", "email", "budget", "role", "empId")
    if not all(k in user for k in required):
        raise HTTPException(status_code=400, detail="Missing fields")

    if get_user_by_email(user["email"]):
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = {
        "username": user["firstName"].lower() + user["lastName"].lower(),
        "email": user["email"],
        "password": "temp123",
        "role": user["role"],
        "allocated": float(user["budget"]),  # standardize to 'allocated'
        "empId": user["empId"],
        "firstName": user["firstName"],
        "lastName": user["lastName"],
        "active": True,
        "department": "General"
    }

    add_user(new_user)
    return {"message": f"User {new_user['username']} added"}


# ✅ Delete an employee by email
@router.delete("/remove-employee/{email}")
def remove_employee(email: str):
    result = delete_user(email)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Employee deleted"}

# ✅ List all employees only
@router.get("/list-employees")
def list_employees():
    users = list_users()
    employees = [u for u in users if u.get("role") == "employee"]

    return [
        {
            "empId": u.get("empId"),
            "employee": f"{u.get('firstName')} {u.get('lastName')[0]}.",
            "role": u.get("role")
        }
        for u in employees
    ]


@router.delete("/remove-employee-name/{name}")
def remove_employee_by_name(name: str):
    # Find employee where firstName + lastName match
    for u in list_users():
        full_name = f"{u.get('firstName')} {u.get('lastName')}".strip()
        if full_name.lower() == name.strip().lower():
            delete_user(u["email"])
            return {"message": f"Deleted {full_name}"}
    raise HTTPException(status_code=404, detail="User not found")
