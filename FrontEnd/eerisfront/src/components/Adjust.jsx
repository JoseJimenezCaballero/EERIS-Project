import {ReactComponent as Pencil} from '../images/pencil.svg'
import { useState } from 'react';

function Adjust({ empId, employee, amount }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(amount);
  const [displayAmount, setDisplayAmount] = useState(amount); // ✅ amount to show

  const handleSubmit = async () => {
    if (!newAmount) return;

    try {
      const res = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empId,
          amount: newAmount,
        }),
      });

      if (!res.ok) throw new Error('Failed to update amount');

      // ✅ Update the displayed amount
      setDisplayAmount(newAmount);
      setIsEditing(false);
      console.log(`Updated amount for ${employee} to ${newAmount}`);

    } catch (error) {
      console.error('Error updating amount:', error);
    }
  };
  

  return (
    <div className="transaction-container">
      <div className="transData">
        <span className="employee">{employee}</span>
        {isEditing ? (
          <input
            type="number"
            className="amountInput"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
        ) : (
          <span className="amount">{`$${displayAmount}`}</span>
        )}
      </div>
      <div>
        {isEditing ? (
          <button className="adjustAmntBTN" onClick={handleSubmit}>Submit</button>
        ) : (
          <Pencil className="pencilIcon" onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }} />
        )}
      </div>
    </div>
  );
  }
  
  export default Adjust;
  