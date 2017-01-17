import React, { Component } from 'react';
import ol from 'openlayers';
import turf from '@turf/turf';

import '../components/map.view.scss';
import '../components/ol.css';

import Car from '../classes/car';

class MapView extends Component {
    constructor(props) {
        super(props);
    }
    
    generateStyle(isWay) {
        let fillColor = isWay ? '#00FF00' : '#FF0000';
        let strokeColor = isWay ? '#DD0000' : '#00DD00';
        
        return new ol.style.Style({
            fill: new ol.style.Fill({ color: fillColor, weight: 4 }),
            stroke: new ol.style.Stroke({ color: strokeColor, width: 3 })
        });
    }
    
    getClosest(marker) {
        console.log('MapView.getClosest.marker', marker);
        
        if(!this.rotaIda) return null;
        
        /*
        let result = { way: null, ret: null };
        let minDistanceIda = Infinity;
        let minDistanceVolta = Infinity;
        
        console.log('MapContainer.getClosest(lat, lon)', lat, lon);
        let busLine = this.props.busLine;
        if(!busLine || !busLine.itinerary) return null;
        
        let trechosIda = busLine.itinerary.ida;
        let trechosVolta = busLine.itinerary.volta;
        
        for(let i=0; i<trechosIda.rows.length; i++) {
            let point = trechosIda.rows[i];
            let distance = Math.sqrt(Math.pow(point.lat - lat, 2) + Math.pow(point.lon - lon, 2)) * 10000000/90.0;
            if(distance < minDistanceIda) {
                result.ida = point;
                minDistanceIda = distance;
            }
        }
        
        for(let i=0; i<trechosVolta.rows.length; i++) {
            let point = trechosVolta.rows[i];
            let distance = Math.sqrt(Math.pow(point.lat - lat, 2) + Math.pow(point.lon - lon, 2)) * 10000000/90.0;
            if(distance < minDistanceVolta) {
                result.volta = point;
                minDistanceVolta = distance;
            }
        }
        
        return result;
        */
    }
    
    loadMap() {
        console.log('MapView.loadMap');
        
        let container = document.getElementById('popup');
        let content = document.getElementById('popup-content');
        let closer = document.getElementById('popup-closer');
        
        let overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        }));
        
        closer.onclick = function() {
            container.style.display = 'none';
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };

        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({ source: new ol.source.OSM() }),
                new ol.layer.Vector({ source: new ol.source.Vector() })
            ],
            overlays: [overlay],
            view: new ol.View({
                center: ol.proj.fromLonLat([-43.208, -22.9102]),
                zoom: 11
            })
        });
        
        this.map.popup = {
            container,
            content,
            closer
        };
    }
    
    loadItinerary(busLine) {
        console.log('MapView.loadItinerary');
        
        if(!busLine || !busLine.itinerary) return;
        
        if(busLine.itinerary.way) {
            this.rotaIda = new ol.Feature({
                geometry: new ol.format.Polyline().readGeometry(busLine.itinerary.way.path, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                }),
                name: busLine.itinerary.way.label
            });
            
            this.rotaIda.coords = this.rotaIda.getGeometry().getCoordinates().map(item => {
                return [item[0]/1e5, item[1]/1e5];
            });
            
            this.rotaIda.dist = this.buildDistanceArray(this.rotaIda.coords);
            
            this.rotaIda.setStyle(this.generateStyle(true));
            this.getVectorLayer().getSource().addFeature(this.rotaIda);
        } else {
            this.rotaIda = null;
        }
        
        if(busLine.itinerary.ret) {
            this.rotaVolta = new ol.Feature({
                geometry: new ol.format.Polyline().readGeometry(busLine.itinerary.ret.path, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                }),
                name: busLine.itinerary.ret.label
            });
            
            this.rotaVolta.coords = this.rotaVolta.getGeometry().getCoordinates().map(item => {
                return [item[0]/1e5, item[1]/1e5];
            });
            
            this.rotaVolta.dist = this.buildDistanceArray(this.rotaVolta.coords);
            
            this.rotaVolta.setStyle(this.generateStyle(false));
            this.getVectorLayer().getSource().addFeature(this.rotaVolta);
        } else {
            this.rotaVolta = null;
        }
        
        if(busLine.itinerary.way || busLine.itinerary.ret) {
            let extent = this.getVectorLayer().getSource().getExtent();
            this.map.getView().fit(extent, this.map.getSize());
        }
    }
    
    loadBuses(busLine) {
        console.log('MapView.loadBuses');
        
        if(!busLine) return;
        
        if(!this.cars) this.cars = {};
        for(let ordem in busLine.cars) {
            let item = busLine.cars[ordem];
            if(!this.cars[ordem]) {
                let car = new Car(ordem, item.lat, item.lon, item.dataHora, this.getVectorLayer().getSource(), this.map);
                this.cars[ordem] = car;
            } else {
                let car = this.cars[ordem];
                car.updatePosition(item.lat, item.lon, item.dataHora);
            }
        }
    }
    
    clear() {
        console.log('MapView.clearMap');
        
        this.getVectorLayer().getSource().clear();
        this.cars = {};
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
    
    getPoint(coords) {
        return {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": coords
            }
        };
    }
    
    buildDistanceArray(coords) {
        let result = [0];
        
        for(let i=1; i<coords.length; i++) {
            let from = this.getPoint(coords[i-1]);
            let to = this.getPoint(coords[i]);
            
            result.push(result[i-1] + turf.distance(from, to));
        }
        
        return result;
    }
    
    componentDidUpdate(prevProps) {
        console.log('MapView.componentDidUpdate');
        
        if(prevProps && prevProps.busLine && this.props.busLine.selected == prevProps.busLine.selected && this.props.busLine.itinerary == prevProps.busLine.itinerary) {
            this.loadBuses(this.props.busLine);
        } else {
            this.clear();
            this.loadItinerary(this.props.busLine);
            this.loadBuses(this.props.busLine);
        }
    }
    
    componentDidMount() {
        console.log('MapView.componentDidMount');
        
        this.loadMap();
        this.loadItinerary(this.props.busLine);
        this.loadBuses(this.props.busLine);
    }
    
    render() {
        return(
            <div>
                <div id="map"></div>
                <div id="popup" className="ol-popup">
                    <a href="#" id="popup-closer" className="ol-popup-closer">✖</a>
                    <div id="popup-content"></div>
                </div>
            </div>
        );
    }
}

export default MapView;