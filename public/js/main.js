Game = window.Game || {};
Game.boardSize = 6;
Game.bgMusic = null;
Game.placeTileSound = null;
Game.PLAYERNUM = {
    NONE: 0,
    P1: 1,
    P2: 2,
    AI: 3
};
Game.currentPlayer = null;
Game.MODE = {
    RANKED: 0,
    HOTSEAT: 1,
    VSAI: 2
};
Game.mode = null;
Game.board = [];
Game.displayPlayer = function(player) {
    player = player || this.currentPlayer;
    $("body").removeClass().addClass("player" + player + "bg");
};
Game.nextPlayerRANKED = function() {
    // TODO
};
Game.nextPlayerHOTSEAT = function() {
    switch (this.currentPlayer) {
        case 1:
            this.currentPlayer = this.PLAYERNUM.P2;
        break;
        case 2:
            this.currentPlayer = this.PLAYERNUM.P1;
        break;
        default:
            this.currentPlayer = Math.round(Math.random()) + 1;
        break;
    }
    this.displayPlayer();
};
Game.nextPlayerVSAI = function() {
    var _self = this;
    switch (this.currentPlayer) {
        case this.PLAYERNUM.P1:
            Game.disableTileClick();
            this.currentPlayer = this.PLAYERNUM.P2;
            var move = this.AI.GetMove();
            window.setTimeout(function() {
                _self.placeMove(move);
                Game.enableTileClick();
            }, 1000);
        break;
        case this.PLAYERNUM.P2:
        default:
            this.currentPlayer = this.PLAYERNUM.P1;
        break;
    }
    this.displayPlayer();
};
// Funcion que se sobreescribe en funcion del modo de juego
Game.nextPlayer = function() {};
Game.getScores = function() {
    var scores = [0, 0, 0];
    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board[i].length; j++) {
            scores[this.board[i][j].who]++;
        }
    }
    return scores;
};
Game.updateScore = function(scores) {
    scores = scores || this.getScores();
    $("#p1score").html(scores[this.PLAYERNUM.P1]);
    $("#p2score").html(scores[this.PLAYERNUM.P2]);
};
Game.getAdjacentSquares = function(position) {
    var squares = [];
    var x,y;
    // arriba
    x = position.x;
    y = position.y - 1;
    if (y >= 0 && y < Game.boardSize) {
        squares.push({ x: x, y: y });
    }
    // abajo
    y = position.y + 1;
    if (y >= 0 && y < Game.boardSize) {
        squares.push({ x: x, y: y });
    }
    // izda
    x = position.x - 1;
    y = position.y;
    if (x >= 0 && x < Game.boardSize) {
        squares.push({ x: x, y: y });
    }
    // derecha
    x = position.x + 1;
    if (x >= 0 && x < Game.boardSize) {
        squares.push({ x: x, y: y });
    }
    return squares;
};
Game.setMode = function(mode) {
    switch (mode) {
        case this.MODE.RANKED:
            this.nextPlayer = this.nextPlayerRANKED;
        break;
        case this.MODE.HOTSEAT:
            this.nextPlayer = this.nextPlayerHOTSEAT;
        break;
        case this.MODE.VSAI:
            this.nextPlayer = this.nextPlayerVSAI;
        break;
        default:
            this.nextPlayer = this.nextPlayerVSAI;
        break;
    }
};
Game.newGame = function(mode) {
    $("#end").hide();
    this.currentPlayer = null;
    this.board = [];
    $(".board").empty();
    var rowElm, squareElm;
    for (var i = 0; i < this.boardSize; i++) {
        this.board[i] = [];
        rowElm = $("<div>").addClass("boardrow");
        for (var j = 0; j < this.boardSize; j++) {
            this.board[i][j] = {
                who: this.PLAYERNUM.NONE,
                elem: $("<div>").addClass("square player" + this.PLAYERNUM.NONE).data({ x: i, y: j})
            };
            rowElm.append(this.board[i][j].elem);
        }
        $(".board").append(rowElm);
    }
    this.updateScore();
    if (mode) {
        this.setMode(mode);
    }
    this.nextPlayer();
};
Game.endGame = function (scores) {
    var winner = $("#winner");
    if (scores[this.PLAYERNUM.P1] > scores[this.PLAYERNUM.P2]) {
        winner.html("GANA EL <span class='player1text'>ROJO</span>");
        this.displayPlayer(this.PLAYERNUM.P1);
    } else if (scores[this.PLAYERNUM.P1] < scores[this.PLAYERNUM.P2]) {
        winner.html("GANA EL <span class='player2text'>AZUL</span>");
        this.displayPlayer(this.PLAYERNUM.P2);
    } else {
        winner.html("EMPATE");
        this.displayPlayer(this.PLAYERNUM.NONE);
    }
    $("#end").show();
};
Game.generateWave = function(src) {
    //$("body").append($("<div>").addClass("gps").position(src.position()));
    var pos = src.position();
    $("body").append($("<div>").addClass("gps").css({ "left": pos.left - (src.width()), "top": pos.top - (src.height()) }));
};
Game.generatePulsation = function(src) {
    $(".gps").remove();
    Game.generateWave(src);
    window.setTimeout(function () {
        Game.generateWave(src);
    }, 200);
}
Game.placeMove = function(position) {
    var square = Game.board[position.x][position.y].elem;
    Game.board[position.x][position.y].who = this.currentPlayer;
    square.removeClass().addClass("tile square player" + this.currentPlayer);
    Game.generatePulsation(square);
    Game.placeTileSound[0].play();
    var adjacentSquares = Game.getAdjacentSquares(position);
    var theSquare;
    for (var i = 0; i < adjacentSquares.length; i++) {
        theSquare = Game.board[adjacentSquares[i].x][adjacentSquares[i].y];
        if (theSquare.who !== this.currentPlayer && theSquare.who !== Game.PLAYERNUM.NONE) {
            theSquare.who = this.currentPlayer;
            theSquare.elem.removeClass().addClass("tile square player" + this.currentPlayer);
        }
    }
    var scores = Game.getScores();
    Game.updateScore(status);
    if (scores[Game.PLAYERNUM.NONE] == 0) {
        Game.endGame(scores);
    } else {
        Game.nextPlayer();
    }
};
Game.tileClick = function() {
    var squareInfo = $(this).data();
    if (Game.board[squareInfo.x][squareInfo.y].who == Game.PLAYERNUM.NONE) {
        Game.placeMove(squareInfo);
    } else {
        console.log("casilla ocupada por " + Game.board[squareInfo.x][squareInfo.y].who);
    }
};
Game.disableTileClick = function() {
    $(".board").off("click", ".square", Game.tileClick);
};
Game.enableTileClick = function() {
    $(".board").on("click", ".square", Game.tileClick);
};
Game.init = function() {
    $("#end").hide();
    $(".presentacion").click(function() {
        $(this).fadeOut();
    });
    Game.enableTileClick();
    $("#newGame").click(function() {
        Game.newGame();
    });
    this.bgMusic = $("#bgSound");
    this.bgMusic[0].volume = 0.1;
    this.placeTileSound = $("#ficha");
    $(".seleccionmodo .modo").click(function() {
        Game.newGame(parseInt(this.dataset.mode));
        $(".seleccionmodo").fadeOut(500);
    });
};
Game.init();
