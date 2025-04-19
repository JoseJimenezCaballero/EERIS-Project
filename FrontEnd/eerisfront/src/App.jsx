// import './styles.css';
// import NavBar from './components/NavBar';

// function App() {
//   return (
//     <div className="App">
//       <NavBar />
//     </div>
//   );
// }

// export default App;


import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ManagerApprovalPage from './components/ManagerApprovalPage';
import HRPage from './components/HRPage';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/manager" element={<ManagerApprovalPage />} />
          <Route path="/hr" element={<HRPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
