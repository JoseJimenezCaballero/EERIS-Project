sample_user = {
    "username": "jane_doe",
    "password": "secure123",
    "role": "manager",  # can be "employee", "manager", or "hr"
    "name": "Jane Doe",
    "email": "jane@example.com"
}

sample_receipt = {
    "receipt_id": 101,
    "owner": "john_doe",
    "store": "Staples",
    "date": "2024-04-07",
    "items": [
        {"item": "Printer Paper", "price": 15.00},
        {"item": "Pens", "price": 5.50}
    ],
    "total": 20.50,
    "category": "Office Supplies",
    "sub_category": "Stationery",
    "image_url": "/images/receipt101.jpg"
}

sample_transaction = {
    "employee": "john_doe",
    "receipt_id": 101,
    "status": "pending",
    "submitted_at": "2024-04-07T12:00:00",
    "manager_review": None,
    "amount": 20.50
}

sample_budget = {
    "employee": "john_doe",
    "allocated": 500,
    "spent": 20.50,
    "department": "IT"
}
