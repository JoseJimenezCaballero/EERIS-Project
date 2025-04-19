# #fetch for links for manager:


import requests

BASE_URL = "http://127.0.0.1:8000/api/manager"
manager_id = "alex@mail.com"
emp_id = "jose123"  # employeeId = username

# 1️⃣ Fetch Transactions
res1 = requests.post(f"{BASE_URL}/fetch_transactions", json={"userId": manager_id})
print("\n1️⃣ FetchTransactions:", res1.status_code)
print(res1.json())

# 2️⃣ Handle Decision (approve 1 pending)
if res1.json():
    transId = res1.json()[0]["transId"]
    res2 = requests.patch(f"{BASE_URL}/status-by-transId", json={"transId": transId, "decision": "approved"})
    print("\n2️⃣ HandleDecision:", res2.status_code)
    print(res2.json())
else:
    print("\n2️⃣ No transactions to approve.")

# 3️⃣ Monthly Transactions
res3 = requests.post(f"{BASE_URL}/monthly_summary", json={"userId": manager_id})
print("\n3️⃣ MonthlyTransactions:", res3.status_code)
print(res3.json())

# 4️⃣ Generate Expense Report (PDF)
res4 = requests.post(f"{BASE_URL}/generate_expense_report", json={"employeeId": emp_id})
if res4.status_code == 200:
    with open("test_report.pdf", "wb") as f:
        f.write(res4.content)
    print("\n4️⃣ GenerateExpenseReport: ✅ Saved to test_report.pdf")
else:
    print("\n4️⃣ GenerateExpenseReport Failed:", res4.status_code, res4.text)

# 5️⃣ Employee Budgets
res5 = requests.post(f"{BASE_URL}/employee_budgets", json={"userId": manager_id})
print("\n5️⃣ EmployeeBudgets:", res5.status_code)
print(res5.json())

# 6️⃣ Adjust Budget
if res5.status_code == 200 and res5.json():
    first_emp = res5.json()[0]
    res6 = requests.patch(f"{BASE_URL}/adjust-budget-by-id", json={"empId": first_emp["empId"], "amount": 999})
    print("\n6️⃣ AdjustBudget:", res6.status_code)
    print(res6.json())
else:
    print("\n6️⃣ AdjustBudget: No employee data returned.")



# the following should result this:(venv) aastha@Aasthas-MBP-2 routes % python test.py
# 1️⃣ SubmitData: 200 {'message': 'Employee and budget added successfully'}

# 2️⃣ GetEmployees: 200
# {'empId': 'alex123', 'employee': 'alex@mail.com', 'role': 'Manager', 'firstName': 'Alex', 'lastName': 'Johnson', 'budget': 0}
# {'empId': 'alex123', 'employee': 'alex@mail.com', 'role': 'Manager', 'firstName': 'Alex', 'lastName': 'Johnson', 'budget': 0}
# {'empId': 'lena123', 'employee': 'lena@mail.com', 'role': 'Employee', 'firstName': 'Lena', 'lastName': 'Patel', 'budget': 0}
# {'empId': '7', 'employee': 'jose@example.com', 'role': 'Manager', 'firstName': 'Jose', 'lastName': 'Jimenez', 'budget': 500.0}
# {'empId': '7', 'employee': 'jose@example.com', 'role': 'Manager', 'firstName': 'Jose', 'lastName': 'Jimenez', 'budget': 500.0}

# 3️⃣ DeleteEmployee: 200 {'message': 'Deleted employee 7 (jose@example.com)'}

# import requests

# base_url = "http://127.0.0.1:8000/api/hr"

# # 1️⃣ SubmitData - Add or Overwrite Employee
# submit_payload = {
#     "firstName": "Jose",
#     "lastName": "Jimenez",
#     "email": "jose@example.com",
#     "budget": "500",
#     "empId": "7",
#     "role": "Manager"
# }

# res1 = requests.post(f"{base_url}/add_employee", json=submit_payload)
# print("1️⃣ SubmitData:", res1.status_code, res1.json())

# # 2️⃣ GetEmployees - POST with userId
# get_payload = {
#     "userId": "hr@mail.com"  # or any valid user
# }

# res2 = requests.post(f"{base_url}/list_employees", json=get_payload)
# print("\n2️⃣ GetEmployees:", res2.status_code)
# for emp in res2.json():
#     print(emp)

# # 3️⃣ DeleteEmployee - POST with empId
# delete_payload = {
#     "empId": "7"
# }

# res3 = requests.post(f"{base_url}/delete_employee", json=delete_payload)
# print("\n3️⃣ DeleteEmployee:", res3.status_code, res3.json())
