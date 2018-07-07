import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  //this helper method is where we inspect whther the user is logged in or not. This is a great place to use a switch statement
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false: 
        return (
        <li> <a href="/auth/google">Log In with Google</a> </li>
        );
      default:
        return <li><a href="/api/logout">Log Out</a></li>;
    }
  }

  // Note: we're uisng a classbased component here because we will be uing helpers to determine what components are displayed within the Header. This makes it easy to organize code in here.
  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link to={this.props.auth ? './surveys': '/'} 
          className="left brand-logo">
            Emaily
          </Link>
            <ul className="right">
              {this.renderContent()}
            </ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);