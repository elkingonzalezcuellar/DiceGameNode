const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');



router.get("/createGame", gameController.renderCreateGameForm);
router.post('/createGame' , gameController.createGame);
router.get("/startGame",gameController.renderStartGameForm);
router.post("/startGame", gameController.startGame1);
router.get('/game/:id',gameController.renderGameId);
router.get('/game/:id/winner',gameController.renderGameWinner);


module.exports = router;