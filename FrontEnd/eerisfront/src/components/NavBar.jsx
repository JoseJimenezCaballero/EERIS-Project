import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';

function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useUser(); // ✅ access role from context
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  let role;

  if(user){
    role = user.role;
  }

  const handleLogout = () => {
    logout();           // clear user from context
    navigate('/login'); // redirect to login page
  };

  return (
    <div className="NavBar-container">
      <div className="NavBar-text">
        <h3 className="NavBar-title">EERIS Project</h3>
        {role === 'Employee' && <h4 className="NavBar-links" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>Home</h4>}
        {role === 'Employee' && <h4 className="NavBar-links" style={{ cursor: 'pointer' }} onClick={() => navigate('/receipts')}>Submit Receipt</h4>}

        {/* ✅ Fix route path to match App.jsx */}
        {role === 'manager' && (
          <h4 className="NavBar-links" style={{ cursor: 'pointer' }} onClick={() => navigate('/manager')}>
            Approve Transactions
          </h4>
        )}

        {/* ✅ Fix route path to match App.jsx */}
        {role === 'hr' && (
          <h4 className="NavBar-links" style={{ cursor: 'pointer' }} onClick={() => navigate('/hr')}>
            Manage Employees
          </h4>
        )}
      </div>
      {!isLoginPage && <div className="NavBar-LoginBTN" onClick={handleLogout}>Log Out</div>}
    </div>
  );
}

export default NavBar;

