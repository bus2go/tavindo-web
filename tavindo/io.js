var io = require('socket.io')();
var db = require('./db');
var fs = require('fs');

var roomPrefix = '/linha_';
var currentData = {};

io.on('connection', socket => {
  
  socket.on('linha.select', linha => {
    for(var room in socket.rooms) {
      if(room.startsWith(roomPrefix)) {
        socket.leave(room);
      }
    }
    
    linha += '';
    var roomName = roomPrefix + linha;
    
    socket.join(roomName, err => {
      if(err) console.log('err', err);
      
      if(currentData[linha]) {
        for(var ordem in currentData[linha].ordens) {
          if(currentData[linha].ordens.hasOwnProperty(ordem)) {
            var last = currentData[linha].ordens[ordem].gps.length - 1;
            socket.emit('update', currentData[linha].ordens[ordem].gps[last]);
          }
        }
      }
    });
  });
  
  socket.on('bus.update', dados => {
    if(dados.linha == '') return;
    
    if(!currentData[dados.linha]) {
      currentData[dados.linha] = {
        ordens: {}
      };
    }
    
    if(!currentData[dados.linha].ordens[dados.ordem]) {
      currentData[dados.linha].ordens[dados.ordem] = {
        gps: []
      };
    }
    
    var gpsList = currentData[dados.linha].ordens[dados.ordem].gps;
    
    if(gpsList.length > 4) {
      currentData[dados.linha].ordens[dados.ordem].gps.shift();
    }
    
    if(gpsList.length === 0 || gpsList[gpsList.length - 1].dataHora != dados.dataHora) {
      
      currentData[dados.linha].ordens[dados.ordem].gps.push(dados);
    }
    
    socket.in(roomPrefix + dados.linha).emit('update', dados);
  });
  
  socket.on('itinerario.load', linha => {
    var sqlQuery = fs.readFileSync('script/consulta_itinerario.sql').toString();
    
    try {
      db.run(sqlQuery, [linha], result => {
        socket.emit('itinerario', result);
      });
    } catch(err) {
      console.log('err:', err);
    }
  });
});

module.exports = io;