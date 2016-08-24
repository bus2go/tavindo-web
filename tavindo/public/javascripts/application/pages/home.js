import React, { Component } from 'react';

import MapContainer from '../components/map.container.js';

class Home extends Component {
    constructor() {
        super();
    }
    
    render() {
        return(
            <MapContainer />
        );
    }
}

export default Home;