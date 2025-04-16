import { terreno } from './caricamento_sfondo.js'; // Importa la matrice terreno

// Mappa delle immagini per i numeri della matrice
const immaginiTerreno = {
    1: "percorso_gioco/png/Tiles/18.png", //sfondo azzurro
    2: "percorso_gioco/png/Tiles/17.png", //acqua
    3: "", 
    4: "percorso_gioco/png/Tiles/2.png", //erba
    5: "percorso_gioco/png/Tiles/5.png", //terra
};

// Funzione per disegnare il terreno
function drawTerreno() {
    const tileSize = 25; // Dimensione di ogni cella della matrice in pixel
    const offsetX = myGameArea.backgroundX; // Usa lo scorrimento dello sfondo come offset

    for (let row = 0; row < terreno.length; row++) {
        for (let col = 0; col < terreno[row].length; col++) {
            const numero = terreno[row][col];
            const immagineSrc = immaginiTerreno[numero];
            if (immagineSrc) {
                const img = new Image();
                img.src = immagineSrc;

                // Disegna il blocco con l'offset orizzontale
                myGameArea.context.drawImage(
                    img,
                    col * tileSize + offsetX, // Applica l'offset orizzontale
                    row * tileSize,
                    tileSize,
                    tileSize
                );
            }
        }
    }
}

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
    backgroundX: 0, // Posizione orizzontale dello sfondo
    backgroundSpeed: 1, // Velocità dello sfondo

    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.interval = setInterval(updateGameArea, 8); // Impostato a 8ms per migliorare il controllo
        window.addEventListener('keydown', function (e) {
            myGameArea.keys[e.key] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.key] = false;
        });
    },

    clear: function () {
        // Cancella l'intera canvas senza disegnare lo sfondo
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    myGameArea.clear(); // Cancella la canvas
    drawTerreno(); // Disegna il terreno sopra la canvas

    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    // Controlla se il personaggio ha raggiunto la metà della canvas
    if (myGamePiece.x >= (myGameArea.canvas.width / 2)) {
        myGamePiece.x = myGameArea.canvas.width / 2;   // Blocca il personaggio a metà canvas

        if (myGameArea.keys["ArrowLeft"]) {
            myGamePiece.speedX = -1;
            myGamePiece.imageList = myGamePiece.imageListRunning;
            specchia_immagine = true;
            myGameArea.backgroundX += myGameArea.backgroundSpeed; // Scorri il terreno a destra
        } else if (myGameArea.keys["ArrowRight"]) {
            myGamePiece.imageList = myGamePiece.imageListRunning;
            specchia_immagine = false;
            myGameArea.backgroundX -= myGameArea.backgroundSpeed; // Scorri il terreno a sinistra
        }
    } else {
        // Se il personaggio non ha raggiunto metà canvas
        if (myGameArea.keys["ArrowLeft"]) {
            if (!(myGamePiece.x == 80 && specchia_immagine == true)) {
                myGamePiece.speedX = -1;
            }
            if ((myGamePiece.x <= 80 && specchia_immagine == true)) {
                myGamePiece.speedX = 0;
                myGameArea.backgroundX += myGameArea.backgroundSpeed; // Scorri il terreno a destra
            }
            myGamePiece.imageList = myGamePiece.imageListRunning;
            specchia_immagine = true;
        }
        if (myGameArea.keys["ArrowRight"]) {
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

    myGamePiece.update(); // Aggiorna la posizione del personaggio
    myGameArea.drawGameObject(myGamePiece); // Disegna il personaggio sopra il terreno
}

// Avvia il gioco quando il DOM ha finito di caricarsi
document.addEventListener("DOMContentLoaded", function () {
    startGame();
});