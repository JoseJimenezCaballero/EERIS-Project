import React from 'react';
import NavBar from './NavBar';
import '../styles.css';

const HomePage = () => {
  return (
    <>
      <NavBar />
      <div className="home-container">
        <h1 className="home-title">Hello Employee!</h1>

        <div className="home-main">
          <div className="home-transactions">
            <table className="home-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Business</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Placeholder row */}
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                    {/* You can map transactions here later */}
                  </td>
                </tr>
              </tbody>
            </table>

            <button className="submit-button">Submit New Transaction</button>
          </div>

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
