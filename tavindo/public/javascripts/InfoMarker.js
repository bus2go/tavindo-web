function InfoMarker(map, lat, lon, titulo, conteudo, idGPS, socket, mapOSM, iconStyle) {
    this.map = map;
    this.mapOSM = mapOSM;
    this.latLon = new google.maps.LatLng(lat, lon);
    this.pointOSM = new ol.geom.Point(ol.proj.fromLonLat([lon, lat]));
    this.titulo = titulo;
    this.conteudo = conteudo;
    this.idGPS = idGPS;
    this.socket = socket;
    this.iconStyle = iconStyle;
    
    var that = this;
    
    this.infowindow = new google.maps.InfoWindow({
        content: this.conteudo
    });
    
    this.marker = new google.maps.Marker({
        position: this.latLon,
        map: this.map,
        title: this.titulo
    });
    
    this.marker.addListener('click', function() {
        that.infowindow.open(that.map, that.marker);
    });
    
    this.infowindow.addListener('domready', function() {
        $('#id' + that.idGPS).click(function() {
            that.socket.emit('inativaPonto', that.idGPS);
        });
    });
    
    this.iconFeature = new ol.Feature({
        geometry: this.pointOSM,
        name: 'Teste'
    });
    
    this.iconFeature.setStyle(this.iconStyle);
    this.mapOSM.getVectorLayer().getSource().addFeature(this.iconFeature);
}

InfoMarker.prototype.destroy = function() {
    this.map = null;
    this.infowindow.setMap(null);
    this.marker.setMap(null);
    this.infowindow = null;
    this.marker = null;
    this.mapOSM.getVectorLayer().getSource().removeFeature(this.iconFeature);
};