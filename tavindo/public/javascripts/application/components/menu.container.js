import React, { Component } from 'react';
import { connect } from 'react-redux';

import MenuView from './menu.view';

import socket from '../utils/socket';

class MenuContainer extends Component {
    constructor(props) {
        super(props);
    }
    
    handleLogout() {
        socket.emit('me.load', { logout: true });
    }
    
    render() {
        return (<MenuView siteName="Tá Vindo!" user={this.props.user} handleLogout={this.handleLogout} />);
    }
}

MenuContainer.propTypes = {
    user: React.PropTypes.object
};

const mapStateToProps = function(store) {
    return {
        user: store.userState.user
    };
};

export default connect(mapStateToProps)(MenuContainer);