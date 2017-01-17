import ol from 'openlayers';
import Helper from '../utils/helper';

export default class Marker {
    constructor(label, dataHora, lat, lon, source, map, getHTML) {
        this.feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
            name: label
        });
        
        this.feature.label = label;
        this.feature.dataHora = dataHora;
        this.feature.getHTML = getHTML;
        
        this.feature.setStyle(this.getStyle());
        
        source.addFeature(this.feature);
        
        map.on("click", evt => {
            map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if(feature.getGeometryName() !== 'geometry') {
                    map.popup.content.innerHTML = feature.getHTML(feature.label, feature.dataHora);
                    map.getOverlays().item(0).setPosition(undefined);
                    map.getOverlays().item(0).setPosition(feature.getGeometry().getCoordinates());
                    map.popup.container.style.display = 'block';
                }
            });
        });
    }
    
    moveTo(updated) {
        this.feature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([updated.lon, updated.lat])));
        this.feature.setGeometryName(this.feature.label);
        this.feature.dataHora = updated.dataHora;
        this.feature.setStyle(this.getStyle());
    }
    
    getStyle() {
        let diff = Helper.getDiffInSec(this.feature.dataHora);
        let url = '/images/bus_red.png';
        
        if(diff <= 180) {
            url = '/images/bus_green.png';
        } else if(diff <= 600) {
            url = '/images/bus_yellow.png';
        }
        
        let style = new ol.style.Style({
            image: null
        });
        
        if(diff <= 600) {
            style.setImage(new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 0.9],
                opacity: 0.75,
                src: url
            })));
        }
        
        return style;
    }
}