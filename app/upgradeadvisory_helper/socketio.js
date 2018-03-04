var http = require('http');
var io = require('socket.io');

var SocketIO=function(){};

SocketIO.prototype.init=function(app){
   this.server=http.Server(app);
   this.socketio=io(http);
  
   return this.socketio;
   
}

module.exports=new SocketIO();