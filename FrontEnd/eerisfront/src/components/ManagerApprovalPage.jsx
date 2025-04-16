import NavBar from './NavBar';
import {ReactComponent as Fileplus} from '../images/filePlus.svg'
import {ReactComponent as FileMinus} from '../images/fileMinus.svg'
import {ReactComponent as FilePencil} from '../images/filePencil.svg'
import Transaction from './Transaction';
import { useState } from 'react';
import Summary from './Sumarry';
import Adjust from './Adjust';

//**TEST DATA FOR TRANSACTION COMPONENT **/
const data = [
  {date:'12/10/25', employee:'Jose J.', amount:'$10'},
  {date:'12/09/25', employee:'Luis J.', amount:'$30'},
  {date:'12/07/25', employee:'Alex J.', amount:'$50'},
  {date:'12/07/25', employee:'Alex J.', amount:'$50'},
  {date:'12/07/25', employee:'Alex J.', amount:'$50'},
  {date:'12/07/25', employee:'Alex J.', amount:'$50'},
  {date:'12/07/25', employee:'Alex J.', amount:'$50'},
  {date:'12/07/25', employee:'Alex J.', amount:'$50'},
  {date:'12/07/25', employee:'Alex J.', amount:'$50'},
];

//**TEST DATA FOR SUMMARY COMPONENT **/
const data2 = [
  {date:'December', employee:'Jose J.', amount:'$130'},
  {date:'December', employee:'Alex J.', amount:'$170'},
  {date:'November', employee:'Alex J.', amount:'$90'},
  {date:'November', employee:'Luis J.', amount:'$910'},
];

//**TEST DATA FOR ADJUST COMPONENT **/

  const data3 = [
    {employee:'Jose J.', budget:300},
    {employee:'Alex J.', budget:200},
    {employee:'Luis J.', budget:350},
  ];



function ManagerApprovalPage() {
  const [choice, setChoice] = useState("approve");
  console.log(choice)

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
                        data.map((trans, index) => (
                          <Transaction /* NEEDS TRANS ID */
                            key={index}
                            date={trans.date}
                            employee={trans.employee}
                            amount={trans.amount}
                          />
                        ))
                      ) : choice === 'summary' ? (
                        data2.map((empData, index) => (
                          <Summary /* NEEDS EMP ID */
                            key={index}
                            date={empData.date}
                            employee={empData.employee}
                            amount={empData.amount}
                          />
                        ))
                      ) : (
                        data3.map((empData, index) => (
                          <Adjust /* NEEDS EMP ID */
                            key={index}
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
