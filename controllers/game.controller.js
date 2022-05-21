const { response } = require('../app');
const Game = require('../models/game.model');

exports.renderCreateGameForm = (req, res) => {
  res.render("game/createGame");
};

exports.renderStartGameForm =(req,res)=>{
  res.render("game/startGame");
}


exports.renderGameWinner= async (req, res) => {
  const game= await Game.find(req.params.winner).lean();
  res.send(game)
  //res.render('game/createGame');
  //res.render("notes/edit-note", { note });
};



exports.renderGameId= async (req,res) =>{
  const gameId = req.body.gameId ;

  const game = await Game.findById(req.params.id).lean();
  res.send(game)

}
exports.createGame= async (req, res) => {
  const playerOne= req.body.playerone;
  const playerTwo = req.body.playertwo;
  const playerThree = req.body.playerthree;
  const errors = [];

  if (!playerOne) {
    errors.push({ text: "Please Write the name of player one" });
  }
  if (!playerTwo) {
    errors.push({ text: "Please Write the name of player two" });
  }
  if (!playerThree) {
    errors.push({ text: "Please Write the name of player three" });
  }
  if (errors.length > 0) {
    res.render("game/createGame", {
      errors,
      playerOne,
      playerTwo,
      playerThree,
    });
    
  } else {
    const newGame = new Game({ gamers: [{name: playerOne}, {name: playerTwo}, {name: playerThree}] });
   await newGame.save();
    //newGame.user = req.user.id;
    const gameId = newGame._id;
    res.render('game/createGame', { gameId: gameId})
      
  }
};
exports.startGame = async (req, res) => {
 const gameId = req.body.gameId;
 Game.findById(gameId,function (err,game) {

  const bets = SetNumber(game);
  const winner = setWinner(bets)
  game.inProgress = false;
  game.winner = winner;
  console.log(game)
  res.send(game)
 })
 
  //const bets = SetNumber(game);
  //const winner = setWinner(bets)
  //res.render('game/createGame');
  //res.render("notes/edit-note", { note });
};

exports.startGame1= async(req,res,next)=>{
     const gameId = req.body.gameId;

   Game.findById(gameId, function (err, game){
      
        if (err) { 
            const err = new Error('Invalid data. Please try again');
            return next(err);
        }
        if(game == null){
            const err = new Error('ID not found');
            err.status = 404;
            return next(err);
        }
        if(!game.inProgress){
            const err = new Error('The game has already been played.');
            err.status = 400;
            return next(err);
        }

      const bets = SetNumber(game);
      const winner = setWinner(bets)

        game.inProgress = false;
        game.winner = winner;
        
        Game.findByIdAndUpdate(gameId, game, {}, function (err) {
            if (err) { 
                const err = new Error('Update failed.');
                return next(err);
            }
        });
        console.log(game)

        // Successful, so render.
        res.render('game/createGame', { 
            title: 'Start Game', 
            game: game, 
            gamersBet: bets, 
            winner:winner
        });
    });
}

// fuctions bets

function randomNumber(){
  return Math.random() * (6- 1) + 1;
}

// fuction setnumber

function SetNumber(game){
  const gamersBet =[]
 
  for (let i = 0; i < 2; i++) {
      gamersBet.push({
        id: game.gamers[i]._id,
        name: game.gamers[i].name,
        bet: randomNumber()
  })
    
  }
  return gamersBet;
}


// fuction  set Winner

function setWinner(gamersBet) {
  
  const temporary = 0;
          for (let i = 0; i < gamersBet.length - 1; i++) {
            for (let j = 0; j < gamersBet.length - 1; j++) {
                if (gamersBet.bet[j] > [j + 1]) {
                    temporary = gamersBet.bet[j];
                    gamersBet.bet[j] = gamersBet.bet[j + 1];
                    gamersBet.bet[j + 1] = temporary;
                }
            }
        }
  const winner = gamersBet[gamersBet.length].name;
  return winner
}
