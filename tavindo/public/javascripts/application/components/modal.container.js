import React, { Component } from 'react';
import { connect } from 'react-redux';

import $ from 'jquery';

import ModalView, { INFO, WARNING, ERROR } from './modal.view';

import store from '../utils/store';
import { modalClose } from '../utils/actions';

class ModalContainer extends Component {
    constructor(props) {
        super(props);
        
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
    
    openModal() {
        $('#messagesModal').show();
    }
    
    shouldShow() {
        return (this.props.messages.length > 0);
    }
    
    handleCloseModal(event) {
        var modal = $('#messagesModal');
        var close = $('#messagesModal .close');
        var target = event.target;
        
        if (target == modal[0] || target == close[0]) {
            store.dispatch(modalClose());
        }
    }
    
    render() {
        return (<ModalView show={this.shouldShow()} messages={this.props.messages} onClick={this.handleCloseModal} />);
    }
}

ModalContainer.propTypes = {
    messages: React.PropTypes.arrayOf(React.PropTypes.shape({
        type: React.PropTypes.string,
        text: React.PropTypes.string
    }))
};

const mapStateToProps = function(store) {
    return {
        messages: store.messagesState.messages
    };
};

export default connect(mapStateToProps)(ModalContainer);