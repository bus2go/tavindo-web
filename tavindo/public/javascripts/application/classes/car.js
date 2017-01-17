import Marker from './marker';
import Helper from '../utils/helper';

const MAX_POSITIONS = 5;

class Car {
    constructor(ordem, lat, lon, dataHora, source, map) {
        this.ordem = ordem;
        this.gps = [{ lat, lon, dataHora }];
        
        this.marker = new Marker(ordem, dataHora, lat, lon, source, map, (label, updateTime) => '<span>' + label + '</span><br /><code>' + Helper.getDiff(updateTime) + '</code>');
    }
    
    updatePosition(lat, lon, dataHora) {
        let latest = { lat, lon, dataHora };
        
        this.gps.push(latest);
        if(this.gps.length > MAX_POSITIONS) this.gps.shift();
        
        this.marker.moveTo(latest);
    }
    
    currentPosition() {
        let last = this.gps.length-1;
        
        if(last >= 0) {
            return this.gps[last];
        } else {
            return null;
        }
    }
}

export default Car;