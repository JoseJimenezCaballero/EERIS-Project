from db import add_user, add_receipt, add_transaction, add_budget

# ✅ Add a user
user_data = {
    "username": "jose123",
    "email": "jose@mail.com",
    "firstName": "Jose",
    "lastName": "Jimenez",
    "role": "Employee",
    "password": "supersecure123"
}
result = add_user(user_data)
print("✅ User inserted with _id:", result.inserted_id)


# ✅ Add a receipt
receipt_data = {
    "owner": "jose@mail.com",
    "receipt_id": "R123456",
    "merchant": "Amazon",
    "amount": 49.99,
    "date": "2025-04-18",
    "status": "pending"
}
result = add_receipt(receipt_data)
print("✅ Receipt inserted with _id:", result.inserted_id)


# ✅ Add a transaction
transaction_data = {
    "receipt_id": "R123456",
    "employee": "jose@mail.com",
    "amount": 49.99,
    "status": "pending",
    "department": "Engineering",
    "date": "2025-04-18",      # <-- ADDED
    "business": "Amazon",       # <-- ADDED
    "category": "Merchandise"   # <-- ADDED (Choose appropriate category)
}
result = add_transaction(transaction_data)
print("✅ Transaction inserted with _id:", result.inserted_id)


# ✅ Add a budget
budget_data = {
    "employee": "jose@mail.com",
    "department": "Engineering",
    "limit": 1000,
    "remaining": 950.01
}
result = add_budget(budget_data)
print("✅ Budget inserted with _id:", result.inserted_id)
