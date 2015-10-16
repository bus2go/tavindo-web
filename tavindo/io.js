var io = require('socket.io')();
var db = require('./db');
var fs = require('fs');
var path = require('path');

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  
  socket.on('loadItinerario', function (linha) {
    var obj = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/dados/itinerario/itinerario_' + linha + '.json'), 'utf8'));
    console.log(linha);
    socket.emit('itinerario', obj);
  });
  
  socket.on('loadPontos', function (linha) {
    db.connect(db.connString, function(err, connection, done) {
      if(err) throw err;
      
      //connection.query("SELECT d.*, g1.ordem, g1.lat AS g1_lat, g1.lon AS g1_lon, g2.lat AS g2_lat, g2.lon AS g2_lon FROM distancia d, gps g1, gps g2 WHERE g1.id = d.id_origem AND g2.id = d.id_destino AND d.dist > 0 AND d.dist < 300 ORDER BY d.dist + d.dist_ponto_final ASC, 5 ASC, 6 ASC",
      connection.query("SELECT g.lat as g1_lat, g.lon as g1_lon, g.ordem, g.dataHora FROM gps g WHERE g.ordem = 'A72063' ORDER BY g.ordem, g.dataHora LIMIT 1000",
      function(err, rows) {
        if(err) throw err;
        
        //console.log('rows:', rows);
        socket.emit('pontos', rows);
      });
      
      done();
    })
  });
});

module.exports = io;