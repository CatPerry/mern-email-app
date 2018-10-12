import React from "react";
import {Link} from 'react-router-dom';
import SurveyList from './surveys/SurveyList'

const Dashboard = () => {
  return <div>
      <div className="textbox" style={{ textAlign: "center" }}>
        <h1>Dashboard</h1>
          <SurveyList/>
        <p>Get invaluable user feedback with one click</p>
        <div className="fixed-action-btn">
          <Link to="surveys/new" className="btn-floating btn-large red">
            <i className="large material-icons">add</i>
          </Link>
        </div>
      </div>
    </div>;
};

export default Dashboard;
