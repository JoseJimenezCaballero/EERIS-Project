import NavBar from './NavBar';
import { useState, useEffect } from 'react';
import {ReactComponent as Fileplus} from '../images/filePlus.svg'
import {ReactComponent as FileMinus} from '../images/fileMinus.svg'
import {ReactComponent as FilePencil} from '../images/filePencil.svg'
import Employee from './Employee';
import ModifyEmployee from './ModifyEmployee';
import {ReactComponent as Pencil} from '../images/pencil.svg'
import { useUser } from './UserContext';

function HRPage() {
    const [choice, setChoice] = useState("add");

    // ✅ Form state for adding an employee
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [budget, setBudget] = useState('');
    const [username, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [employees, setEmployees] = useState([]);

    const { userId } = useUser();

    useEffect(() => { //for remove components
      if (choice !== 'remove') return;

      const fetchEmployees = async () => {
        try {
          const res = await fetch('http://127.0.0.1:8000/api/hr/list_employees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });

          if (!res.ok) throw new Error('Failed to fetch employees');

          const data = await res.json(); // expected: array of employees
          setEmployees(data);
        } catch (err) {
          console.error('Error loading employees:', err);
        }
      };

      fetchEmployees();
    }, [userId, choice, employees]);

    const handleSubmit = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/hr/add_employee', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName:firstName,
              lastName:lastName,
              email:email,
              budget:budget,
              username:username,
              role:role,
            }),
          });
    
          if (!response.ok) throw new Error('Failed to add employee');
    
          // ✅ Reset all input fields on success
          setFirstName('');
          setLastName('');
          setEmail('');
          setBudget('');
          setUserName('');
    
          console.log('Employee added successfully');
        } catch (error) {
          console.error('Error adding employee:', error);
        }
      };
console.log(employees)

const handleEditClick = (emp) => { //for the modification module when clicked
    setFirstName(emp.firstName);
    setLastName(emp.lastName);
    setEmail(emp.employee);
    setBudget(emp.budget);
    setUserName(emp.username);
    setRole(emp.role);
    setChoice("add");
  };

    return (
        <div className="">
          <NavBar />
              <div className="ManagerAppContainer">
                  <div className="ManagerApp-leftWidgetContainer">
                      <div className="addEmployee" style={{cursor:"pointer"}} onClick={()=>setChoice("add")}>
                        <Fileplus className="leftWidgetIcons plus"/>
                        <span className='plusSpanHR'>Add Employee</span>
                      </div>
                      <div className="summaryHR" style={{cursor:"pointer"}} onClick={()=>setChoice("remove")}>
                        <FileMinus className="leftWidgetIcons minus"/>
                        <span className='minusSpanHR'>Remove Employee</span>
                      </div>
                      <div className="adjust" style={{cursor:"pointer"}} onClick={()=>setChoice("modify")}>
                        <FilePencil className="leftWidgetIcons penicl"/>
                        <span className='pencilSpanHR'>Modify Employee</span>
                      </div>
                  </div>
                  <div className="ManagerApp-rightWidgetContainer">
                    { choice === 'add' && <h1>Employee Data</h1>}
                    { choice === 'remove' && <h1>Employees</h1>}
                    { choice === 'modify' && <h1>Modify Data</h1>}
                    <div className="innerContainer">
                    <div className="body">
                        {choice === 'add' && (
                            <form className='addform'>
                                <input
                                className='addInput'
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                />
                                <input
                                className='addInput'
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                />
                                <input
                                className='addInput'
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                className='addInput'
                                type="number"
                                placeholder="Budget"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                />
                                <input
                                className='addInput'
                                type="text"
                                placeholder="User Name"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                                />
                                <input
                                className='addInput'
                                type="text"
                                placeholder="Role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                />
                            </form>
                            )}
                            {choice === 'remove' && (
                                    employees.map((emp, index) => {
                                        return <Employee 
                                            key={emp.username}
                                            username={emp.username}
                                            employee={emp.employee}
                                            role={emp.role}
                                            
                                        />
                                    })
                            )}
                            {choice === 'modify' && (
                            employees.map((emp, index) => (
                                <div key={index} className='modifyContainer'>
                                <ModifyEmployee
                                    firstName={emp.firstName}
                                    lastName={emp.lastName}
                                    email={emp.email}
                                    budget={emp.budget}
                                    username={emp.username}
                                    role={emp.role}
                                />
                                <Pencil 
                                className="pencilIcon" 
                                style={{ cursor: 'pointer', paddingRight:'3.0em'}} 
                                onClick={() => handleEditClick(emp)} // ✅ connect click to update
                                />
                                </div>
                            ))
                            )}
                        </div>
                    </div>
                    { choice === 'add' && <div className="hrSubmitBtn" onClick={handleSubmit}>Submit</div>}
                </div>
          </div>
        </div>
      );
}

export default HRPage;
