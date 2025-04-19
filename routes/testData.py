from db import add_user, add_budget, add_transaction

# ✅ Add Manager
manager = {
    "username": "alex123",
    "email": "alex@mail.com",
    "firstName": "Alex",
    "lastName": "Johnson",
    "role": "Manager",
    "password": "secure"
}
add_user(manager)

# ✅ Add Employees
employees = [
    {
        "username": "jose123",
        "email": "jose@example.com",
        "firstName": "Jose",
        "lastName": "Jimenez",
        "role": "Employee",
        "password": "temp123"
    },
    {
        "username": "jane123",
        "email": "jane@example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "role": "Employee",
        "password": "temp123"
    }
]
for emp in employees:
    add_user(emp)

# ✅ Add Budgets
budgets = [
    {"employee": "jose@example.com", "department": "Engineering", "limit": 1000, "remaining": 800},
    {"employee": "jane@example.com", "department": "Design", "limit": 1200, "remaining": 1150}
]
for b in budgets:
    add_budget(b)

# ✅ Add Transactions
transactions = [
    {
        "receipt_id": "R1001",
        "employee": "jose@example.com",
        "amount": 120.0,
        "status": "pending",
        "department": "Engineering",
        "date": "2025-04-15",
        "business": "Staples",
        "category": "Supplies"
    },
    {
        "receipt_id": "R1002",
        "employee": "jane@example.com",
        "amount": 80.0,
        "status": "approved",
        "department": "Design",
        "date": "2025-04-16",
        "business": "Adobe",
        "category": "Software"
    }
]
for txn in transactions:
    add_transaction(txn)

print("✅ Test data inserted.")
