// Funzione per avviare il gioco
function startGame() {
    myGamePiece.loadImages(runningImages, idleImage, jumpImage, deadImage);
    myGameArea.start();
}

var specchia_immagine = false; 

var myGamePiece = {
    speedX: 0,
    speedY: 0,
    width: 60,
    height: 60,
    x: 10,
    y: 174,
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
    canvas: document.getElementById("myCanvas"),
    context: null,
    interval: null,
    keys: [], // Array per tenere traccia dei tasti premuti
    background: null, // Proprietà per lo sfondo
    backgroundX: 0, // Posizione orizzontale dello sfondo
    backgroundSpeed: 1, // Velocità dello sfondo

    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        // Carica l'immagine di sfondo
        this.background = new Image();
        this.background.src = "sfondo_gioco (1).jpg"; // Sostituisci con il percorso della tua immagine

        this.interval = setInterval(updateGameArea, 8); // Impostato a 8ms per migliorare il controllo
        window.addEventListener('keydown', function (e) {
            myGameArea.keys[e.key] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.key] = false;
        });
    },

    clear: function () {
        // Disegna lo sfondo con scorrimento
        if (this.background) {
            this.context.drawImage(this.background, this.backgroundX, 0, this.canvas.width, this.canvas.height);
            this.context.drawImage(this.background, this.backgroundX + this.canvas.width, 0, this.canvas.width, this.canvas.height);

            // Ripristina la posizione dello sfondo per creare un loop continuo
            if (this.backgroundX <= -this.canvas.width) {
                this.backgroundX = 0;
            }
        } else {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },

    updateBackground: function () {
        // Sposta lo sfondo solo se il personaggio ha raggiunto la metà della canvas
        if (myGamePiece.x >= (this.canvas.width / 2) && myGamePiece.imageList == myGamePiece.imageListRunning) {
            this.backgroundX -= this.backgroundSpeed;
        }
        if(myGamePiece.x <=80 && myGamePiece.imageList == myGamePiece.imageListRunning && specchia_immagine==true && this.backgroundX < 0){
            this.backgroundX += this.backgroundSpeed;
        }
    },

    drawGameObject: function (gameObject) {
        if (specchia_immagine) {
            this.context.save();
            this.context.scale(-1, 1);
            this.context.drawImage(
                gameObject.image,
                -gameObject.x - gameObject.width,
                gameObject.y,
                gameObject.width,
                gameObject.height
            );
            this.context.restore();
        } else {
            this.context.drawImage(
                gameObject.image,
                gameObject.x,
                gameObject.y,
                gameObject.width,
                gameObject.height
            );
        }
    }
};

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    // Controlla se il personaggio ha raggiunto la metà della canvas
    if (myGamePiece.x >= (myGameArea.canvas.width / 2)) {
        // Se è passato metà canvas, può solo andare indietro, ma la sua animazione continua
        if (myGameArea.keys["ArrowLeft"]) {
            myGamePiece.speedX = -1;
            myGamePiece.imageList = myGamePiece.imageListRunning;
            specchia_immagine = true;
        }
    } else {
        // Se il personaggio non ha raggiunto metà canvas, può andare a destra o a sinistra
        if (myGameArea.keys["ArrowLeft"]) {
            // Impedisce al personaggio di andare indietro se x == 100 e specchia_immagine == true
            if (!(myGamePiece.x == 80 && specchia_immagine==true)) {
                myGamePiece.speedX = -1;
            }
            myGamePiece.imageList = myGamePiece.imageListRunning;
            specchia_immagine = true;
        } else if (myGameArea.keys["ArrowRight"]) {
            myGamePiece.speedX = 1;
            myGamePiece.imageList = myGamePiece.imageListRunning;
            specchia_immagine = false;
        }
    }




    // Se nessun tasto è premuto, metti il personaggio in modalità idle
    if (!myGameArea.keys["ArrowLeft"] && !myGameArea.keys["ArrowRight"]) {
        myGamePiece.speedX = 0;
        myGamePiece.imageList = myGamePiece.imageListIdle;
    }

    // Aggiorna lo sfondo
    myGameArea.updateBackground();

    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
}

// Avvia il gioco quando il DOM ha finito di caricarsi
document.addEventListener("DOMContentLoaded", function () {
    startGame();
});