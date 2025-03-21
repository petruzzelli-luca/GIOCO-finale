function startGame() {
    myGamePiece.loadImages(runningImages);
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
            this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
            this.image = this.imageList[this.actualFrame];
        }
    },

    loadImages: function(running) {
        for (let imgPath of running) {
            var img = new Image();
            img.src = imgPath;
            this.imageList.push(img);
        }
        this.image = this.imageList[this.actualFrame];
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
            myGameArea.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function(e) {
            myGameArea.keys[e.keyCode] = false;
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

    if (myGameArea.keys[37]) { // left
        myGamePiece.speedX = -1;
    }
    if (myGameArea.keys[39]) { // right
        myGamePiece.speedX = 1;
    }
    

    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
}


startGame();