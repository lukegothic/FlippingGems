class matchManager{
  constructor(params){
    var self = this;
    self.params = params;
    self.io = self.params.io;
    self.unmatchedClients = [];
    self.matches = [];
    self.onlinePlayers = [];
    self.matchPlayers = self.params.matchPlayers;
    self.lastMatchId = 0;
  }

  newMatch(){
    var self = this;
    self.lastMatchId++;

    self.matches[self.lastMatchId] = {
      id:self.lastMatchId,
      players: []
    };
    console.log("New Match created: "+ self.lastMatchId);
    return self.lastMatchId;
  }

  endMatch(match, reason){
    var self = this;
    self.matches[match].players.forEach(function(player, index, players){
      if (self.io.sockets.connected[player]!=undefined) {
        self.io.sockets.connected[player].emit("endMatch", {
          reason: reason
        });
        self.joinRequest(player)
      }
    });

    self.matches.splice(match, 1);
  }

  matchInfo(matchId){
    return {
      id: matchId,
    };
  }

  appendPlayerToMatch(match, player){
    var self = this;
    self.matches[match].players.push(player);
    self.unmatchedClients.splice(self.unmatchedClients.indexOf(player),1);
  }

  connect(player){
    var self = this;
    self.onlinePlayers.push(player);
    console.log("Connected player " + player + " total:" + self.onlinePlayers.length);
  }

  disconnect(player){
    var self = this;

    self.onlinePlayers.splice(self.onlinePlayers.indexOf(player), 1); // Remove from the online table
    self.unmatchedClients.splice(self.unmatchedClients.indexOf(player), 1); // Remove from the unmatched table

    self.matches.forEach(function(match, mindex, matches){
      match.players.forEach(function(mplayer, index, players){
          if(mplayer == player){
            self.endMatch(mindex, "Player Disconnected");
          }
      });
    });

    console.log("Disconnected player " + player + " total:" + self.onlinePlayers.length);
  }

  joinRequest(client){
    var self = this;

    if(self.unmatchedClients.indexOf(client) !== -1){
      console.log(client + " already in waitlist");
      return false;
    }

    self.unmatchedClients.push(client);
    console.log("Added to waitlist " + client + " total:" + self.unmatchedClients.length);

    if(self.unmatchedClients.length >= self.matchPlayers){
      var matchId = self.newMatch();
      for (var i = 0; i < self.matchPlayers; i++) {
        self.appendPlayerToMatch(matchId, self.unmatchedClients[Math.floor(Math.random() * self.unmatchedClients.length)]); // get random element from unmatched clients
      };

      self.matches[matchId].players.forEach(function(player, index, arr){
      //   player.emit("matchInfo", self.matchInfo(matchId));
        console.log("Joined to a match " + player + " " + JSON.stringify(arr));
        self.io.sockets.connected[player].emit("matchInfo", matchId);
      });
/*
      for (var i = 0; i < self.matches[matchId].players.length; i++) {
        var player = self.matches[matchId].players[i];
        console.log("Joined to a match " + player + " " + matchID);
      }*/

    }
  }
}

module.exports = matchManager;
