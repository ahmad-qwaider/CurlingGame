
function handleJoinAsHomeButton(){
  console.log(`handleJoinAsHomeButton()`)
  socket.emit('joinAsHome');


}
function handleJoinAsVisitorButton(){
  console.log(`handleJoinAsVisitorButton()`)
  socket.emit('joinAsVisitor');
}
function handleJoinAsSpectatorButton(){
  console.log(`handleJoinAsSpectatorButton()`)
  socket.emit('joinAsSpectator');
  let btn = document.getElementById("JoinAsSpectatorButton")
  btn.disabled = true //disable button
  btn.style.backgroundColor="lightgray"

  if(!isSpectatorClient) isSpectatorClient = true

}
