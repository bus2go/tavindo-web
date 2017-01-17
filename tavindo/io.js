"use strict";

const io = require('socket.io')();
const db = require('./db');
const fs = require('fs');

const ROOM_PREFIX = '/linha_';
let currentData = {};
let lines = {};

io.on('connection', socket => {
  socket.on('busLine.selected', async routeId => {
    let sql = fs.readFileSync('script/consulta_itinerario.sql').toString();
    let result = await db.runWait(sql, [routeId]);
    
    for(let room in socket.rooms) {
      if(room.startsWith(ROOM_PREFIX)) {
        socket.leave(room);
      }
    }
    
    let linha = result.rows[0].route_short_name;
    let roomName = ROOM_PREFIX + linha;
    
    if(!lines[linha]) lines[linha] = routeId;
    
    socket.emit('busLine.selected.ok', { routeId: routeId, data: result.rows[0] });
    
    socket.join(roomName, err => {
      if(err) console.log('err', err);
      
      if(currentData[linha]) {
        for(let ordem in currentData[linha].ordens) {
          if(currentData[linha].ordens.hasOwnProperty(ordem)) {
            let last = currentData[linha].ordens[ordem].gps.length - 1;
            socket.emit('bus.updated', currentData[linha].ordens[ordem].gps[last]);
          }
        }
      }
    });
    
    //socket.emit('itinerario.load.ok', result.rows[0]);
  });
  
  socket.on('bus.update', rawData => {
    let dados = rawData.data;
    let city = rawData.city;
    
    if(dados.linha == '' || city !== 'Rio de Janeiro') return;
    
    if(!currentData[dados.linha]) {
      currentData[dados.linha] = { ordens: {} };
    }
    
    if(!currentData[dados.linha].ordens[dados.ordem]) {
      currentData[dados.linha].ordens[dados.ordem] = { gps: [] };
    }
    
    let gpsList = currentData[dados.linha].ordens[dados.ordem].gps;
    
    if(gpsList.length > 4) currentData[dados.linha].ordens[dados.ordem].gps.shift();
    
    if(gpsList.length === 0 || gpsList[gpsList.length - 1].dataHora != dados.dataHora) {
      currentData[dados.linha].ordens[dados.ordem].gps.push(dados);
    }
    
    socket.in(ROOM_PREFIX + dados.linha).emit('bus.updated', dados);
  });
  
  /*
  socket.on('itinerario.load', async linha => {
    let sql = fs.readFileSync('script/consulta_itinerario.sql').toString();
    
    let result = await db.runWait(sql, [linha]);
    socket.emit('itinerario.load.ok', result.rows[0]);
  });
  */
  
  socket.on('linhas.load', async () => {
    let sql = fs.readFileSync('script/consulta_linhas.sql').toString();
    
    try {
      let data = await db.runWait(sql, null); //, data => {
      let result = data.rows.map(item => {
        return { 
          value: item.route_id,
          text: item.linha + ' - ' + item.nome,
          group: item.city
        };
      }).reduce((map, item) => {
        if(!map) map = { groups: [] };
        
        if(!map[item.group]) {
          map[item.group] = { items: [] };
          map.groups.push(item.group);
        }
        map[item.group].items.push(item);
        
        return map;
      }, { groups: [] });
      
      socket.emit('linhas.load.ok', result);
      //});
    } catch(err) {
      console.log('err:', err);
    }
  });
});

module.exports = io;