import React, { Component } from 'react';
import { connect } from 'react-redux';

import socket from '../utils/socket';
import store from '../utils/store';
import { usersLoadSuccess } from '../utils/actions';

class Users extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        socket.emit('users.load');
        socket.on('users.load.result', (users) => {
            store.dispatch(usersLoadSuccess({ users: users }));
        });
    }
    
    componentWillUnmount() {
        socket.removeAllListeners('users.load.result');
    }

    render() {
        return(
            <div>
                {this.props.users.map(function(item) {
                    return(
                        <div key={item.id} className="row">
                            <div className="two columns">
                                <p>{item.id}</p>
                            </div>
                            <div className="five columns">
                                <p>{item.name}</p>
                            </div>
                            <div className="five columns">
                                <p>{item.email}</p>
                            </div>
                        </div>);
                })};
            </div>
        );
    }
}

Users.propTypes = {
    users: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number,
        name: React.PropTypes.string,
        email: React.PropTypes.string
    }))
};

const mapStateToProps = function(store) {
    return {
        users: store.usersState.users
    };
};

export default connect(mapStateToProps)(Users);