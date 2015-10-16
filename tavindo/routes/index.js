var express = require('express');
var router = express.Router();
//var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '4doidão', apiKey: 'AIzaSyAnXOg_x18Pl0ONmjMOkqEKWWYwWA97T_g' });
});

/*
router.get('/itinerario/:linha', function(req, res, next) {
    res.sendFile(path.resolve(__dirname + '/../dados/itinerario/itinerario_' + req.params.linha + '.json'));
});

router.get('/pontos/:linha', function(req, res, next) {
    res.sendFile(path.resolve(__dirname + '/../dados/pontos/pontos_' + req.params.linha + '.json'));
});
*/
module.exports = router;
