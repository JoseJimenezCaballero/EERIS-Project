import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import NavBar from './NavBar';
import BudgetWheel from './BudgetWheel';

const HomePage = () => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [name, setName] = useState(''); //store the user's name
  const [transactions, setTransactions] = useState([]); //state for transactions
  const [budget, setBudget] = useState(0);//allotted budget for emp
  const [totalAmnt, setTotalAmnt] = useState(0);//total amount of money emp has spent

  useEffect(() => {//useffect hook will call back end for users name with userId and get all recent transactions
    const fetchUserName = async () => {
      try {
        const res = await fetch('', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error('Failed to fetch user name');

        const data = await res.json();
        setName(data.name); // assuming { name: "..." }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await fetch('', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error('Failed to fetch transactions');

        const data = await res.json();
        setTransactions(data.transactions); // assuming { transactions: [...] }array of objects
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchBudgetInfo = async () => {
      try {
        const res = await fetch('', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
    
        if (!res.ok) throw new Error('Failed to fetch budget info');
    
        const data = await res.json();
        // Assuming response looks like: { budget: 100, totalSpent: 80 }
        setBudget(data.budget);
        setTotalAmnt(data.totalSpent);
      } catch (error) {
        console.error('Error fetching budget info:', error);
      }
    };

    fetchUserName();
    fetchTransactions(); //make all 3 api calls
    fetchBudgetInfo();
  }, [userId]);

  const handleSubmitClick = () => {
    navigate('/receipts');
  };


  //used for calculating the percentage
  const percent = budget > 0 ? Math.round((totalAmnt / budget) * 100) : 0;


  return (
    <>
      <NavBar />
      <div className="home-container">
        <h1 className="home-title">{"Hello " + name + '!'}</h1>

        <div className="home-main">
          {/* Transactions Widget */}
          <div className="home-transactions">
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
                    transactions.map((txn, index) => (
                      <tr key={index}>
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

          {/* Budget Widget */}
          <div className="home-budget">
            <h3>Budget</h3>
            <BudgetWheel percent={percent} />
            <p>${totalAmnt} / ${budget}</p>
            <p>{transactions.length} Transactions</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
