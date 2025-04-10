from pymongo import MongoClient

# ====== DATABASE CONNECTION ======
client = MongoClient("mongodb://localhost:27017")
db = client["eeris_db"]

# ====== COLLECTIONS ======
users = db["users"]
receipts = db["receipts"]
transactions = db["transactions"]
budgets = db["budgets"]

# ====== USERS ======
def add_user(data): return users.insert_one(data)
def get_user_by_username(username): return users.find_one({"username": username})
def list_users(): return list(users.find())
def update_user(username, new_data): return users.update_one({"username": username}, {"$set": new_data})
def delete_user(username): return users.delete_one({"username": username})

# ====== RECEIPTS ======
def add_receipt(data): return receipts.insert_one(data)
def get_receipt_by_id(receipt_id): return receipts.find_one({"receipt_id": receipt_id})
def list_receipts(): return list(receipts.find())
def list_receipts_by_owner(owner): return list(receipts.find({"owner": owner}))
def update_receipt(receipt_id, new_data): return receipts.update_one({"receipt_id": receipt_id}, {"$set": new_data})
def delete_receipt(receipt_id): return receipts.delete_one({"receipt_id": receipt_id})

# ====== TRANSACTIONS ======
def add_transaction(data): return transactions.insert_one(data)
def get_transaction_by_receipt(receipt_id): return transactions.find_one({"receipt_id": receipt_id})
def list_transactions(): return list(transactions.find())
def list_transactions_by_employee(employee): return list(transactions.find({"employee": employee}))
def update_transaction(receipt_id, new_data): return transactions.update_one({"receipt_id": receipt_id}, {"$set": new_data})
def delete_transaction(receipt_id): return transactions.delete_one({"receipt_id": receipt_id})

# ====== BUDGETS ======
def add_budget(data): return budgets.insert_one(data)
def get_budget_by_employee(employee): return budgets.find_one({"employee": employee})
def list_budgets(): return list(budgets.find())
def update_budget(employee, new_data): return budgets.update_one({"employee": employee}, {"$set": new_data})
def delete_budget(employee): return budgets.delete_one({"employee": employee})
