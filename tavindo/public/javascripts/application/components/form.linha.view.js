import React, { Component } from 'react';
import { connect } from 'react-redux';

class FormLinhaView extends Component {
    constructor(props) {
        super(props);
        
        this.linhaSelect = this.linhaSelect.bind(this);
    }
    
    linhaSelect() {
        let select = document.getElementById('selectLinha');
        let linha = select.options[select.selectedIndex].value;
        console.log('FormLinhaView.linhaSelect.linha', linha);

        this.props.submitLinha(linha);
    }
    
    buildSelect() {
        let linhas = this.props.busLines;
        if(!linhas) {
            return null;
        } else {
            return linhas.groups.map((group, groupIndex) => {
                return (
                    <optgroup key={groupIndex} label={group}>
                        {linhas[group].items.map((item, index) => {
                            return (<option key={index} value={item.value}>{item.text}</option>);
                        })}
                    </optgroup>
                );
            });
        }
    }
    
    render() {
        return (
            <div>
                <div className="twelve columns">
                    <label htmlFor="selectLinha" className="twelve column">Selecione a linha de ônibus</label>
                </div>
                <div className="twelve columns">
                    <select id="selectLinha" className="six columns">
                        {this.buildSelect()}
                    </select>
                    <button id="submitLinha" className="button-primary six columns" onClick={this.linhaSelect}>OK</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        busLines: store.busLineState.busLines
    };
};

export default connect(mapStateToProps)(FormLinhaView);