#  from db import add_user, add_receipt, add_transaction, add_budget

# # ✅ Add a user
# user_data = {
#     "username": "jose123",
#     "email": "jose@mail.com",
#     "firstName": "Jose",
#     "lastName": "Jimenez",
#     "role": "Employee",
#     "password": "supersecure123"
# }
# result = add_user(user_data)
# print("✅ User inserted with _id:", result.inserted_id)


# # ✅ Add a receipt
# receipt_data = {
#     "owner": "jose@mail.com",
#     "receipt_id": "R123456",
#     "merchant": "Amazon",
#     "amount": 49.99,
#     "date": "2025-04-18",
#     "status": "pending"
# }
# result = add_receipt(receipt_data)
# print("✅ Receipt inserted with _id:", result.inserted_id)


# # ✅ Add a transaction
# transaction_data = {
#     "receipt_id": "R123456",
#     "employee": "jose@mail.com",
#     "amount": 49.99,
#     "status": "pending",
#     "department": "Engineering",
#     "date": "2025-04-18",      # <-- ADDED
#     "business": "Amazon",       # <-- ADDED
#     "category": "Merchandise"   # <-- ADDED (Choose appropriate category)
# }
# result = add_transaction(transaction_data)
# print("✅ Transaction inserted with _id:", result.inserted_id)


# # ✅ Add a budget
# budget_data = {
#     "employee": "jose@mail.com",
#     "department": "Engineering",
#     "limit": 1000,
#     "remaining": 950.01
# }
# result = add_budget(budget_data)
# print("✅ Budget inserted with _id:", result.inserted_id)

# #-----------------------------------------------------------------

#  user_data = {
#     "username": "aastha123",
#     "email": "aastha@mail.com",
#     "firstName": "Aastha",
#     "lastName": "Sangani",
#     "role": "Manager",
#     "password": "asd123"
# }
# result = add_user(user_data)
# print("✅ User inserted with _id:", result.inserted_id) 





#-----------------------------------------------------

from db import add_user, add_budget

# ✅ Add a user
user_data = {
    "username": "alex123",
    "email": "alex@mail.com",
    "firstName": "Alex",
    "lastName": "Johnson",
    "role": "Manager",
    "password": "strongpass456"
}
result = add_user(user_data)
print("✅ Manager inserted with _id:", result.inserted_id)

# Manager adjusts employee budgets, so this simulates data for that view

emp_budgets = [
    {
        "employee": "jose@mail.com",
        "department": "Engineering",
        "limit": 1000,
        "remaining": 900
    },
    {
        "employee": "jane@mail.com",
        "department": "Design",
        "limit": 1500,
        "remaining": 1470
    }
]

for budget_data in emp_budgets:
    result = add_budget(budget_data)
    print("✅ Budget inserted with _id:", result.inserted_id)

from db import add_transaction

transactions = [
    {
        "receipt_id": "R1001",
        "employee": "jose@mail.com",
        "amount": 120.00,
        "status": "pending",
        "department": "Engineering",
        "date": "2025-04-15",
        "business": "Staples",
        "category": "Supplies"
    },
    {
        "receipt_id": "R1002",
        "employee": "jane@mail.com",
        "amount": 80.00,
        "status": "pending",
        "department": "Design",
        "date": "2025-04-16",
        "business": "Adobe",
        "category": "Software"
    }
]

for txn in transactions:
    result = add_transaction(txn)
    print("✅ Transaction inserted with _id:", result.inserted_id)
