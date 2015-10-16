var map = null;

$(document).ready(function(){
    var socket = io();
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
        /*
        var bounds = new google.maps.LatLngBounds();
        for(var i=0; i<data.length; i++) {
            var pos = new google.maps.LatLng(data[i].lat, data[i].lon);
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: data[i].ordem
            });
            
            bounds.extend(pos);
        }
        
        map.fitBounds(bounds);
        */
        var pontos = [];
        for(var i=0; i<data.rows.length; i++) {
            /*
            if(i!=0 && data.rows[i].ordem != data.rows[i-1].ordem) {
                var rota = new google.maps.Polyline({
                    path: pontos,
                    geodesic: true,
                    strokeColor: '#0000FF',
                    strokeOpacity: 1.0,
                    strokeWeight: 3
                });
                
                rota.setMap(map);
                
                pontos = [];
            }
            */
            var pos = new google.maps.LatLng(data.rows[i].g1_lat, data.rows[i].g1_lon);
            pontos.push(pos);
        }
        
        var rota = new google.maps.Polyline({
            path: pontos,
            geodesic: true,
            strokeColor: '#0000FF',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
        
        rota.setMap(map);
    });
    
    socket.on('update', function(data) {
        console.log('update.data:', data);
    });
    
    function initialize() {
        var mapOptions = {
            center: { lat: -34.397, lng: 150.644},
            zoom: 8
        };
        
        map = new google.maps.Map(document.getElementById('mapa'), mapOptions);
    }
    
    google.maps.event.addDomListener(window, 'load', initialize);
    
    $('#carregaLinha').click(function() {
        var linha = $('#selectLinha').val();
        
        console.log('linha:', linha);
        
        socket.emit('loadItinerario', linha);
        socket.emit('loadPontos', linha);
    });
    
    google.maps.Polyline.prototype.distanceBetweenPointsOnPath = function(origin, destination) {
    
    };
});