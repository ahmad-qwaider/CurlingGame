

const socket = io();

socket.on('updateButtonState', function (buttonID) {
    let btn = document.getElementById(buttonID);
    btn.disabled = true;
    btn.style.backgroundColor = "lightgray";
});


socket.on('currentState', function (state) {
    if (state.isHomePlayerJoined) {
        let btn = document.getElementById("JoinAsHomeButton");
        btn.disabled = true;
        btn.style.backgroundColor = "lightgray";    
    }
    else{
        let btn = document.getElementById("JoinAsHomeButton");
        btn.disabled = false;
        btn.style.backgroundColor = HOME_PROMPT_COLOUR;      
    }
    if (state.isVisitorPlayerJoined) {
        let btn = document.getElementById("JoinAsVisitorButton");
        btn.disabled = true;
        btn.style.backgroundColor = "lightgray";  
    }
    else{
        let btn = document.getElementById("JoinAsVisitorButton");
        btn.disabled = false;
        btn.style.backgroundColor = VISITOR_PROMPT_COLOUR; 
    }
    drawCanvas();
});


socket.on('assignPlayer', function (buttonID) {
    if(buttonID == "JoinAsHomeButton"){
        if(!isHomePlayerAssigned){
            isHomePlayerAssigned = true
            isHomeClient = true
          }
    }
    else{
        if(!isVisitorPlayerAssigned) {
            isVisitorPlayerAssigned = true
            isVisitorClient = true
          }
    }
});




socket.on('updateGame', function(data) {
    if (data.action === 'mouseDown') {
        simulateMouseDown(data);
    }
    else if(data.action === 'mouseMove'){
        simulateMouseMove(data);  
    }
    else if(data.action === 'mouseUp'){
        simulateMouseUp(data);  
    }
});



socket.on('getGameState', function() {
    let gameState = getGameState();
    socket.emit('sendGameState', gameState);
});




socket.on('gameStateUpdate', function(gameState) {
    updateCanvasFromState(gameState);
});
