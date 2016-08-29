import React, { Component } from 'react';

import '../components/ol.css';

class MapView extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <div>
                <div>
                    <div className="twelve columns">
                        <label htmlFor="selectLinha" className="twelve column">Selecione a linha de ônibus</label>
                    </div>
                    <div className="twelve columns">
                        <select id="selectLinha" className="six columns"></select>
                        <button id="submitLinha" className="button-primary six columns" onClick={this.props.submitLinha}>OK</button>
                    </div>
                </div>
                <div id="map"></div>
            </div>
        );
    }
}

export default MapView;