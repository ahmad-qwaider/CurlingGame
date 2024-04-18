function simulateMouseDown(data) {
  stoneBeingShot =allStones.stoneAtLocation(data.canvasX, data.canvasY)
  console.log("inside the if condition: " + stoneBeingShot)

if(stoneBeingShot === null){
  if(iceSurface.isInShootingCrosshairArea(data.canvasMouseLoc)){
    if(shootingQueue.isEmpty()){
      stageStones();
   }
    //console.log(`shooting from crosshair`)
    stoneBeingShot = shootingQueue.front()
    stoneBeingShot.setLocation(data.canvasMouseLoc)
    console.log("inside the if condition: " + stoneBeingShot)
    //we clicked near the shooting crosshair
  }
}

if (stoneBeingShot != null) {
  shootingCue = new Cue(data.canvasX, data.canvasY)
  document.getElementById('canvas1').addEventListener('mousemove', handleMouseMove)
  document.getElementById('canvas1').addEventListener('mouseup', handleMouseUp)

}

drawCanvas()
}

function simulateMouseMove(data) {
  if (shootingCue != null) {
      shootingCue.setCueEnd(data.canvasX, data.canvasY)
    }
      
    drawCanvas()
}

function simulateMouseUp(data) {
  if (shootingCue != null) {
      let cueVelocity = shootingCue.getVelocity()
      if (stoneBeingShot != null) stoneBeingShot.addVelocity(cueVelocity)
      shootingCue = null
      shootingQueue.dequeue()
      enableShooting = false //disable shooting until shot stone stops
    }
  
    //remove mouse move and mouse up handlers but leave mouse down handler
    document.getElementById('canvas1').removeEventListener('mousemove', handleMouseMove)
    document.getElementById('canvas1').removeEventListener('mouseup', handleMouseUp)
  
    drawCanvas() //redraw the canvas
}



function getGameState() {
  const stonesState = allStones.getCollection().map(stone => ({
      x: stone.x,
      y: stone.y,
      radius: stone.radius,
      colour: stone.colour,
      velocityX: stone.velocityX,
      velocityY: stone.velocityY,
      isMoving: stone.isMoving
  }));

  const shootingQueueState = shootingQueue.getCollection().map(stone => ({
      x: stone.x,
      y: stone.y,
      radius: stone.radius,
      colour: stone.colour,
      velocityX: stone.velocityX,
      velocityY: stone.velocityY,
      isMoving: stone.isMoving
  }));

  return {
      allStones: stonesState,
      shootingQueue: shootingQueueState,
      whosTurnIsIt: whosTurnIsIt,
      enableShooting: enableShooting
  };
}







