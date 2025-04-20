import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Use the updated context
import NavBar from './NavBar';
import BudgetWheel from './BudgetWheel';
import '../styles.css'; // Make sure styles are imported

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Get the user object from context
  const [name, setName] = useState(''); // User's display name
  const [transactions, setTransactions] = useState([]); // Transactions array
  const [budget, setBudget] = useState(0); // Allotted budget
  const [totalAmnt, setTotalAmnt] = useState(0); // Total spent from budget info
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchBudgetInfo = async () => {
    try {
      // --- Use the correct GET endpoint with userEmail in the path ---
      const res = await fetch(`http://127.0.0.1:8000/api/manager/budget-summary/${user.email}`, { // <-- CORRECTED URL and uses userEmail
        method: 'GET', // <-- CHANGE TO GET
        headers: { 'Content-Type': 'application/json' },
        // NO body needed for GET request
      });
      // --- End endpoint correction ---

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

  useEffect(() => {
    // Ensure user object is loaded before fetching
    if (!user || !user.email || !user.userId) {
      if (localStorage.getItem("user") === null && !user) {
           setIsLoading(false);
           setError("User not logged in.");
      }
      // If essential info is missing, don't proceed with fetches
      return;
    }

    // --- Get user details directly from context ---
    const userEmail = user.email;
   // Used for budget info call
    const userFirstName = user.firstName || 'User'; // Use firstName from context, fallback to 'User'
    setName(userFirstName); // Set name directly
    // --- End user details from context ---

    setIsLoading(true);
    setError(null);
    setTransactions([]);
    setBudget(0);
    setTotalAmnt(0);

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/transactions/employee/${userEmail}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
           const errorData = await res.json().catch(() => ({ detail: 'Failed to fetch transactions' }));
           // Append status code to error message for clarity
           throw new Error(`(${res.status}) ${errorData.detail || 'Failed to fetch transactions'}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          const formattedTransactions = data.map(txn => ({
            receipt_id: txn.receipt_id,
            date: txn.date || 'N/A',
            business: txn.business || 'N/A',
            amount: txn.amount || 0,
            category: txn.category || 'Uncategorized'
          }));
          setTransactions(formattedTransactions);
        } else {
          console.error("Expected an array of transactions, received:", data);
          setTransactions([]);
        }
      } catch (fetchError) {
        console.error('Error fetching transactions:', fetchError);
        // Use specific error message from catch
        setError(prev => prev ? `${prev}\nFetch Transactions Error: ${fetchError.message}` : `Fetch Transactions Error: ${fetchError.message}`);
        setTransactions([]);
      }
    };

    const fetchBudgetInfo = async () => {
      try {
        // --- Use the correct GET endpoint with userEmail in the path ---
        const res = await fetch(`http://127.0.0.1:8000/api/manager/budget-summary/${userEmail}`, { // <-- CORRECTED URL and uses userEmail
          method: 'GET', // <-- CHANGE TO GET
          headers: { 'Content-Type': 'application/json' },
          // NO body needed for GET request
        });
        // --- End endpoint correction ---

        if (!res.ok) {
           const errorData = await res.json().catch(() => ({ detail: 'Failed to fetch budget info' }));
           throw new Error(`(${res.status}) ${errorData.detail || 'Failed to fetch budget info'}`);
        }
        const data = await res.json();
        console.log(data,"budget")
        setBudget(data.budget || 0);
        setTotalAmnt(data.totalSpent || 0);
      } catch (fetchError) {
        console.error('Error fetching budget info:', fetchError);
        setError(prev => prev ? `${prev}\nFetch Budget Info Error: ${fetchError.message}` : `Fetch Budget Info Error: ${fetchError.message}`);
      }
    };

    // --- REMOVED fetchUserName function ---

    // Run remaining fetches
    const fetchAllData = async () => {
        // Only fetch transactions and budget info now
        await Promise.all([
            fetchTransactions(),
            fetchBudgetInfo()
        ]);
        setIsLoading(false); // Set loading to false after fetches attempt
    };

    fetchAllData();

  }, [user]); // Re-run effect when user object changes

  const handleSubmitClick = () => {
    navigate('/receipts');
  };

  const percent = budget > 0 ? Math.round((totalAmnt / budget) * 100) : 0;

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

    // Display specific errors if they occurred
    if (error) {
        return (
          <>
            <NavBar />
            <div className="home-container">
              <h1 className="home-title">Error Loading Data</h1>
              {/* Display the detailed error messages */}
              <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error}</p>
              <p>Please try refreshing the page or logging out and back in.</p>
            </div>
          </>
        );
    }
    console.log(transactions)
  // Main content rendering remains the same...
  return (
    <>
      <NavBar />
      <div className="home-container">
        <h1 className="home-title">Hello {name}!</h1>
        <div className="home-main">
          <div className="home-transactions">
            <h3>Recent Transactions</h3>
            <div className="table-container">
              <table className="home-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Business</th>
                    <th>Amount</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                        No transactions yet.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((txn) => (
                      <tr key={txn.receipt_id}>
                        <td>{txn.date}</td>
                        <td>{txn.business}</td>
                        <td>${parseFloat(txn.amount).toFixed(2)}</td>
                        <td>{txn.category}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <button className="submit-button" onClick={handleSubmitClick}>
              Submit New Transaction
            </button>
          </div>
          <div className="home-budget">
            <h3>Budget Overview</h3>
            <BudgetWheel percent={percent} />
            <p>${totalAmnt.toFixed(2)} / ${budget.toFixed(2)}</p>
            <p>{transactions.length} Transaction(s) this period</p>
            <button className="refresh-button" onClick={fetchBudgetInfo}>
              🔁 Refresh Budget
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;