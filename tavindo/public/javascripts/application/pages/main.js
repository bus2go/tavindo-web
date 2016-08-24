import React, { Component } from 'react';
import { connect } from 'react-redux';

import ModalContainer from '../components/modal.container';
import { INFO } from '../components/modal.view';
import MenuContainer from '../components/menu.container';

import './main.normalize.scss';
import './main.skeleton.scss';
import './main.scss';

class Main extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <div className="container">
                <ModalContainer />
                <section id="header">
                    <MenuContainer />
                </section>
                <section id="main">
                    {this.props.children}
                </section>
            </div>
        );
    }
}

Main.propTypes = {
    user: React.PropTypes.shape({
        id: React.PropTypes.number,
        name: React.PropTypes.string,
        email: React.PropTypes.string
    })
};

const mapStateToProps = function(store) {
    return {
        user: store.userState.user
    };
};

export default connect(mapStateToProps)(Main);