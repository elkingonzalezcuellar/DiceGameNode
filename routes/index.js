const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dice Game' });
});

router.get('/createGame', function(req, res, next) {
  res.render('createGame', { title: 'Create Game' , gameId: ""});
});

router.get('/startGame', function(req, res, next) {
  res.render('startGame', { title: 'Start Game', game: null });
});



module.exports = router;

