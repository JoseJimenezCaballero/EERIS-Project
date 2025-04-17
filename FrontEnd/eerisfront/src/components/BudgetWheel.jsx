import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function BudgetWheel({ percent }) {
  return (
    <div style={{ width: 120, height: 120 }}>
      <CircularProgressbar
        value={percent}
        text={`${percent}%`}
        styles={buildStyles({
          pathColor: "#44E07E",       // the filled color
          textColor: "#000",          // text color inside
          trailColor: "#eee",         // background ring
          textSize: "1.3em",           // adjust text size
        })}
      />
    </div>
  );
}

export default BudgetWheel;
