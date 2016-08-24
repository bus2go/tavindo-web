import React, { Component } from 'react';
import { Link } from 'react-router';

import './menu.view.scss';

class MenuView extends Component {
    constructor(props) {
        super(props);
        
        this.loginLogoutLink = this.loginLogoutLink.bind(this);
    }
    
    loginLogoutLink() {
        if(this.props.user) {
            return <Link className="navbar-link" to="/" onClick={this.props.handleLogout}>Logout</Link>;
        } else {
            return <Link className="navbar-link" to="/login">Login</Link>;
        }
    }
    
    render() {
        return (
            <div className="row">
                <div className="five columns">
                    <h1 className="title">{this.props.siteName}</h1>
                </div>
                <div className="seven columns">
                    <div className="navbar-spacer" />
                    <div className="navbar-item navbar-menu">
                        <a className="navbar-link" href="#">&#9776;</a>
                    </div>
                    <nav className="navbar">
                        <ul className="navbar-list">
                            <li className="navbar-item">
                                <Link className="navbar-link" to="/">Home</Link>
                            </li>
                            <li className="navbar-item">
                                {this.loginLogoutLink()}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default MenuView;