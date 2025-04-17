import React, { useState } from 'react';
import NavBar from './NavBar';
import { useUser } from './UserContext'; // ✅ import context

const ReceiptPage = () => {
  const { userId } = useUser(); // ✅ get userId from context

  const [receiptData, setReceiptData] = useState({
    date: '',
    business: '',
    category: '',
    amount: '',
  });


//handle file upload + OCR fetch
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);      // append the file
  formData.append('userId', userId);  // append the userId

  try {
    const res = await fetch('', {
      method: 'POST',
      body: formData, // no content-type, let browser set it
    });

    if (!res.ok) throw new Error('Failed to parse receipt image');

    const data = await res.json();

    //populate fields from backend response
    setReceiptData((prev) => ({
      ...prev,
      ...data,
    }));

    //show success alert
    alert('Receipt image parsed successfully! Please review the details.');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

  const handleChange = (e) => {
    setReceiptData({
      ...receiptData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...receiptData,
      userId, // ✅ include userId in request body
    };

    try {
      const res = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error('Failed to submit receipt');

      const result = await res.json();
      console.log('Transaction submitted:', result);

      //reset form
      setReceiptData({
        date: '',
        business: '',
        category: '',
        amount: '',
      });
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="receipt-page">
        {/* Upload box */}
        <div className="upload-box">
          <div className="upload-icon">📤</div>
          <h3>Upload Receipt Image Here</h3>
          <p>We will parse some info automatically. Any remaining info will need to be filled manually.</p>
          <input type="file" className="file-input" onChange={handleFileChange}/>
        </div>

        {/* Form */}
        <form className="receipt-form" onSubmit={handleSubmit}>
          <h2>Receipt Information</h2>

          <label>Date</label>
          <input
            type="text"
            name="date"
            value={receiptData.date}
            onChange={handleChange}
            required
          />

          <label>Business</label>
          <input
            type="text"
            name="business"
            value={receiptData.business}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <select
            name="category"
            value={receiptData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a category --</option>
            <option value="Food">Food</option>
            <option value="Merchandise">Merchandise</option>
            <option value="Supplies">Supplies</option>
            <option value="Software">Software</option>
            <option value="Bills">Bills</option>
          </select>





          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={receiptData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />


          <button type="submit" className="submit-button">
            Submit Transaction
          </button>
        </form>
      </div>
    </>
  );
};

export default ReceiptPage;
