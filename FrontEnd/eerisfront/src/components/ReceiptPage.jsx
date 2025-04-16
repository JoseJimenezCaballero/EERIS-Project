import React, { useState } from 'react';
import NavBar from './NavBar';
import '../styles.css';

const ReceiptPage = () => {
  const [receiptData, setReceiptData] = useState({
    date: '',
    business: '',
    amount: '',
  });

  const handleChange = (e) => {
    setReceiptData({
      ...receiptData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Transaction submitted:', receiptData);
    // TODO: Send to backend
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
          <input type="file" className="file-input" />
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
