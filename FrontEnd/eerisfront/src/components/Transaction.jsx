import {ReactComponent as Approve} from '../images/approve.svg'
import {ReactComponent as Deny} from '../images/deny.svg'
import {ReactComponent as ApproveFill} from '../images/approveFill.svg'
import {ReactComponent as DenyFill} from '../images/denyFill.svg'
import { useState } from 'react';

function Transaction({transId, date, employee, amount }) {
    
    const [decision, setDecision] = useState(null); // null | 'approve' | 'deny'


    /*function to handle the click of either of the approve or deny links. It will send an approve or deny to the back
      end with the transaction id
      */
    const handleDecision = async (decision) => {
        setDecision(decision);
        try {
          const res = await fetch('', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transId: transId,
              decision: decision, // 'approve' or 'deny'
            }),
          });
    
          if (!res.ok) {
            throw new Error('Request failed');
          }
    
          const data = await res.json();
          console.log(`Transaction ${transId} ${decision}ed:`, data);
    
        } catch (error) {
          console.error('Error sending decision:', error);
        }
      };


      return (
        <div className="transaction-container">
          <div className="transData">
            <span className="date">{date}</span>
            <span className="employee">{employee}</span>
            <span className="amount">{amount}</span>
          </div>
          <div className="transIcons">
            {decision === 'approve' ? (
              <ApproveFill className="actualIcons" />
            ) : decision === 'deny' ? (
              <DenyFill className="actualIcons" />
            ) : (
              <>
                <Approve
                  className="actualIcons"
                  onClick={() => handleDecision('approve')}
                  style={{ cursor: 'pointer' }}
                />
                <Deny
                  className="actualIcons"
                  onClick={() => handleDecision('deny')}
                  style={{ cursor: 'pointer' }}
                />
              </>
            )}
          </div>
        </div>
      );
    }

export default Transaction;
