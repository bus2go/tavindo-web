import ol from 'openlayers';

export default class Marker {
    constructor(data, closest) {
        let feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([data.lon, data.lat])),
            name: data.ordem + ' - ' + data.dataHora
        });
        
        let iconStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 0.9],
                opacity: 0.75,
                scale: 0.3,
                src: '/images/pin.png'
            }))
        });
                
        feature.setStyle(iconStyle);
        
        this.ordem = data.ordem;
        this.linha = data.linha;
        this.feature = feature;
        
        this.pontos = [{ lat: data.lat, lon: data.lon, dataHora: data.dataHora }];
        this.pontosIda = [closest.ida];
        this.pontosVolta = [closest.volta];
    }
}