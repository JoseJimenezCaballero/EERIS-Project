import React, { useState } from 'react';
import NavBar from './NavBar';
import { useUser } from './UserContext'; // ✅ import context
import { ImageUp, Calendar, Building2, CircleDollarSign, Rows3 } from 'lucide-react';

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
  if (!file || !user?.email) {
    alert("Please log in before uploading a receipt.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', user.email);

  try {
    const res = await fetch('http://127.0.0.1:8000/api/receipts/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to parse receipt image');

    const { parsed } = await res.json();

    setReceiptData(prev => ({
      ...prev,
      business: parsed.business || '',
      date: parsed.date || '',
      amount: parsed.amount || ''
    }));

    alert('Receipt image parsed! Please confirm details and choose a category.');
  } catch (error) {
    console.error('Error parsing image:', error);
    alert(`Failed to parse receipt: ${error.message}`);
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
          <div className="upload-icon"><ImageUp size={64}/></div>
          <h3 style={{fontWeight:"300", fontSize:"1.3em", margin:"0", marginTop:"1em"}}>Upload Receipt Image Here</h3>
          <p style={{fontWeight:"200", width:"88%", fontSize:"0.9em", margin:"0", marginBottom:"2em"}}>We will parse some info automatically. Any remaining info will need to be filled manually.</p>
          <label className="file-upload">
            Upload Receipt
            <input 
              type="file" 
              className="file-input" 
              onChange={handleFileChange}
              accept='image/*'
              />
            </label>
        </div>

        {/* Form */}
        <form className="receipt-form" onSubmit={handleSubmit}>
          <h2>Receipt Information</h2>
          <input
            type="text"
            name="date"
            value={receiptData.date}
            onChange={handleChange}
            placeholder={'Date'}
            required
            className='receiptInput'
          />

          <input
            type="text"
            name="business"
            value={receiptData.business}
            onChange={handleChange}
            required
            placeholder='Business'
            className='receiptInput'
          />

          <select
            name="category"
            value={receiptData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>Category</option>
            <option value="Food">Food</option>
            <option value="Merchandise">Merchandise</option>
            <option value="Supplies">Supplies</option>
            <option value="Software">Software</option>
            <option value="Bills">Bills</option>
          </select>


          <input
            type="number"
            name="amount"
            value={receiptData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            placeholder='Amount'
            className='receiptInput'
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
