import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import NavBar from './NavBar';
import BudgetWheel from './BudgetWheel';
import '../styles.css';
import { Calendar, Building2, CircleDollarSign, Rows3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [name, setName] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [totalAmnt, setTotalAmnt] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  const fetchBudgetInfo = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/manager/budget-summary/${user.email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Failed to fetch budget info' }));
        throw new Error(`(${res.status}) ${errorData.detail || 'Failed to fetch budget info'}`);
      }
      const data = await res.json();
      setBudget(data.budget || 0);
      setTotalAmnt(data.totalSpent || 0);
    } catch (fetchError) {
      console.error('Error fetching budget info:', fetchError);
      setError(prev => prev ? `${prev}\nFetch Budget Info Error: ${fetchError.message}` : `Fetch Budget Info Error: ${fetchError.message}`);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/transactions/employee/${user.email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Failed to fetch transactions' }));
        throw new Error(`(${res.status}) ${errorData.detail || 'Failed to fetch transactions'}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        const formattedTransactions = data.map(txn => ({
          receipt_id: txn.receipt_id,
          date: txn.date || 'N/A',
          business: txn.business || 'N/A',
          amount: txn.amount || 0,
          category: txn.category || 'Uncategorized',
          status: txn.status || 'pending'
        }));
        setTransactions(formattedTransactions);
      } else {
        console.error("Expected an array of transactions, received:", data);
        setTransactions([]);
      }
    } catch (fetchError) {
      console.error('Error fetching transactions:', fetchError);
      setError(prev => prev ? `${prev}\nFetch Transactions Error: ${fetchError.message}` : `Fetch Transactions Error: ${fetchError.message}`);
      setTransactions([]);
    }
  };

  useEffect(() => {
    if (!user || !user.email || !user.userId) {
      if (localStorage.getItem("user") === null && !user) {
        setIsLoading(false);
        setError("User not logged in.");
      }
      return;
    }

    const fetchAllData = async () => {
      await Promise.all([
        fetchTransactions(),
        fetchBudgetInfo()
      ]);
      setIsLoading(false);
    };

    fetchAllData();
  }, [user]);

  const percent = budget > 0 ? Math.round((totalAmnt / budget) * 100) : 0;

  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      const navEvent = new CustomEvent('start-navigation', { detail: path });
      window.dispatchEvent(navEvent);
    }
  };

  const handleRowClick = async (txn) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/receipts/${txn.receipt_id}`);
      if (!res.ok) throw new Error('Failed to fetch receipt details');
      const data = await res.json();
      setSelectedTransaction({ ...txn, image_base64: data.image_base64 });
      setIsEditing(false);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      alert('Failed to fetch receipt details.');
    }
  };

  const handleEditClick = async (txn) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/receipts/${txn.receipt_id}`);
      if (!res.ok) throw new Error('Failed to fetch receipt for editing');
      const data = await res.json();
      setSelectedTransaction({ ...txn, image_base64: data.image_base64 });
      setIsEditing(true);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching receipt for edit:', error);
      alert('Failed to fetch receipt.');
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/transactions/update/${selectedTransaction.receipt_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business: selectedTransaction.business,
          amount: selectedTransaction.amount,
          category: selectedTransaction.category,
          date: selectedTransaction.date
        }),
      });
  
      const result = await res.json();  // 🆕 important to check backend response
  
      if (!res.ok) {
        throw new Error(result.detail || 'Failed to update');
      }
  
      alert('Transaction updated!');
      setShowModal(false);
  
      // ✅ Properly refresh the transactions list
      await fetchTransactions();
  
    } catch (error) {
      console.error('Error saving edit:', error);
      alert('Failed to save changes: ' + error.message);
    }
  };
  
  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="home-container">
          <h1 className="home-title">Loading...</h1>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="home-container">
          <h1 className="home-title">Error Loading Data</h1>
          <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error}</p>
          <p>Please try refreshing the page or logging out and back in.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="home-container">
        <h1 className="home-title">Hello {name}</h1>
        <div className="home-main">
          <div className="home-transactions">
            <h3 style={{ fontWeight: "300", fontSize: "1.3em" }}>Recent Transactions</h3>
            <div className="table-container">
              <table className="home-table">
                <thead>
                  <tr>
                    <th className="thHome"><div className="thIcon"><Calendar className='thIcons' />Date</div></th>
                    <th className="thHome"><div className="thIcon"><Building2 className='thIcons' />Business</div></th>
                    <th className="thHome"><div className="thIcon"><CircleDollarSign className='thIcons' />Amount</div></th>
                    <th className="thHome"><div className="thIcon"><Rows3 className='thIcons' />Category</div></th>
                    <th className="thHome">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                        No transactions yet.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((txn) => (
                      <tr key={txn.receipt_id} onClick={() => handleRowClick(txn)}>
                        <td>{txn.date}</td>
                        <td>{txn.business}</td>
                        <td>${parseFloat(txn.amount).toFixed(2)}</td>
                        <td>{txn.category}</td>
                        <td>
                          {txn.status === "pending" && (
                            <button onClick={(e) => { e.stopPropagation(); handleEditClick(txn); }}>
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "1.5em" }} className="submit-button" onClick={() => handleNavigation('/receipts')}>
              Submit New Transaction
            </div>
          </div>
          <div className="home-budget">
            <h3 className='thHome'>Budget Overview</h3>
            <BudgetWheel percent={percent} />
            <p>${totalAmnt.toFixed(2)} / ${budget.toFixed(2)}</p>
            <p>{transactions.length} Transaction(s) this period</p>
            <button className="refresh-button" onClick={fetchBudgetInfo}>
              Refresh Budget
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showModal && selectedTransaction && (
        <div className="modal-overlay">
          <div className="modal-content">
            {isEditing ? (
              <>
                <h2>Edit Transaction</h2>
                <input type="text" value={selectedTransaction.business} onChange={(e) => setSelectedTransaction({ ...selectedTransaction, business: e.target.value })} className="receiptInput" placeholder="Business" />
                <input type="text" value={selectedTransaction.date} onChange={(e) => setSelectedTransaction({ ...selectedTransaction, date: e.target.value })} className="receiptInput" placeholder="Date" />
                <input type="number" value={selectedTransaction.amount} onChange={(e) => setSelectedTransaction({ ...selectedTransaction, amount: parseFloat(e.target.value) })} className="receiptInput" placeholder="Amount" />
                <input type="text" value={selectedTransaction.category} onChange={(e) => setSelectedTransaction({ ...selectedTransaction, category: e.target.value })} className="receiptInput" placeholder="Category" />
                <button className="submit-button" onClick={handleSaveEdit}>Save Changes</button>
                <button className="submit-button" onClick={() => setShowModal(false)}>Cancel</button>
              </>
            ) : (
              <>
                <h2>Receipt Image</h2>
                {selectedTransaction.image_base64 ? (
                  <img src={`data:image/jpeg;base64,${selectedTransaction.image_base64}`} alt="Receipt" style={{ maxWidth: '100%', height: 'auto' }} />
                ) : (
                  <p>No receipt image available.</p>
                )}
                <button className="submit-button" onClick={() => setShowModal(false)}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
