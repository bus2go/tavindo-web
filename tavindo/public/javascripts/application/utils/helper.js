class Helper {
    constructor() {}
    
    zeros (val, size) {
        val += '';
        
        while(val.length < size) val = '0' + val;
        
        return val;
    }
    
    getDiff(dataHora) {
        let date = new Date(dataHora);
        
        let updateTime = this.zeros(date.getHours(), 2) + ':' + this.zeros(date.getMinutes(), 2);
        
        let diff = this.getDiffInSec(dataHora);
        let min = parseInt(diff/60, 10);
        let sec = diff % 60;
        
        return updateTime + ' - ' + min + 'm' + sec + 's';
    }
    
    getDiffInSec(dataHora) {
        return parseInt((new Date() - new Date(dataHora))/1000, 10);
    }
}

export default new Helper();