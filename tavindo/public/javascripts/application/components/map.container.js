import React, { Component } from 'react';
import ol from 'openlayers';

import MapView from './map.view';

import socket from '../utils/socket';

class MapContainer extends Component {
    constructor(props) {
        super(props);
        
        this.submitLinha = this.submitLinha.bind(this);
    }
    
    submitLinha(event) {
        let select = document.getElementById('selectLinha');
        let linha = select.options[select.selectedIndex].value;
        
        console.log('linha:', linha);
        this.getVectorLayer().getSource().clear();
        this.destroyMarkers();
        
        socket.emit('linha.select', linha);
        socket.emit('itinerario.load', linha);
    }
    
    destroyMarkers() {
        for(var ordem in this.markers) {
            if(this.markers.hasOwnProperty(ordem)) {
                delete this.markers[ordem];
            }
        }
    }
    
    getVectorLayer() {
        var layers = this.map.getLayers();
        
        for(var i=0; i<layers.getLength(); i++) {
            var layer = layers.item(i);
            if(layer instanceof ol.layer.Vector) {
                return layer;
            }
        }
        
        return null;
    };
    
    componentDidMount() {
        this.markers = {};
        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({ source: new ol.source.OSM() }),
                new ol.layer.Vector({ source: new ol.source.Vector() })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([-43.208, -22.9102]),
                zoom: 11
            })
        });
        
        var that = this;
        
        socket.on('itinerario', function (data) {
            console.log(data);
            
            var trechosIda = { label: '', points: [] };
            var trechosVolta = { label: '', points: [] };
            var controle = 0;
            
            for(var i=0; i<data.rows.length; i++) {
                var row = data.rows[i];
                var pos = ol.proj.transform([parseFloat(row.lon), parseFloat(row.lat)], 'EPSG:4326', 'EPSG:3857');
                
                if(controle === 0 || controle === row.shape_id) {
                    controle = row.shape_id;
                    trechosIda.label = row.trip_headsign.trim();
                    trechosIda.points.push(pos);
                } else {
                    trechosVolta.label = row.trip_headsign.trim();
                    trechosVolta.points.push(pos);
                }
            }
            
            var rotaIda = new ol.Feature({
                geometry: new ol.geom.LineString(trechosIda.points),
                name: trechosIda.label
            });
            
            var rotaVolta = new ol.Feature({
                geometry: new ol.geom.LineString(trechosVolta.points),
                name: trechosVolta.label
            });
            
            var lineStyleIda = new ol.style.Style({
                fill: new ol.style.Fill({ color: '#00FF00', weight: 4 }),
                stroke: new ol.style.Stroke({ color: '#DD0000', width: 3 })
            });
            
            var lineStyleVolta = new ol.style.Style({
                fill: new ol.style.Fill({ color: '#FF0000', weight: 4 }),
                stroke: new ol.style.Stroke({ color: '#00DD00', width: 3 })
            });
            
            rotaIda.setStyle(lineStyleIda);
            rotaVolta.setStyle(lineStyleVolta);
            
            that.getVectorLayer().getSource().addFeature(rotaIda);
            that.getVectorLayer().getSource().addFeature(rotaVolta);
            
            var extent = that.getVectorLayer().getSource().getExtent();
            that.map.getView().fit(extent, that.map.getSize());
        });
        
        socket.on('update', function(data) {
            console.log('update.data:', data);
            
            var marker = that.markers[data.ordem];
            if(marker) {
                marker.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([data.lon, data.lat])));
            } else {
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([data.lon, data.lat])),
                    name: data.ordem + ' - ' + data.dataHora
                });
                
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 0.9],
                        opacity: 0.75,
                        scale: 0.3,
                        src: '/images/pin.png'
                    }))
                });
                
                iconFeature.setStyle(iconStyle);
                that.markers[data.ordem] = iconFeature;
                
                that.getVectorLayer().getSource().addFeature(iconFeature);
            }
        });
    }
    
    render() {
        return(
            <MapView submitLinha={this.submitLinha} />
        );
    }
}

export default MapContainer;