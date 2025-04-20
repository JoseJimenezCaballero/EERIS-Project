import NavBar from './NavBar';
import {ReactComponent as Fileplus} from '../images/filePlus.svg'
import {ReactComponent as FileMinus} from '../images/fileMinus.svg'
import {ReactComponent as FilePencil} from '../images/filePencil.svg'
import Transaction from './Transaction';
import { useEffect, useState } from 'react';
import Summary from './Sumarry';
import Adjust from './Adjust';
import { useUser } from './UserContext';


function ManagerApprovalPage() {
  const { userId } = useUser();
  const [choice, setChoice] = useState("approve");
  const [transactions, setTransactions] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [adjustData, setAdjustData] = useState([]);

  // useEffect(() => { //for transactions
  //   if (choice !== 'approve') return; // ✅ only fetch if approve is selected

  //   const fetchTransactions = async () => {
  //     try {
  //       const res = await fetch('', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ userId }),
  //       });

  //       if (!res.ok) throw new Error('Failed to fetch transactions');

  //       const data = await res.json(); // expected: array of {date, employee, amount}
  //       setTransactions(data); // or setTransactions(data.transactions) if wrapped
  //     } catch (err) {
  //       console.error('Error loading transactions:', err);
  //     }
  //   };

  //   fetchTransactions();
  // }, [userId, choice]);

  useEffect(() => {
    if (choice !== 'approve') return;
  
    const fetchTransactions = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/transactions/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (!res.ok) throw new Error('Failed to fetch transactions');
        const data = await res.json();
  
        // ✅ Filter only pending ones on frontend
        const pendingTransactions = data.filter(txn => txn.status === 'pending');
        setTransactions(pendingTransactions);
      } catch (err) {
        console.error('Error loading transactions:', err);
      }
    };
  
    fetchTransactions();
  }, [choice]);

  

  // useEffect(() => {//for summary
  //   if (choice !== 'summary') return;
  
  //   const fetchSummaryData = async () => {
  //     try {
  //       const res = await fetch('', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ userId }),
  //       });
  
  //       if (!res.ok) throw new Error('Failed to fetch summary data');
  
  //       const data = await res.json(); // expected: [{ empId, date, employee, amount }]
  //       setSummaryData(data);
  //     } catch (err) {
  //       console.error('Error loading summary data:', err);
  //     }
  //   };
  
  //   fetchSummaryData();
  // }, [userId, choice]);


  useEffect(() => {
    if (choice !== 'summary') return;
  
    const fetchSummaryData = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/transactions/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (!res.ok) throw new Error('Failed to fetch summary data');
  
        const data = await res.json();
  
        // ✅ Filter out only approved or rejected transactions
        const filteredData = data.filter(txn => txn.status !== 'pending');
        setSummaryData(filteredData);
      } catch (err) {
        console.error('Error loading summary data:', err);
      }
    };
  
    fetchSummaryData();
  }, [choice]);

  

  useEffect(() => {
    if (choice !== 'adjust') return;
  
    const fetchAdjustData = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/manager/employee_budgets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: "test" })
        });
  
        if (!res.ok) throw new Error('Failed to fetch adjust data');
  
        const data = await res.json(); // expected: [{ empId, employee, budget }]
        setAdjustData(data);
      } catch (err) {
        console.error('Error loading adjust data:', err);
      }
    };
  
    fetchAdjustData();
  }, [userId, choice]);

  // useEffect(() => {
  //   if (choice !== 'adjust') return;
  
  //   const fetchAdjustData = async () => {
  //     try {
  //       const res = await fetch('http://127.0.0.1:8000/api/manager/adjust_budget', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           empId: "jose@mail.com",
  //           amount: 3000,
  //         }),
  //       });
  
  //       if (!res.ok) throw new Error('Failed to fetch adjust data');
  
  //       const data = await res.json(); // expected: [{ empId, employee, budget }]
  //       console.log("Adjust Data:", data);
  //       setAdjustData(data);
  //     } catch (err) {
  //       console.error('Error loading adjust data:', err);
  //     }
  //   };
  
  //   fetchAdjustData();
  // }, [choice]);
  

  return (
    <div className="">
      <NavBar />
          <div className="ManagerAppContainer">
              <div className="ManagerApp-leftWidgetContainer">
                  <div className="approve" style={{cursor:"pointer"}} onClick={()=>setChoice("approve")}>
                    <Fileplus className="leftWidgetIcons plus"/>
                    <span className='plusSpan'>Approve Transactions</span>
                  </div>
                  <div className="summary" style={{cursor:"pointer"}} onClick={()=>setChoice("summary")}>
                    <FileMinus className="leftWidgetIcons minus"/>
                    <span className='minusSpan'>View Summary</span>
                  </div>
                  <div className="adjust" style={{cursor:"pointer"}} onClick={()=>setChoice("adjust")}>
                    <FilePencil className="leftWidgetIcons penicl"/>
                    <span className='pencilSpan'>Adjust Budgets</span>
                  </div>
              </div>
              <div className="ManagerApp-rightWidgetContainer">
                { choice === 'approve' && <h1>Transactions</h1>}
                { choice === 'summary' && <h1>Monthly Summary</h1>}
                { choice === 'adjust' && <h1>Employee Budgets</h1>}
                <div className="innerContainer">
                    <div className="header">
                      <span className='text'>{choice !== 'adjust' ? 'Date' : 'Employee'}</span>
                      {choice !== 'adjust' && <span className='text'>Employee</span>}
                      <span className={choice !== 'adjust' ? 'text' : 'budgetText'}>{choice !== 'adjust' ? 'Amount' : 'Budget'}</span>
                    </div>
                    <div className="body">
                      {choice === 'approve' ? (
                        transactions.map((trans, index) => (
                          <Transaction /* NEEDS TRANS ID */
                            key={trans._id || index}
                            transId={trans._id}
                            date={trans.date}
                            employee={trans.employee}
                            amount={trans.amount}
                          />
                        ))
                      ) : choice === 'summary' ? (
                        summaryData.map((empData, index) => (
                          <Summary /* NEEDS EMP ID */
                            key={index || empData.empId}
                            empId={empData.empId}
                            date={empData.date}
                            employee={empData.employee}
                            amount={empData.amount}
                          />
                        ))
                      ) : (
                        adjustData.map((empData, index) => (
                          <Adjust
                            key={index}
                            empId={empData.email}            // ✅ Now this is the actual email
                            employee={empData.employee}
                            amount={empData.budget}
                          />
                        ))
                      )}
                    </div>
                </div>
            </div>
      </div>
    </div>
  );
}

export default ManagerApprovalPage;
