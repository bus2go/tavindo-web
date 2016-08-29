import React, { Component } from 'react';
import ol from 'openlayers';

import MapView from './map.view';

import socket from '../utils/socket';

import Marker from '../classes/marker';

class MapContainer extends Component {
    constructor(props) {
        super(props);
        
        this.submitLinha = this.submitLinha.bind(this);
        this.LIMIT = 5;
    }
    
    submitLinha(event) {
        let select = document.getElementById('selectLinha');
        this.linha = select.options[select.selectedIndex].value;
        
        console.log('linha:', this.linha);
        this.getVectorLayer().getSource().clear();
        this.destroyMarkers();
        
        socket.emit('itinerario.load', this.linha);
    }
    
    destroyMarkers() {
        for(let ordem in this.markers) {
            if(this.markers.hasOwnProperty(ordem)) {
                delete this.markers[ordem];
            }
        }
    }
    
    getVectorLayer() {
        let layers = this.map.getLayers();
        
        for(let i=0; i<layers.getLength(); i++) {
            let layer = layers.item(i);
            if(layer instanceof ol.layer.Vector) {
                return layer;
            }
        }
        
        return null;
    }
    
    getClosest(lat, lon) {
        let result = { ida: null, volta: null };
        let minDistanceIda = Infinity;
        let minDistanceVolta = Infinity;
        
        for(let i=0; i<this.trechosIda.rows.length; i++) {
            let point = this.trechosIda.rows[i];
            let distance = Math.sqrt(Math.pow(point.lat - lat, 2) + Math.pow(point.lon - lon, 2)) * 10000000/90.0;
            if(distance < minDistanceIda) {
                result.ida = point;
                minDistanceIda = distance;
            }
        }
        
        for(let i=0; i<this.trechosVolta.rows.length; i++) {
            let point = this.trechosVolta.rows[i];
            let distance = Math.sqrt(Math.pow(point.lat - lat, 2) + Math.pow(point.lon - lon, 2)) * 10000000/90.0;
            if(distance < minDistanceVolta) {
                result.volta = point;
                minDistanceVolta = distance;
            }
        }
        
        return result;
    }
    
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
        
        let that = this;
        
        socket.on('itinerario', function (data) {
            console.log('itinerario', data);
            
            that.trechosIda = { label: '', points: [], rows: [] };
            that.trechosVolta = { label: '', points: [], rows: [] };
            let controle = 0;
            
            for(let i=0; i<data.rows.length; i++) {
                let row = data.rows[i];
                let pos = ol.proj.transform([parseFloat(row.lon), parseFloat(row.lat)], 'EPSG:4326', 'EPSG:3857');
                
                if(controle === 0 || controle === row.shape_id) {
                    controle = row.shape_id;
                    that.trechosIda.label = row.trip_headsign.trim();
                    that.trechosIda.points.push(pos);
                    that.trechosIda.rows.push(row);
                } else {
                    that.trechosVolta.label = row.trip_headsign.trim();
                    that.trechosVolta.points.push(pos);
                    that.trechosVolta.rows.push(row);
                }
            }
            
            let rotaIda = new ol.Feature({
                geometry: new ol.geom.LineString(that.trechosIda.points),
                name: that.trechosIda.label
            });
            
            let rotaVolta = new ol.Feature({
                geometry: new ol.geom.LineString(that.trechosVolta.points),
                name: that.trechosVolta.label
            });
            
            let lineStyleIda = new ol.style.Style({
                fill: new ol.style.Fill({ color: '#00FF00', weight: 4 }),
                stroke: new ol.style.Stroke({ color: '#DD0000', width: 3 })
            });
            
            let lineStyleVolta = new ol.style.Style({
                fill: new ol.style.Fill({ color: '#FF0000', weight: 4 }),
                stroke: new ol.style.Stroke({ color: '#00DD00', width: 3 })
            });
            
            rotaIda.setStyle(lineStyleIda);
            rotaVolta.setStyle(lineStyleVolta);
            
            that.getVectorLayer().getSource().addFeature(rotaIda);
            that.getVectorLayer().getSource().addFeature(rotaVolta);
            
            let extent = that.getVectorLayer().getSource().getExtent();
            that.map.getView().fit(extent, that.map.getSize());
            
            socket.emit('linha.select', that.linha);
        });
        
        socket.on('update', function(data) {
            console.log('update.data:', data);
            
            let marker = that.markers[data.ordem];
            let closest = that.getClosest(data.lat, data.lon);
            
            if(marker) {
                marker.feature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([data.lon, data.lat])));
                marker.pontos.push(data);
                marker.pontosIda.push(closest.ida);
                marker.pontosVolta.push(closest.volta);
                
                if(marker.pontos.length > that.LIMIT) {
                    marker.pontos.shift();
                    marker.pontosIda.shift();
                    marker.pontosVolta.shift();
                }
            } else {
                let marker = new Marker(data, closest);
                that.markers[data.ordem] = marker;
                that.getVectorLayer().getSource().addFeature(marker.feature);
            }
        });
        
        socket.on('linhas', linhas => {
            console.log('linhas', linhas);
            
            let select = document.getElementById('selectLinha');
            for(let i=0; i<linhas.length; i++) {
                let linha = linhas[i];
                let option = document.createElement("option");
                option.value = linha.value;
                option.text = linha.text;
                select.add(option);
            }
        });
        
        socket.emit('linhas.load');
    }
    
    render() {
        return(
            <MapView submitLinha={this.submitLinha} />
        );
    }
}

export default MapContainer;