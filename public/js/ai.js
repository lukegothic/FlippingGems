Game = window.Game || {};
Game.AI = (function () {
    var ai = {};
    ai.algorithm = null;
    var GetSimpleScoreBoard = function(player) {
        var boardScores = [], squareScore;
        for (var f = 0; f < Game.board.length; f++) {
            boardScores.push([]);
            for (var c = 0; c < Game.board[f].length; c++) {
                if (Game.board[f][c].who != Game.PLAYERNUM.NONE) {
                    squareScore = null;
                } else {
                    squareScore = 0;
                    // arriba
                    if (f > 0) {
                        squareWho = Game.board[f-1][c].who;
                        if (squareWho !== Game.PLAYERNUM.NONE && squareWho !== player) {
                            squareScore++;
                        }
                    }
                    // abajo
                    if (f < (Game.board[f].length - 1)) {
                        squareWho = Game.board[f+1][c].who;
                        if (squareWho !== Game.PLAYERNUM.NONE && squareWho !== player) {
                            squareScore++;
                        }
                    }
                    // izda
                    if (c > 0) {
                        squareWho = Game.board[f][c-1].who;
                        if (squareWho !== Game.PLAYERNUM.NONE && squareWho !== player) {
                            squareScore++;
                        }
                    }
                    // drcha
                    if (c < (Game.board[c].length - 1)) {
                        squareWho = Game.board[f][c+1].who;
                        if (squareWho !== Game.PLAYERNUM.NONE && squareWho !== player) {
                            squareScore++;
                        }
                    }
                }
                boardScores[f][c] = squareScore;
            }
        }
        return boardScores;
    };
    var GetBoardScoreStats = function(scoreBoard) {
        var total = 0;
        var max = -99;
        scoreBoard.forEach(function(fila) {
            fila.forEach(function(columna) {
                columna = columna || 0;
                total+= columna;
                if (columna > max) {
                    max = columna;
                }
            });
        });
        return { max: max, total: total };
    };
    var SimulateMove = function(tile, player) {
        var simulatedBoard = $.extend(true, [], Game.board);

        return simulatedBoard;
    };
    var EasyAlgorithm = function() {
        var sbs = GetSimpleScoreBoard(Game.PLAYERNUM.P2);
        // Elegir tile
        var opts = [], maxValue = -99, squareScore;
        for (var f = 0; f < sbs.length; f++) {
            for (var c = 0; c < sbs[f].length; c++) {
                squareScore = sbs[f][c];
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
        return opts.length === 1 ? opts[0] : opts[Math.floor(Math.random() * opts.length)];
    };
    var MediumAlgorithm = function() {
        // obtener score por recuadro
        var ssb = GetSimpleScoreBoard(Game.PLAYERNUM.P2);
        // simular cada posibilidad por cada opcion
        var complexScoreBoard = [];
        var nextMoveSim;
        var bss;
        ssb.forEach(function(fila) {
            fila.forEach(function(columna) {
                if (columna !== null) {
                    // TODO: esto no funciona hay que hacer bucle for normal
                    nextMoveSim = SimulateMove({ x: fila, y: columna }, Game.PLAYERNUM.P1);
                    bss = GetBoardScoreStats(nextMoveSim);
                    //complexScoreBoard[x,y] = columna - bss.max;
                } else {

                }
            });
        });
        //$.extend(true, [], a);
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
