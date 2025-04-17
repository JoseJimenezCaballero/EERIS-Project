import NavBar from './NavBar';
import { useState } from 'react';
import {ReactComponent as Fileplus} from '../images/filePlus.svg'
import {ReactComponent as FileMinus} from '../images/fileMinus.svg'
import {ReactComponent as FilePencil} from '../images/filePencil.svg'
import Employee from './Employee';
import ModifyEmployee from './ModifyEmployee';
import {ReactComponent as Pencil} from '../images/pencil.svg'

function HRPage() {
    const [choice, setChoice] = useState("add");

    // ✅ Form state for adding an employee
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [budget, setBudget] = useState('');
    const [empId, setEmpId] = useState('');
    const [role, setRole] = useState('');


    const handleSubmit = async () => {
        try {
          const response = await fetch('', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              budget,
              empId,
            }),
          });
    
          if (!response.ok) throw new Error('Failed to add employee');
    
          // ✅ Reset all input fields on success
          setFirstName('');
          setLastName('');
          setEmail('');
          setBudget('');
          setEmpId('');
    
          console.log('Employee added successfully');
        } catch (error) {
          console.error('Error adding employee:', error);
        }
      };



//**TEST DATA FOR EMPLOYEE COMPONENTS **/
const data = [
    {empId:1, employee:'Luis J.', role:'Manager'},
    {empId:13, employee:'Jane J.', role:'Manager'},
    {empId:11, employee:'Jose J.', role:'Employee'},
];

//**TEST DATA FOR MODEMPLOYEE COMPONENTS **/
const data2 = [
    {firstName:'Luis', lastName:'Smith', email:'lsmith@mail.com', budget:100, empId:1, role:'Manager'},
    {firstName:'John', lastName:'Smith', email:'lsmith@mail.com', budget:140, empId:2, role:'Employee'},
    {firstName:'Eric', lastName:'Smith', email:'lsmith@mail.com', budget:500, empId:14, role:'Manager'},
];


const handleEditClick = (emp) => { //for the modification module when clicked
    setFirstName(emp.firstName);
    setLastName(emp.lastName);
    setEmail(emp.email);
    setBudget(emp.budget);
    setEmpId(emp.empId);
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
                                placeholder="Employee ID"
                                value={empId}
                                onChange={(e) => setEmpId(e.target.value)}
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
                                    data.map((emp, index) => {
                                        return <Employee 
                                            key={index}
                                            empId={emp.empId}
                                            employee={emp.employee}
                                            role={emp.role}
                                        />
                                    })
                            )}
                            {choice === 'modify' && (
                            data2.map((emp, index) => (
                                <div key={index} className='modifyContainer'>
                                <ModifyEmployee
                                    firstName={emp.firstName}
                                    lastName={emp.lastName}
                                    email={emp.email}
                                    budget={emp.budget}
                                    empId={emp.empId}
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
