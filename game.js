const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
const btnUp = document.querySelector('#arriba');
const btnLeft = document.querySelector('#izquierda');
const btnRight = document.querySelector('#derecha');
const btnDown = document.querySelector('#abajo');
const mostrarVidas=document.querySelector('#lives');
const textTime=document.querySelector('#textTime');
const record = document.querySelector('#record');
let canvasSize;let elementsSize;
let playerPosition={
  x: undefined,
  y: undefined
};
let arrayEspacio=[];let arrayBombas=[];
let level=2;let lives=3;
let timeStart;let timePlayer;let timeInterval;


function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.85;
  } else {
    canvasSize = window.innerHeight * 0.85;
  }
  
  canvas.setAttribute('width', canvasSize+15);
  canvas.setAttribute('height', canvasSize+15);
  
  elementsSize = Math.floor(canvasSize / 10);

  startGame();
}

function startGame() {
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'start';
  arrayEspacio =[];
  arrayBombas=[];
  
  //creacion del mapa
  
  game.clearRect(0,0,canvasSize, canvasSize);//renderizamos mapa
  establecerPerimetro(level);
  showLives();
  
  // for (let y = 1; y <= 10; y++) {
  //   for (let x =1;x <=10; x++) {
  //       game.fillText(emojis[mapRowCols[x-1][y-1]], elementsSize*(x-1), elementsSize*(y));
  // }
  // }
}

function posicionesDisponibles(espacioX,espacioY,regalo) {
    this.espacioX=espacioX;
    this.espacioY=espacioY;
    this.regalo=regalo;
}
function establecerPerimetro(level) {
  const map = maps[level];
  if (!map) {
    console.log("hola");;
  }else{
    //array de los elementos(primer nivel), al guardarlo en la variable map lo convierte en un string
  // metodo split crea un arreglo y lo diferncia apartir del argumento que metamos y trim elimina espacios
  // al inicio y final de cada string

  const filas=map.trim().split("\n");
  //a cada elemto de filas(array) le quitaremos los espacios vacios con trim y luego los convertiremos en un 
  //arreglo con split
  const mapRowCols = filas.map(row => row.trim().split(''));
  mapRowCols.forEach((emoji,y) => {
    emoji.forEach((emoji,x)=>{
      if (emoji == 'O' && playerPosition.y==undefined && playerPosition.y ==undefined) {
        playerPosition.x = (elementsSize*(x));
        playerPosition.y = (elementsSize*(y+1));
      }else if ((emoji == '-' ||emoji =='I'|| emoji == 'O')) {
        if (emoji=='I') {
          let pd =new posicionesDisponibles(elementsSize*(x),(elementsSize*(y+1)),"regalo");
        arrayEspacio.unshift(pd);
        }if (emoji=='-') {
          let pd =new posicionesDisponibles(elementsSize*(x),(elementsSize*(y+1)),"respacio");
        arrayEspacio.push(pd);
        }
        else {
          let pd =new posicionesDisponibles(elementsSize*(x),elementsSize*(y+1),"puerta");
        arrayEspacio.push(pd);
        }
      }else if(emoji=='X'){
        let pd =new posicionesDisponibles(elementsSize*(x),(elementsSize*(y+1)),"bomba");
        arrayBombas.push(pd);
      }
      
      game.fillText(emojis[emoji],elementsSize*(x),(elementsSize*(y+1)));
    });
  });
  if (localStorage.getItem('record')!=null) {
    record.innerHTML=localStorage.getItem('record');
  }
  movePlayer();
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
  }
  
}
function levelWin(){
  console.log("subiste de nivel");
  level++;
  if (level>=3) {
    clearInterval(timeInterval);
    victory();
    if (localStorage.getItem('record')==null) {
      localStorage.setItem('record',parseFloat(textTime.innerHTML))
    }
    showRecord(textTime.innerHTML);
  }
}
function victory(){
  console.log("ganastes crack");
}
function gameOver(pocicionX,pocisionY) {
    game.fillText(emojis['BOMB_COLLISION'], pocicionX, pocisionY);
    console.log("perdistes");

    lives--;
    if (lives>0) {
      playerPosition.x=undefined;
      playerPosition.y=undefined;
      console.log(level,lives);
    }
    if(lives<=0){
    
    clearInterval(timeInterval);
    timeStart=undefined;
    level=0;
    lives=3;
    playerPosition.x=undefined;
    playerPosition.y=undefined;
      }
  setTimeout(setCanvasSize,1000)
  }
function movePlayer() {
  const pasarNivel=(playerPosition.x==arrayEspacio[0].espacioX)&&(playerPosition.y==arrayEspacio[0].espacioY);
  if (pasarNivel) {
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    game.textAlign = 'start';
    levelWin();
    setCanvasSize();
  }else{
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    game.textAlign = 'start';
  }
}
function showLives() {
  mostrarVidas.innerHTML = emojis["HEART"].repeat(lives)
}
function showTime() {
  textTime.innerText = +((Date.now()-timeStart)/1000);

}
function showRecord(posibleRecord) {
  if (localStorage.getItem('record')>posibleRecord) {
    console.log("loco no hay record");
  } else {
    console.log("existe un nuevo record",posibleRecord);
    localStorage.setItem('record',posibleRecord)
    record.innerHTML=localStorage.getItem('record');
  }
  
}
window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if (event.key == 'ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if (event.key == 'ArrowRight') moveRight();
  else if (event.key == 'ArrowDown') moveDown();
}
function moveUp() {
  let mover=false;
  arrayEspacio.map(objeto=>{
    if ((objeto.espacioY==playerPosition.y-elementsSize 
    && objeto.espacioX==playerPosition.x)){
      mover=true
    }
  });
  arrayBombas.forEach(objeto=>{
    if ((objeto.espacioY)==(playerPosition.y-elementsSize)
    && (objeto.espacioX)==(playerPosition.x))
    gameOver(playerPosition.x,playerPosition.y-elementsSize);
  });
  if (mover) {  
    playerPosition.y -= elementsSize;
    setCanvasSize();
  }

}
function moveLeft() {
  let mover=false;
  arrayEspacio.forEach(objeto=>{
    if ((objeto.espacioX)==(playerPosition.x-elementsSize) 
    && (objeto.espacioY)==(playerPosition.y)){
      mover=true;
    }
  });
  arrayBombas.forEach(objeto=>{
    if ((objeto.espacioX)==(playerPosition.x-elementsSize)
    && (objeto.espacioY)==(playerPosition.y))
    gameOver(playerPosition.x-elementsSize,playerPosition.y);
  });
  if (mover) {  
    playerPosition.x = (playerPosition.x-elementsSize);
    setCanvasSize();
  }
}
function moveRight() {
  let mover=false;
  arrayEspacio.forEach(objeto=>{
    if ((objeto.espacioX)==(playerPosition.x+elementsSize)
    && (objeto.espacioY)==(playerPosition.y))
      mover=true;
    });
    arrayBombas.forEach(objeto=>{
      if ((objeto.espacioX)==(playerPosition.x+elementsSize)
      && (objeto.espacioY)==(playerPosition.y))
      gameOver(playerPosition.x+elementsSize,playerPosition.y);
    });
    if (mover) {  
      playerPosition.x += elementsSize;
      setCanvasSize();
    }
      
    }
function moveDown() {
  let mover=false;
  arrayEspacio.forEach(objeto=>{
    if (((objeto.espacioY)==(playerPosition.y+elementsSize))
    && ((objeto.espacioX)==(playerPosition.x))) {
      mover=true;
    }
  });
  arrayBombas.forEach(objeto=>{
    if ((objeto.espacioY)==(playerPosition.y+elementsSize)
    && (objeto.espacioX)==(playerPosition.x))
    gameOver(playerPosition.x,playerPosition.y+elementsSize);
  });
  if (mover) {  
    playerPosition.y += elementsSize;
    setCanvasSize();
  }
}
  //            x  y tomando como centro el 4 cuadrante
  // //                  anchos
  // game.fillRect(0,50,120,100);
  // game.clearRect(0,0,80,25);//lo mismo que el anterior solo que limpia en vez de crear

  // game.fillText('setso', 120,100);//añade texto al cambas y una ubicacion
  // game.fillStyle="red";
  // game.textAlign="start";//las propiedades dependen de donde ubicamos la ubicacion