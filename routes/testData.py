from db import add_user, add_budget, add_transaction, add_receipt

# ✅ HR User
hr_user = {
    "username": "hr001",
    "email": "hr@mail.com",
    "firstName": "Harper",
    "lastName": "Reed",
    "role": "HR",
    "password": "hrpass123"
}
add_user(hr_user)

# ✅ Manager User
manager_user = {
    "username": "alex123",
    "email": "alex@mail.com",
    "firstName": "Alex",
    "lastName": "Johnson",
    "role": "Manager",
    "password": "secure123"
}
add_user(manager_user)

# ✅ Employees
employees = [
    {
        "username": "jose123",
        "email": "jose@example.com",
        "firstName": "Jose",
        "lastName": "Jimenez",
        "role": "Employee",
        "password": "pass123"
    },
    {
        "username": "jane123",
        "email": "jane@example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "role": "Employee",
        "password": "pass123"
    },
    {
        "username": "eric123",
        "email": "eric@example.com",
        "firstName": "Eric",
        "lastName": "Chow",
        "role": "Employee",
        "password": "pass123"
    }
]

for emp in employees:
    add_user(emp)

# ✅ Budgets (limit = total, remaining = after spending)
budgets = [
    {
        "employee": "jose@example.com",
        "department": "Engineering",
        "limit": 1000,
        "remaining": 800
    },
    {
        "employee": "jane@example.com",
        "department": "Design",
        "limit": 1200,
        "remaining": 1100
    },
    {
        "employee": "eric@example.com",
        "department": "Logistics",
        "limit": 900,
        "remaining": 845
    }
]

for b in budgets:
    add_budget(b)

# ✅ Receipts
receipts = [
    {
        "owner": "jose@example.com",
        "receipt_id": "R1001",
        "merchant": "Staples",
        "amount": 120.0,
        "date": "2025-04-15",
        "status": "pending"
    },
    {
        "owner": "jane@example.com",
        "receipt_id": "R1002",
        "merchant": "Adobe",
        "amount": 80.0,
        "date": "2025-04-16",
        "status": "approved"
    },
    {
        "owner": "eric@example.com",
        "receipt_id": "R1003",
        "merchant": "UPS",
        "amount": 55.0,
        "date": "2025-04-14",
        "status": "rejected"
    }
]

for r in receipts:
    add_receipt(r)

# ✅ Transactions
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
    },
    {
        "receipt_id": "R1003",
        "employee": "eric@example.com",
        "amount": 55.0,
        "status": "rejected",
        "department": "Logistics",
        "date": "2025-04-14",
        "business": "UPS",
        "category": "Shipping"
    }
]

for t in transactions:
    add_transaction(t)

print("✅ Test data successfully inserted for HR, Manager, Employees, Budgets, Receipts, and Transactions.")
