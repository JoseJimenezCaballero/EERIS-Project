import {ReactComponent as Pencil} from '../images/pencil.svg'
import { useState } from 'react';

function ModifyEmployee({ firstName, lastName, email, budget, empId, role }) {

      return (
          <div className="transDataHR">
            <span className="date">{empId}</span>
            <span className="employee">{firstName + ' ' + lastName[0] + '.'}</span>
            <span className="amount">{role}</span>
          </div>
      );
    }
  export default ModifyEmployee;
  