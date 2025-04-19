# #fetch for adjust_budget


# # import requests

# # url = "http://127.0.0.1:8000/api/manager/adjust_data"
# # payload = {
# #     "userId": "alex@mail.com"  # or any manager's email/userId
# # }

# # response = requests.post(url, json=payload)

# # print("Status Code:", response.status_code)
# # try:
# #     print("Response JSON:", response.json())
# # except Exception:
# #     print("Response Text:", response.text)




# #fetch hr links
# import requests

# add_url = "http://127.0.0.1:8000/api/hr/add_employee"
# add_payload = {
#     "firstName": "Lena",
#     "lastName": "Patel",
#     "email": "lena@mail.com",
#     "budget": 2500,
#     "empId": "lena123",
#     "role": "Employee"
# }

# res = requests.post(add_url, json=add_payload)
# print("Add Employee:", res.status_code, res.json())

# list_url = "http://127.0.0.1:8000/api/hr/list_employees"
# list_payload = {
#     "userId": "hr@mail.com"  # or any HR user
# }

# res = requests.post(list_url, json=list_payload)
# print("\nList Employees:", res.status_code)
# print("Data:")
# for emp in res.json():
#     print(emp)

# update_url = "http://127.0.0.1:8000/api/hr/update_employee"
# update_payload = {
#     "firstName": "Lena",
#     "lastName": "Singh",
#     "email": "lena@mail.com",
#     "budget": 2800,
#     "empId": "lenaX",
#     "role": "Manager"
# }

# res = requests.patch(update_url, json=update_payload)
# print("\nUpdate Employee:", res.status_code, res.json())


# delete_url = "http://127.0.0.1:8000/api/hr/remove_employee/lena@mail.com"

# res = requests.delete(delete_url)
# print("\nRemove Employee:", res.status_code, res.json())

import requests

base_url = "http://127.0.0.1:8000/api/hr"

# 1️⃣ SubmitData - Add or Overwrite Employee
submit_payload = {
    "firstName": "Jose",
    "lastName": "Jimenez",
    "email": "jose@example.com",
    "budget": "500",
    "empId": "7",
    "role": "Manager"
}

res1 = requests.post(f"{base_url}/add_employee", json=submit_payload)
print("1️⃣ SubmitData:", res1.status_code, res1.json())

# 2️⃣ GetEmployees - POST with userId
get_payload = {
    "userId": "hr@mail.com"  # or any valid user
}

res2 = requests.post(f"{base_url}/list_employees", json=get_payload)
print("\n2️⃣ GetEmployees:", res2.status_code)
for emp in res2.json():
    print(emp)

# 3️⃣ DeleteEmployee - POST with empId
delete_payload = {
    "empId": "7"
}

res3 = requests.post(f"{base_url}/delete_employee", json=delete_payload)
print("\n3️⃣ DeleteEmployee:", res3.status_code, res3.json())
