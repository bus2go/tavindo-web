import React, { Component } from 'react';
import { connect } from 'react-redux';

import MapView from './map.view';

class MapContainer extends Component {
    constructor(props) {
        super(props);
        
        this.LIMIT = 5;
    }
    
    componentDidMount() {
        console.log('MapContainer.componentDidMount');
        
        /*
        socket.on('update', data => {
            console.log('update.data:', data);
            
            let marker = this.markers[data.ordem];
            let closest = this.getClosest(data.lat, data.lon);
            
            if(marker) {
                marker.feature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([data.lon, data.lat])));
                marker.pontos.push(data);
                if(closest) {
                    marker.pontosIda.push(closest.ida);
                    marker.pontosVolta.push(closest.volta);
                }
                
                if(marker.pontos.length > this.LIMIT) marker.pontos.shift();
                if(marker.pontosIda.length > this.LIMIT) marker.pontosIda.shift();
                if(marker.pontosVolta.length > this.LIMIT) marker.pontosVolta.shift();
            } else {
                marker = new Marker(data, closest);
                this.markers[data.ordem] = marker;
                this.getVectorLayer().getSource().addFeature(marker.feature);
            }
        });
        */
    }
    
    componentDidUpdate() {
        console.log('MapContainer.componentDidUpdate');
    }
    
    render() {
        return(
            <MapView submitLinha={this.submitLinha} busLine={this.props.busLine} />
        );
    }
}

const mapStateToProps = store => {
    return {
        busLine: store.busLineState.busLine
    };
};

export default connect(mapStateToProps)(MapContainer);