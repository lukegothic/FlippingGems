var mm = {}

mm.setUp = function(params){
  this.params = params;
  //var self.io = io(self.params.host);
  this.io = io("http://127.0.0.1:3001");

  this.io.on("connect", function(){
    console.log("Connected to server");
  });

  this.io.on("disconnect", function(){
    console.log("disconnected from server");
  });
}

mm.ready = function(callback){
  this.io.on("connect", callback);
}

mm.requestMatch = function(callback){
  this.io.emit("joinMatch", {});
  this.status = "WAITING_MATCH";
  this.io.on("matchInfo", callback);
}

mm.endMatch = function(callback){
  this.io.on("endMatch", callback);
}

mm.setUp();

mm.ready(function(){
  mm.requestMatch(function(matchInfo){
    var yourTurn = matchInfo.turn;
    var matchId = matchInfo.id;
    Game.turn = yourTurn;
    Game.init();
    $("#game-container").show();
    $("#loading-match").hide();
  });

  mm.endMatch(function(params){
    setTimeout(function(){
      location.reload();
    }, 2000);
    alert(params.reason);
  });

})
