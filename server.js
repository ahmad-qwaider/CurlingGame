/*
COMP 2406 [Your Course Title]
(c) [Your Name or Instructor's Name] 2018

[Your Custom Description Here]

Use browser to view pages at http://localhost:3000/curling.html
*/
let connectedUsers = {};
let notUpToDateUsers = {};
let homePlayer = null;
let visitorPlayer = null;

let whosTurnIsIt = 'red'
let gameStarted = false;

let isHomePlayerJoined = false;
let isVisitorPlayerJoined = false;

// Server Code
const http = require("http");
const fs = require("fs");
const url = require("url");
const server = http.createServer(handler);
const io = require('socket.io')(server);
const PORT = process.argv[2] || process.env.PORT || 3000;

const ROOT_DIR = "html"; // Directory to serve static files from



const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain"
};

function askForGameState(socketId) {
  console.log("hohooho")

  if (gameStarted) {
    console.log("hohooho")
    if (isHomePlayerJoined) {
      notUpToDateUsers[socketId] = ".";
      io.to(homePlayer).emit('getGameState');

    }
    else if (isVisitorPlayerJoined) {
      notUpToDateUsers[socketId] = ".";
      io.to(homePlayer).emit('getGameState');
    }

  }
}

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext];
    }
  }
  return MIME_TYPES["txt"];
}

function handler(request, response) {
  let urlObj = url.parse(request.url, true, false);
  console.log('\n============================');
  console.log("PATHNAME: " + urlObj.pathname);
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
  console.log("METHOD: " + request.method);

  let filePath = ROOT_DIR + urlObj.pathname;
  if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';

  fs.readFile(filePath, function (err, data) {
    if (err) {
      console.log('ERROR: ' + JSON.stringify(err));
      response.writeHead(404);
      response.end(JSON.stringify(err));
      return;
    }
    response.writeHead(200, { 'Content-Type': get_mime(filePath) });
    response.end(data);
  });
}


io.on('connection', function (socket) {
  console.log('A user connected');

  socket.emit('currentState', {
    isHomePlayerJoined: isHomePlayerJoined,
    isVisitorPlayerJoined: isVisitorPlayerJoined
  });



  socket.on('joinAsHome', () => {
    if (!isHomePlayerJoined) {
      askForGameState(socket.id);
      isHomePlayerJoined = true;
      connectedUsers[socket.id] = "HOME"
      homePlayer = socket.id;
      for (let id in connectedUsers) {
        io.to(id).emit('updateButtonState', "JoinAsHomeButton");
      }

      socket.emit('currentState', {
        isHomePlayerJoined: isHomePlayerJoined,
        isVisitorPlayerJoined: isVisitorPlayerJoined

      });

      socket.emit('assignPlayer', "JoinAsHomeButton");

    }
  });



  socket.on('joinAsVisitor', () => {
    if (!isVisitorPlayerJoined) {
      askForGameState(socket.id);
      isVisitorPlayerJoined = true;
      connectedUsers[socket.id] = "Visitor";
      visitorPlayer = socket.id;
      for (let id in connectedUsers) {
        io.to(id).emit('updateButtonState', "JoinAsVisitorButton");
      }

      socket.emit('currentState', {
        isHomePlayerJoined: isHomePlayerJoined,
        isVisitorPlayerJoined: isVisitorPlayerJoined
      });

      socket.emit('assignPlayer', "JoinAsVisitorButton");

    }
  });

  socket.on('joinAsSpectator', () => {
    connectedUsers[socket.id] = "Spectator";
    console.log("im asking for game state");
    askForGameState(socket.id);
    socket.emit('currentState', {
      isHomePlayerJoined: isHomePlayerJoined,
      isVisitorPlayerJoined: isVisitorPlayerJoined
    });
  });

  socket.on('playerAction', function (data) {
    if (gameStarted == false) {
      console.log("change game started to true")
      gameStarted = true;
    }

    for (let id in connectedUsers) {
      io.to(id).emit('updateGame', data);
    }

  });

  socket.on('sendGameState', function (gameState) {
    // Broadcast the game state to all connected clients
    for (let id in notUpToDateUsers) {
      io.to(id).emit('gameStateUpdate', gameState);
    }
    notUpToDateUsers = {};

  });


  socket.on('disconnect', function () {
    let playerDisconnected = false;
    if (socket.id == homePlayer) {
      isHomePlayerJoined = false;
      playerDisconnected = true;
    }
    if (socket.id == visitorPlayer) {
      isVisitorPlayerJoined = false;
      playerDisconnected = true;
    }
    if (playerDisconnected) {
      for (let id in connectedUsers) {
        io.to(id).emit('currentState', {
          isHomePlayerJoined: isHomePlayerJoined,
          isVisitorPlayerJoined: isVisitorPlayerJoined
        });
      }
    }
    console.log('User disconnected');
  });
});

server.listen(PORT, function () {
  console.log("Server Running at PORT " + PORT + "  CNTL-C to quit");
  console.log("To Test");
  console.log("http://localhost:" + PORT + "/curling.html");
});




