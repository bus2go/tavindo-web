import React, { Component } from 'react';
import { connect } from 'react-redux';

import FormLinhaView from './form.linha.view';

import socket from '../utils/socket';
import { busLinesLoaded, busLineSelected, busUpdated } from '../utils/actions';

class FormLinhaContainer extends Component {
    constructor(props) {
        super(props);
        
        this.submitLinha = this.submitLinha.bind(this);
        this.selected = null;
        
        socket.onEvent('linhas.load.ok', busLinesLoaded);
        socket.onEvent('busLine.selected.ok', busLineSelected);
        socket.onEvent('bus.updated', busUpdated);
    }
    
    componentDidMount() {
        if(!this.props.busLines) {
            socket.fireEvent('linhas.load');
        }
    }
    
    submitLinha(linha) {
        console.log('FormLinhaContainer.submitLinha.linha', linha);
        
        if(linha !== this.selected) {
            this.selected = linha;
            socket.fireEvent('busLine.selected', linha);
        }
    }
    
    render() {
        return (<FormLinhaView submitLinha={this.submitLinha} />);
    }
}

FormLinhaContainer.propTypes = {
    busLines: React.PropTypes.object,
    busLine: React.PropTypes.object
};

const mapStateToProps = function(store) {
    return {
        busLine: store.busLineState.busLine,
        busLines: store.busLineState.busLines
    };
};

export default connect(mapStateToProps)(FormLinhaContainer);