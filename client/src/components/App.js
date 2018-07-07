import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import './App.css';
import './emails.jpg';

import Header from './Header';
import Landing from "./Landing";

const Dashboard = () => <h2>Dashboard</h2>;
const SurveyNew = () => <h2>SurveyNew</h2>;


class App extends Component { 
  componentDidMount() {
    this.props.fetchUser();  
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          {/* You can generally only display ONE child at most in BrowserRouter. so only one div for example*/}
          <div className="container">
            {/* the contents of the header will be determined by redux */}
            <Header/>

            {/* exact below is a little JSX sauce to make sure that Landing dosent appear on dashboard to for example */}
            <Route exact path="/" component={Landing} />
            <Route exact path="/surveys" component={Dashboard} />
            <Route path="/surveys/new" component={SurveyNew} />
          </div>
        </BrowserRouter>
        
      </div>
    );
  };
};


export default connect(null, actions)(App);