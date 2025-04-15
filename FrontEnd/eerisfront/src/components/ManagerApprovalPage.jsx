import NavBar from './NavBar';
import {ReactComponent as Fileplus} from '../images/filePlus.svg'
import {ReactComponent as FileMinus} from '../images/fileMinus.svg'
import {ReactComponent as FilePencil} from '../images/filePencil.svg'

function ManagerApprovalPage() {
  return (
    <div className="">
      <NavBar />
          <div className="ManagerAppContainer">
              <div className="ManagerApp-leftWidgetContainer">
                  <div className="approve">
                    <Fileplus className="leftWidgetIcons plus"/>
                    <span className='plusSpan'>Approve Transactions</span>
                  </div>
                  <div className="summary">
                    <FileMinus className="leftWidgetIcons minus"/>
                    <span className='minusSpan'>View Summary</span>
                  </div>
                  <div className="adjust">
                    <FilePencil className="leftWidgetIcons penicl"/>
                    <span className='pencilSpan'>Adjust Budgets</span>
                  </div>
              </div>
              <div className="ManagerApp-rightWidgetContainer">
                hELLO
            </div>
      </div>
    </div>
  );
}

export default ManagerApprovalPage;
