const express = require('express');
const router = express.Router();

router.get("/createGame", renderNoteForm);
router.post('/createGame' , gameController.renderCreateGameForm);

module.exports = router;