import React, { Component } from 'react';

import '../components/ol.css';

class EstacoesView extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <div id="map"></div>
        );
    }
}

export default EstacoesView;