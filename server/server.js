require('colors');
var net = require('net');
var mudConnections = [];
var io = require('socket.io').listen(2010);

io.set('log level', 1); //less spam

io.sockets.on('connection', function(socket){
  socket.on('init', onInit);
  socket.on('termMsg', ontermMsg);
  socket.on('disconnect', onDisconnect);

  function onInit(data){

    var mudder    = {};
    mudConnections['n'+socket.id] = mudder;
    mudder.ip     = socket.handshake.address.address; // socket info
    mudder.client = net.connect(data.port, data.address);

    mudder.client.setEncoding('utf8');
    mudder.client.on('error', function(data){
      console.log('caught an error!');
      console.log(data);
    });

    mudder.client.on('data', function(data)
    {
      console.log("-------start----");
      console.log(data);
      console.log("-------end----");

      io.sockets.socket(socket.id).emit('mudText', data);
    });

    mudder.client.on('end', function(){
      quit_routine(socket.id);
    });

    //log to console
    console.log('::::: Connect ::::::::::::::::::::::::::::::'.green);
    console.log('IP:  '+mudder.ip);
    console.log('SOCKET: '+socket.id);
    console.log('::::::::::::::::::::::::::::::::::::::::::::'.green);

  } //end onInit

  function ontermMsg(msg){
    mudConnections['n'+socket.id].client.write(msg+'\r\n');
  }

  function onDisconnect(){
      quit_routine(socket.id);
  }
  function quit_routine(sid){
    //potentially called twice on proper
    //shutdowns, but just incase the user d/c from
    //the mud or loses a socket, kill both.

    if(mudConnections['n'+sid]){

      var mudder = mudConnections['n'+sid];
      console.log('::::: Disconnect :::::::::::::::::::::::::::'.red);
      console.log('IP:     '+mudder.ip);
      console.log('SOCKET: '+sid);
      console.log('::::::::::::::::::::::::::::::::::::::::::::'.red);

      var txt = "\n\n\nYou are disconnected from the server." +
                "\n\n 'Reload' your browser to reconnect.";

      io.sockets.socket(socket.id).emit('mudText', txt);
      mudder.client.destroy(); //kill

      delete mudConnections['n'+sid];
      io.sockets.socket(sid).disconnect();

    }
  } //end quit_routine

}); //on.connection