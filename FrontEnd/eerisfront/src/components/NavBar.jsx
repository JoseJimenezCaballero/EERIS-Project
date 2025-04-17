import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';


function NavBar() {
  const navigate = useNavigate();
  const { role } = useUser(); // ✅ access role from context

  return (
    <div className="NavBar-container">
        <div className="NavBar-text">
            <h3 className="NavBar-title">EERIS Project</h3>
            <h4 className="NavBar-links" style={{cursor:'pointer'}} onClick={() => navigate('/home')}>Home</h4>
            <h4 className="NavBar-links" style={{cursor:'pointer'}} onClick={() => navigate('/receipts')}>Submit Receipt</h4>
            { role === 'manager' && <h4 className="NavBar-links" style={{cursor:'pointer'}} onClick={() => navigate('/approveTransactions')}>Approve Transactions</h4>}
            { role === 'hr' && <h4 className="NavBar-links" style={{cursor:'pointer'}} onClick={() => navigate('/hrpage')}>Manage Employees</h4>}
        </div>

    </div>
  );
}

export default NavBar;
