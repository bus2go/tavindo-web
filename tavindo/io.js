var io = require('socket.io')();
var db = require('./db');
var fs = require('fs');
var path = require('path');

io.on('connection', function (socket) {

  socket.on('itinerario.load', function (linha) {
    var sqlQuery = fs.readFileSync('script/consulta_itinerario.sql').toString();
    
    try {
      db.sql(sqlQuery, [linha], function(result) {
        socket.emit('itinerario', result);
      });
    } catch(err) {
      console.log('err:', err);
    }
  });
  
  socket.on('pontos.load', function (linha) {
    console.log('>>> pontos.load.linha:', linha);
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
      // db.sql(sqlQuery, [], function(resultDetalhe) {
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