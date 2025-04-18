import React, { useState } from 'react';
import NavBar from './NavBar';
import { useUser } from './UserContext'; // ✅ import context

const ReceiptPage = () => {
  const { user } = useUser(); // ✅ get userId from context

  const [receiptData, setReceiptData] = useState({
    date: '',
    business: '',
    category: '',
    amount: '',
  });


//handle file upload + OCR fetch
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  // --- ADD CHECK FOR USER ---
  if (!file || !user || !user.userId) {
      alert("Please log in before uploading a receipt."); // Or handle appropriately
      return;
  }
  // --- END CHECK ---

  const formData = new FormData();
  formData.append('file', file);
  // --- CORRECTED USERID ACCESS ---
  formData.append('userId', user.userId); // Access userId from user object
  // --- END CORRECTION ---

  try {
    // Reminder: URL was previously empty here too. Make sure it's correct.
    const res = await fetch('http://127.0.0.1:8000/api/receipts/upload', { // Ensure URL is correct
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to parse receipt image');
    const data = await res.json();
    setReceiptData((prev) => ({ ...prev, ...data }));
    alert('Receipt image parsed successfully! Please review the details.');
  } catch (error) {
    console.error('Error uploading file:', error);
    alert(`Error parsing receipt: ${error.message}`);
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

  // --- ADD CHECK FOR USER ---
  if (!user || !user.userId) {
      alert("Please log in before submitting a receipt."); // Or handle appropriately
      return;
  }
  // --- END CHECK ---


  const dataToSend = {
      ...receiptData,
      userId: user.email, // ✅ Use email for consistency
    };

  try {
    const res = await fetch('http://127.0.0.1:8000/api/receipts/upload', { // Ensure URL is correct
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    if (!res.ok) {
       const errorData = await res.json().catch(() => ({ detail: 'Failed to submit receipt' }));
       console.error('Backend error:', errorData);
       throw new Error(errorData.detail || 'Failed to submit receipt');
    }

    const result = await res.json();
    console.log('Transaction submitted:', result);
    alert('Receipt submitted successfully!');

    setReceiptData({ date: '', business: '', category: '', amount: '' });
  } catch (error) {
    console.error('Submission error:', error);
    alert(`Submission failed: ${error.message}`);
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
