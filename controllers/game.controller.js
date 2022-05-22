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
const gamefind = await  Game.findById(gameId);
const bets = setBet(gamefind);
console.log(bets)
const winner = setWinner(bets)
gamefind.inProgress = false;
gamefind.winner = winner;

await Game.findByIdAndUpdate(gameId,gamefind);
  
res.render('startGame', { 
  title: 'Start Game', 
  game: gamefind, 
  gamersBet: bets, 
  winner:winner
});
};

// fuctions bets

function randomNumber(){
  const numbers = []
  let n = 0;
  let number;
  let one = 0;
  let two = 0;
  let three = 0;
    do {
        number = Math.floor((Math.random() * 6) + 1);
        if ((number != one) && (number!= two) && (three != 3)) {
           numbers.push(number)
            n++;
            if (n == 1) {
                one = number;
            }
            if (n == 2) {
                two = number;
            }
            if (n == 3) {
                three = number;
            }
        }
    } 
while (n < 3);
  
  return numbers;
}

// fuction setnumber

function setBet(game){
  const gamersBet =[];
  bets = randomNumber();
  for (let i = 0; i < 3; i++) {
      gamersBet.push({
        id: game.gamers[i]._id,
        name: game.gamers[i].name,
        bet: bets[i]
  })
    
  }
  return gamersBet;
}


// fuction  set Winner
function setWinner(bets){
    const orderBets = bets.sort(function(a, b){return a.bet - b.bet})
    return orderBets[2].name
  
}
