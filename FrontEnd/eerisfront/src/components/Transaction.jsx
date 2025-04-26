import {ReactComponent as ApproveFill} from '../images/approveFill.svg'
import {ReactComponent as DenyFill} from '../images/denyFill.svg'
import { useState } from 'react';
import {CircleCheck, CircleSlash} from 'lucide-react';

function Transaction({transId, date, employee, amount }) {
    
    const [decision, setDecision] = useState(null); // null | 'approve' | 'deny'


    /*function to handle the click of either of the approve or deny links. It will send an approve or deny to the back
      end with the transaction id
      */
    // const handleDecision = async (decision) => {
    //     setDecision(decision);
    //     try {
    //       const res = await fetch('', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           transId: transId,
    //           decision: decision, // 'approve' or 'deny'
    //         }),
    //       });
    
    //       if (!res.ok) {
    //         throw new Error('Request failed');
    //       }
    
    //       const data = await res.json();
    //       console.log(`Transaction ${transId} ${decision}ed:`, data);
    
    //     } catch (error) {
    //       console.error('Error sending decision:', error);
    //     }
    //   };

      const handleDecision = async (decision) => {
        setDecision(decision);
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/transactions/${transId}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: decision === 'approve' ? 'approved' : 'rejected'
            }),
          });
      
          if (!res.ok) throw new Error('Request failed');
          
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
              <CircleCheck style={{color:"#0FF0FC"}} className="actualIcons" />
            ) : decision === 'deny' ? (
              <CircleSlash style={{color:"#0FF0FC"}} className="actualIcons" />
            ) : (
              <>
                <CircleCheck
                  className="actualIcons"
                  onClick={() => handleDecision('approve')}
                  style={{ cursor: 'pointer', color:"rgba(0, 214, 143, 0.55)" }}
                />
                <CircleSlash
                  className="actualIcons"
                  onClick={() => handleDecision('deny')}
                  style={{ cursor: 'pointer', color:"rgba(255, 76, 91, 0.55)"}}
                />
              </>
            )}
          </div>
        </div>
      );
    }

export default Transaction;
