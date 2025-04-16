import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import '../styles.css';

const HomePage = () => {
  const navigate = useNavigate();

  // Replace this with fetched data later
  const transactions = [];

  const handleSubmitClick = () => {
    navigate('/receipts');
  };

  return (
    <>
      <NavBar />
      <div className="home-container">
        <h1 className="home-title">Hello Employee!</h1>

        <div className="home-main">
          {/* Transactions Widget */}
          <div className="home-transactions">
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

            <button className="submit-button" onClick={handleSubmitClick}>
              Submit New Transaction
            </button>
          </div>

          {/* Budget Widget */}
          <div className="home-budget">
            <h3>Budget</h3>
            <div className="budget-circle">
              <div className="budget-percent">80%</div>
            </div>
            <p>$80 / $100</p>
            <p>66 Transactions</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
