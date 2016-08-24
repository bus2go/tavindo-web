import React, { Component } from 'react';
import classNames from 'classnames';

import './modal.view.scss';

class ModalView extends Component {
    constructor(props) {
        super(props);
        
        this.getClassName = this.getClassName.bind(this);
    }
    
    getClassName(type) {
        return 'modal-' + (type ? type : INFO);
    }
    
    renderMessages() {
        let i=0;
        let that = this;
        
        return (
            <ul>
                {this.props.messages.map(function(message) {
                    return <li key={i++} className={that.getClassName(message.type)}>{message.text}</li>;
                })}
            </ul>);
    }
    
    render() {
        let classes = classNames({
            'modal': true,
            'show': this.props.show,
            'hide': !this.props.show
        });
        
        return (
            <div id="messagesModal" className={classes} onClick={this.props.onClick}>
                <div className="modal-content">
                    <span className="close" onClick={this.props.onClick}>×</span>
                    {this.renderMessages()}
                </div>
            </div>);
    }
}

export default ModalView;
export const INFO = 'i';
export const WARNING = 'w';
export const ERROR = 'e';