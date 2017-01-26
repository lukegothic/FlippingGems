Game = window.Game || {};
Game.AI = (function () {
    var ai = {};
    ai.algorithm = null;
    var EasyAlgorithm = function(board) {
        var boardScores = [];
        for (var c = 0; c < board.length; c++) {
            boardScores.push([]);
            for (var f = 0; f < board[c].length; f++) {
                boardScores[c][f] = 0;
            }
        }
        console.log(boardScores);
    };
    var MediumAlgorithm = function(board) {

    };
    var HardAlgorithm = function(board) {

    };
    ai.GetMove = function(board) {
        return this.algorithm(board);
    };
    // TODO: Permitir seleccionar entre varios
    ai.algorithm = EasyAlgorithm;
    return ai;
})();
