var io = require('socket.io')();
var db = require('./db');
var fs = require('fs');
var path = require('path');

io.on('connection', function (socket) {
  /*
  socket.on('loadItinerario', function (linha) {
    var caminho = path.resolve(__dirname + '/dados/itinerario/itinerario_' + linha + '.json');
    
    try {
      fs.accessSync(caminho);
      
      var obj = JSON.parse(fs.readFileSync(caminho, 'utf8'));
      console.log(linha);
      socket.emit('itinerario', obj);
    } catch(err) {
      console.log('err:', err);
    }
  });
  */
  
  socket.on('loadPontos', function (linha) {
    console.log('>>> loadPontos.linha:', linha);
    //var sqlQuery = "SELECT p.id, p.id_rota, r.id_linha, p.id_gps, l.linha, r.descricao, r.ativo, p.lat, p.lon FROM linha l, rota r, ponto p WHERE l.id = r.id_linha AND r.id = p.id_rota AND l.linha = $1 AND r.ativo = 'S' ORDER BY p.sequencia ASC";
    var sqlQuery = fs.readFileSync('script/consulta_itinerario.sql').toString();
    //var sqlMaiorRota = fs.readFileSync('script/query_maior_rota.sql').toString();
    //var sqlDetalhe = fs.readFileSync('script/query_detalhe_maior_rota.sql').toString();
    //console.log('sql:', sqlQuery);
    
    //db.sql(sqlMaiorRota, [linha], function(result) {
      //var idRota = result.rows[0].id_rota;
      //console.log('idRota:', idRota);
      //db.sql(sqlDetalhe, [idRota], function(resultDetalhe) {
      db.sql(sqlQuery, [linha], function(resultDetalhe) {
        socket.emit('pontos', resultDetalhe);
      });
    //});
  });
  
  socket.on('inativaPonto', function (idGps) {
    console.log('>>> inativaPonto.idGps:', idGps);
    
    var sqlUpdate = "UPDATE gps SET ativo = 'N' WHERE id = $1";
    var sqlRefreshGPS = "REFRESH MATERIALIZED VIEW gps_ativo";
    var sqlRefreshRota = "REFRESH MATERIALIZED VIEW rota_gps";
    
    db.sql(sqlUpdate, [idGps], function() {
      console.log('item inativado.');
      db.sql(sqlRefreshGPS, null, function() {
        console.log('view gps atualizada.');
        //db.sql(sqlRefreshRota, null, function() {
          //console.log('view rota atualizada.');
          socket.emit('atualizar');
        //});
      });
    });
  });
});

module.exports = io;