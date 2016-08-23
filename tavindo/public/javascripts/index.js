/* global io, ol, $, google */

var mapOSM = null;
var socket = null;
var socketLinha = null;
var markers = [];

function init() {
    socket = io();
    
    mapOSM = new ol.Map({
        target: 'mapaOSM',
        layers: [
            new ol.layer.Tile({ source: new ol.source.OSM() }),
            new ol.layer.Vector({ source: new ol.source.Vector() })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-43.208, -22.9102]),
            zoom: 11
        })
    });
}

$(document).ready(function(){
    init();
    
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
        
        mapOSM.getVectorLayer().getSource().addFeature(rotaIda);
        mapOSM.getVectorLayer().getSource().addFeature(rotaVolta);
        
        var extent = mapOSM.getVectorLayer().getSource().getExtent();
        mapOSM.getView().fit(extent, mapOSM.getSize());
    });
    
    socket.on('pontos', function(data) {
        console.log('pontos:', data);
        
        while(infoMarkers.length > 0) {
            //markers[i].setMap(null);
            infoMarkers[0].destroy();
            infoMarkers.splice(0, 1);
        }
        
        var pontos = [];
        var pontosOSM = [];
        console.log('total_pontos:', data.rows.length);
        
        for(var i=0; i<data.rows.length; i++) {
            var pos = new google.maps.LatLng(data.rows[i].lat, data.rows[i].lon);
            pontos.push(pos);
            
            var posOSM = ol.proj.transform([data.rows[i].lon, data.rows[i].lat], 'EPSG:4326', 'EPSG:3857');
            pontosOSM.push(posOSM);
            
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 0.9],
                    opacity: 0.75,
                    scale: 0.3,
                    src: '/images/pin.png'
                }))
            });
            
            if(data.rows[i].id_gps) {
                var infoMarker = new InfoMarker(map, 
                    data.rows[i].lat, 
                    data.rows[i].lon, 
                    'id_gps: ' + data.rows[i].id_gps,
                    'Inativar: <button id="id' + data.rows[i].id_gps + '" data-gps="' + data.rows[i].id_gps + '">Sim</button><br />' + JSON.stringify(data.rows[i]),
                    data.rows[i].id_gps,
                    socket,
                    mapOSM,
                    iconStyle);
                
                infoMarkers.push(infoMarker);
                /*
                var iconFeature = new ol.Feature({
                  geometry: new ol.geom.Point(ol.proj.fromLonLat([data.rows[i].lon, data.rows[i].lat])),
                  name: 'Teste'
                });
                
                iconFeature.setStyle(iconStyle);

                mapOSM.getVectorLayer().getSource().addFeature(iconFeature);
                */
            }
            
            bounds.extend(pos);
        }
    });
    
    socket.on('update', function(data) {
        console.log('update.data:', data);
        
        var marker = markers[data.ordem];
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
            markers[data.ordem] = iconFeature;
            
            mapOSM.getVectorLayer().getSource().addFeature(iconFeature);
        }
    });
    
    socket.on('atualizar', function() {
        $('#carregaLinha').click();
    });
    
    $('#carregaLinha').click(function() {
        var linha = $('#selectLinha').val();
        
        console.log('linha:', linha);
        mapOSM.getVectorLayer().getSource().clear();
        destroyMarkers(markers);
        
        socket.emit('linha.select', linha);
        socket.emit('itinerario.load', linha);
        //socket.emit('pontos.load', linha);
    });
});

ol.Map.prototype.getVectorLayer = function() {
    var layers = this.getLayers();
    
    for(var i=0; i<layers.getLength(); i++) {
        var layer = layers.item(i);
        if(layer instanceof ol.layer.Vector) {
            return layer;
        }
    }
    
    return null;
};

var destroyMarkers = () => {
    for(var ordem in markers) {
        if(markers.hasOwnProperty(ordem)) {
            delete markers[ordem];
        }
    }
};