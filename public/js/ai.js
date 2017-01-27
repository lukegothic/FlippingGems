Game = window.Game || {};
Game.AI = (function () {
    var ai = {};
    ai.algorithm = null;
    var EasyAlgorithm = function() {
        // Mapear puntuaciones
        var boardScores = [], score;
        for (var f = 0; f < Game.board.length; f++) {
            boardScores.push([]);
            for (var c = 0; c < Game.board[f].length; c++) {
                if (Game.board[f][c].who != Game.PLAYERNUM.NONE) {
                    squareScore = null;
                } else {
                    squareScore = 0;
                    // arriba
                    if (f > 0 && Game.board[f-1][c].who && Game.board[f-1][c].who === Game.PLAYERNUM.P1) {
                        squareScore++;
                    }
                    // abajo
                    if (f < (Game.board[f].length - 1) && Game.board[f+1][c].who === Game.PLAYERNUM.P1) {
                        squareScore++;
                    }
                    // izda
                    if (c > 0 && Game.board[f][c-1].who === Game.PLAYERNUM.P1) {
                        squareScore++;
                    }
                    // drcha
                    if (c < (Game.board[c].length - 1) && Game.board[f][c+1].who === Game.PLAYERNUM.P1) {
                        squareScore++;
                    }
                }
                boardScores[f][c] = squareScore;
            }
        }
        // Elegir tile
        var opts = [];
        var maxValue = -99;
        for (var f = 0; f < boardScores.length; f++) {
            for (var c = 0; c < boardScores[f].length; c++) {
                squareScore = boardScores[f][c];
                if (squareScore !== null) {
                    if (squareScore > maxValue) {
                        opts = [];
                        maxValue = squareScore;
                        opts.push({ x: f, y: c });
                    } else if (squareScore == maxValue) {
                        opts.push({ x: f, y: c });
                    }
                }
            }
        }
        console.log(opts);
        return opts.length === 1 ? opts[0] : opts[Math.floor(Math.random() * opts.length)];
    };
    var MediumAlgorithm = function() {

    };
    var HardAlgorithm = function() {

    };
    ai.GetMove = function() {
        return this.algorithm();
    };
    // TODO: Permitir seleccionar entre varios
    ai.algorithm = EasyAlgorithm;
    return ai;
})();
