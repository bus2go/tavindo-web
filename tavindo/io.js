"use strict";

const io = require('socket.io')();
const db = require('./db');
const fs = require('fs');

const roomPrefix = '/linha_';
let currentData = {};

io.on('connection', socket => {
  
  socket.on('linha.select', linha => {
    for(let room in socket.rooms) {
      if(room.startsWith(roomPrefix)) {
        socket.leave(room);
      }
    }
    
    linha += '';
    let roomName = roomPrefix + linha;
    
    socket.join(roomName, err => {
      if(err) console.log('err', err);
      
      if(currentData[linha]) {
        for(let ordem in currentData[linha].ordens) {
          if(currentData[linha].ordens.hasOwnProperty(ordem)) {
            let last = currentData[linha].ordens[ordem].gps.length - 1;
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
    
    let gpsList = currentData[dados.linha].ordens[dados.ordem].gps;
    
    if(gpsList.length > 4) {
      currentData[dados.linha].ordens[dados.ordem].gps.shift();
    }
    
    if(gpsList.length === 0 || gpsList[gpsList.length - 1].dataHora != dados.dataHora) {
      
      currentData[dados.linha].ordens[dados.ordem].gps.push(dados);
    }
    
    socket.in(roomPrefix + dados.linha).emit('update', dados);
  });
  
  socket.on('itinerario.load', linha => {
    let sql = fs.readFileSync('script/consulta_itinerario.sql').toString();
    
    try {
      db.run(sql, [linha], result => {
        socket.emit('itinerario', result);
      });
    } catch(err) {
      console.log('err:', err);
    }
  });
  
  socket.on('linhas.load', () => {
    let sql = fs.readFileSync('script/consulta_linhas.sql').toString();
    
    try {
      db.run(sql, null, data => {
        console.log('rows', data.rows);
        
        let result = data.rows.map(item => {
          return { 
            value: item.linha,
            text: item.linha + ' - ' + item.nome
          };
        });
        
        socket.emit('linhas', result);
      });
    } catch(err) {
      console.log('err:', err);
    }
  });
});

module.exports = io;