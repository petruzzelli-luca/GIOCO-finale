function startGame() {
    myGamePiece.loadImages(runningImages, idleImage);
    myGameArea.start();
}



var myGamePiece = {
    speedX: 0,
    speedY: 0,
    width: 60,
    height: 60,
    x: 10,
    y: 120,
    imageList: [],
    imageListRunning:[],
    imageListIdle:[],
    contaFrame: 0,
    actualFrame: 0,
    image: null,

    update: function() {
        // Controlla i bordi della canvas prima di aggiornare la posizione
        if (this.x + this.speedX > 0 && this.x + this.speedX < myGameArea.canvas.width - this.width) {
            this.x += this.speedX;
        }
        if (this.y + this.speedY > 0 && this.y + this.speedY < myGameArea.canvas.height - this.height) {
            this.y += this.speedY;
        }

        this.contaFrame++;
        if (this.contaFrame == 5) {
            this.contaFrame = 0;
            this.actualFrame = (this.actualFrame + 100) % this.imageList.length;
            this.image = this.imageList[this.actualFrame];
        }
    },

    loadImages: function(running,idle) {
        for (let imgPath of running) {
            var img = new Image();
            img.src = imgPath;
            this.imageListRunning.push(img);
        }
        i =0;
        for (let imgPath of idle) {
            console.log(i++);
            var img = new Image();
            img.src = imgPath;
            this.imageListIdle.push(img);
        }
        this.image = this.imageListRunning[this.actualFrame];
        console.log (this.imageListRunning);
        this.imageList  = this.imageListIdle;
    }
};

var myGameArea = {
    canvas: document.createElement("canvas"),
    context: null,
    interval: null,
    keys: [], // Array per tenere traccia dei tasti premuti

    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1);
        window.addEventListener('keydown', function(e) {
            myGameArea.keys[e.key] = true;
        });
        window.addEventListener('keyup', function(e) {
            myGameArea.keys[e.key] = false;
        });
    },

    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    drawGameObject: function (gameObject) {
        this.context.drawImage(
            gameObject.image,
            gameObject.x,
            gameObject.y,
            gameObject.width,
            gameObject.height
        );
    }
};

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    myGamePiece.imageList = myGamePiece.imageListRunning;

    /*switch (event.key) {
        case "ArrowDown":
          // Do something for "down arrow" key press.
          break;
        case "ArrowUp":
          // Do something for "up arrow" key press.
          break;
        case "ArrowLeft":
          // Do something for "left arrow" key press.
          break;
        case "ArrowRight":
          // Do something for "right arrow" key press.
          break;
        case "Enter":
          // Do something for "enter" or "return" key press.
          break;
        case " ":
          // Do something for "space" key press.
          break;
        case "Escape":
          // Do something for "esc" key press.
          break;
        default:
          return; // Quit when this doesn't handle the key event.
      }*/

    if (myGameArea.keys["ArrowLeft"]) { // left
        myGamePiece.speedX = -1;
    }
    else if (myGameArea.keys["ArrowRight"]) { // right
        myGamePiece.speedX = 1;
    }
    else
    {
        myGamePiece.imageList = myGamePiece.imageListIdle;
    }
    

    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
}


