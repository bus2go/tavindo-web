var map = null;
var rotaAtual = null;

var mapOSM = null;
var rotaAtualOSM = null;

var markers = [];
var infoMarkers = [];
var socket = null;

$(document).ready(function(){
    socket = io();
    socket.on('itinerario', function (data) {
        console.log(data);
        var trechosIda = [];
        var trechosVolta = [];
        var controle = 0;
        var bounds = new google.maps.LatLngBounds();
        
        for(var i=0; i<data.length; i++) {
            var pos = new google.maps.LatLng(data[i].latitude, data[i].longitude);
            if(controle == 0) {
                controle = data[i].shape_id;
            } else if(controle == data[i].shape_id) {
                trechosIda.push(pos);
            } else {
                trechosVolta.push(pos);
            }
            bounds.extend(pos);
        }
        
        var rotaIda = new google.maps.Polyline({
            path: trechosIda,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        
        var rotaVolta = new google.maps.Polyline({
            path: trechosVolta,
            geodesic: true,
            strokeColor: '#00FF00',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });

        rotaIda.setMap(map);
        rotaVolta.setMap(map);
        map.fitBounds(bounds);
    });
    
    socket.on('pontos', function(data) {
        console.log('pontos:', data);
        
        var bounds = new google.maps.LatLngBounds();
        
        if(rotaAtual) {
            rotaAtual.setMap(null);
            mapOSM.getVectorLayer().getSource().removeFeature(rotaAtualOSM);
        }
        
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
        
        var extent = mapOSM.getVectorLayer().getSource().getExtent();
        mapOSM.getView().fit(extent, mapOSM.getSize());
        
        map.fitBounds(bounds);
        
        rotaAtual = new google.maps.Polyline({
            map: map,
            path: pontos,
            //geodesic: true,
            strokeColor: '#0000FF',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        
        console.log('pontosOSM:', pontosOSM);
            
        /*
        var featureLine = new ol.Feature({
            geometry: new ol.geom.LineString(pontosOSM)
        });
        
        var vectorLine = new ol.source.Vector({});
        vectorLine.addFeature(featureLine);
        */
        var lineStyle = new ol.style.Style({
            fill: new ol.style.Fill({ color: '#00FF00', weight: 4 }),
            stroke: new ol.style.Stroke({ color: '#DD0000', width: 3 })
        });
        /*
        var vectorLineLayer = new ol.layer.Vector({
            source: vectorLine,
            style: lineStyle
        });
        */
        
        //mapOSM.addLayer(vectorLineLayer);
        rotaAtualOSM = new ol.Feature({
            geometry: new ol.geom.LineString(pontosOSM),
            name: 'Line'
        });
        
        rotaAtualOSM.setStyle(lineStyle);
        console.log('rotaAtualOSM:', rotaAtualOSM);
        
        mapOSM.getVectorLayer().getSource().addFeature(rotaAtualOSM);
    });
    
    socket.on('update', function(data) {
        console.log('update.data:', data);
    });
    
    socket.on('atualizar', function() {
        $('#carregaLinha').click();
    });
    
    function initialize() {
        var mapOptions = {
            center: { lat: -22.9102, lng: -43.208 },
            zoom: 11
        };
        
        map = new google.maps.Map(document.getElementById('mapa'), mapOptions);
        
        mapOSM = new ol.Map({
            target: 'mapaOSM',
            layers: [
                new ol.layer.Tile({
                    //source: new ol.source.MapQuest({layer: 'osm'})
                    source: new ol.source.OSM()
                }),
                new ol.layer.Vector({
                    source: new ol.source.Vector()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([-43.208, -22.9102]),
                zoom: 11
            })
        });
    }
    
    google.maps.event.addDomListener(window, 'load', initialize);
    
    $('#carregaLinha').click(function() {
        var linha = $('#selectLinha').val();
        
        console.log('linha:', linha);
        
        socket.emit('loadPontos', linha);
    });
    
    google.maps.Polyline.prototype.distanceBetweenPointsOnPath = function(origin, destination) {
    
    };
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
}