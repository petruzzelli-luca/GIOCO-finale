function startGame() {
    myGamePiece.loadImages(runningImages, idleImage, jumpImage, deadImage);
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
    imageListRunning: [],
    imageListIdle: [],
    imageListDead: [],
    imageListJump: [],
    contaFrame: 0,
    actualFrame: 0,
    image: null,

    update: function () {
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

    loadImages: function (running, idle) {
        for (let imgPath of running) {
            var img = new Image();
            img.src = imgPath;
            this.imageListRunning.push(img);
        }
        for (let imgPath of idle) {
            var img = new Image();
            img.src = imgPath;
            this.imageListIdle.push(img);
        }
        this.image = this.imageListRunning[this.actualFrame];
        this.imageList = this.imageListIdle;
    }
};

var myGameArea = {
    canvas: document.getElementById("myCanvas"), // Ottieni il canvas dal DOM
    context: null,
    interval: null,
    keys: [], // Array per tenere traccia dei tasti premuti
    background: null, // Proprietà per lo sfondo

    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.interval = setInterval(updateGameArea, 20); // Impostato a 20ms per migliorare il controllo
        window.addEventListener('keydown', function (e) {
            myGameArea.keys[e.key] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.key] = false;
        });
    },

    clear: function () {
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

    // Controlla se il personaggio ha raggiunto la metà della canvas
    if (myGamePiece.x >= myGameArea.canvas.width / 2) {
        // Se è passato metà canvas, può solo andare indietro
        if (myGameArea.keys["ArrowLeft"]) {
            myGamePiece.speedX = -1;
            myGamePiece.imageList = myGamePiece.imageListRunning; // Cambia l'animazione a "running" verso sinistra
        }
    } else {
        // Se il personaggio non ha raggiunto metà canvas, può andare a destra o a sinistra
        if (myGameArea.keys["ArrowLeft"]) { // Movimento verso sinistra
            myGamePiece.speedX = -1;
            myGamePiece.imageList = myGamePiece.imageListRunning; // Cambia l'animazione a "running" verso sinistra
        } else if (myGameArea.keys["ArrowRight"]) { // Movimento verso destra
            myGamePiece.speedX = 1;
            myGamePiece.imageList = myGamePiece.imageListRunning; // Cambia l'animazione a "running" verso destra
        }
    }

    // Se nessun tasto è premuto, metti il personaggio in modalità idle
    if (!myGameArea.keys["ArrowLeft"] && !myGameArea.keys["ArrowRight"]) {
        myGamePiece.speedX = 0; // Ferma il movimento
        myGamePiece.imageList = myGamePiece.imageListIdle; // Cambia l'animazione a "idle"
    }

    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
}



