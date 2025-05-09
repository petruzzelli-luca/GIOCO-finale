import { terreno, showGameOverPopup } from './caricamento_sfondo.js'; // Importa la matrice terreno

// Mappa delle immagini per i numeri della matrice
const immaginiTerreno = {
    1: "percorso_gioco/png/Tiles/18.png", //sfondo azzurro
    2: "percorso_gioco/png/Tiles/17.png", //acqua
    3: "percorso_gioco/png/Object/Stone.png", //pietra
    4: "percorso_gioco/png/Tiles/2.png", //erba
    5: "percorso_gioco/png/Tiles/5.png", //terra
    6: "percorso_gioco/png/Tiles/13.png", //prima parte dell'isola
    7: "percorso_gioco/png/Tiles/14.png", //parte centrale dell'isola
    8: "percorso_gioco/png/Tiles/15.png", //parte finale dell'isola
    9: "moneta1.png", //moneta
};

// Funzione per disegnare il terreno
function drawTerreno() {
    const tileSize = 25; // Dimensione di ogni cella della matrice in pixel
    const offsetX = myGameArea.backgroundX; // Usa lo scorrimento dello sfondo come offset
    const canvasWidth = myGameArea.canvas.width; // Larghezza della canvas
    const canvasHeight = myGameArea.canvas.height; // Altezza della canvas

    for (let row = 0; row < terreno.length; row++) {
        for (let col = 0; col < terreno[row].length; col++) {
            const numero = terreno[row][col];
            const immagineSrc = immaginiTerreno[numero];

            if (immagineSrc) {
                const x = col * tileSize + offsetX;
                const y = row * tileSize;

                // Disegna solo se il blocco è visibile nella canvas
                if (x + tileSize > 0 && x < canvasWidth && y + tileSize > 0 && y < canvasHeight) {
                    const img = new Image();
                    img.src = immagineSrc;
                    myGameArea.context.drawImage(img, x, y, tileSize, tileSize);
                }
            }
        }
    }
}

// avvio il gioco
function startGame() {
    myGamePiece.loadImages(runningImages, idleImage, deadImage);
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
    gravity: 0.3, // Forza di gravità
    gravitySpeed: 0, // Velocità verticale influenzata dalla gravità
    jumpStrength: -8, // Forza del salto
    isJumping: false, // Stato del salto
    imageList: [],
    imageListRunning: [],
    imageListIdle: [],
    imageListDead: [],
    contaFrame: 0,
    actualFrame: 0,
    image: null,

    update: function () {
        // Aggiorna la posizione orizzontale
        if (this.x + this.speedX > 0 && this.x + this.speedX < myGameArea.canvas.width - this.width) {
            this.x += this.speedX;
        }

        // Applica la gravità
        this.gravitySpeed += this.gravity;
        this.y += this.speedY + this.gravitySpeed;



        this.contaFrame++;
        if (this.contaFrame == 5) {
            this.contaFrame = 0;
            this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
            this.image = this.imageList[this.actualFrame];
        }
    },

    jump: function () {
        if (!this.isJumping) { // Permetti il salto solo se non è già in salto
            this.gravitySpeed = this.jumpStrength; // Applica la forza del salto
            this.isJumping = true;
        }
    },

    loadImages: function (running, idle, dead) {
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
        for (let imgPath of dead) {
            const img = new Image();
            img.src = imgPath;
            this.imageListDead.push(img);
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

        this.interval = setInterval(updateGameArea, 10); // Impostato a 10ms per migliorare il controllo
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


var minBackgroundX = 0; // Limite massimo verso sinistra del terreno
var maxBackgroundX = -(terreno[0].length * 25 - 2 * (myGameArea.canvas.width)); // Limite massimo verso destra del terreno


function collisioni() {
    const tileSize = 25; // Dimensione di ogni cella della matrice in pixel
    const offsetX = myGameArea.backgroundX; // Tiene conto dello scorrimento orizzontale dello sfondo
    // Calcola la posizione del personaggio nella matrice
    const col = Math.floor((myGamePiece.x - offsetX + myGamePiece.width / 2) / tileSize);
    const row = Math.floor((myGamePiece.y + myGamePiece.height) / tileSize);

    // Verifica se il personaggio è sopra una cella della matrice
    if (row >= 0 && row < terreno.length && col >= 0 && col < terreno[row].length) {
        const tile = terreno[row][col]; // Ottieni il valore della matrice

        // Controllo collisione verticale 
        if (tile === 6 || tile === 7 || tile === 8 || tile === 4 ) {
            const islandTop = row * tileSize + 10;
            if (myGamePiece.y + myGamePiece.height > islandTop) {
                myGamePiece.y = islandTop - myGamePiece.height; // Posiziona il personaggio sopra
                myGamePiece.gravitySpeed = 0; // Ferma la caduta
                myGamePiece.isJumping = false; // Il personaggio non è più in salto
            }
        } else if (tile === 3) { // Se il personaggio è sopra una roccia
            myGamePiece.imageList = myGamePiece.imageListDead; // Cambia l'animazione in quella di morte
        }

        // Controllo collisione frontale con blocco numero 4
        const frontCol = myGamePiece.speedX > 0
            ? Math.floor((myGamePiece.x + myGamePiece.width - offsetX) / tileSize) // Colonna davanti (destra)
            : Math.floor((myGamePiece.x - offsetX) / tileSize); // Colonna davanti (sinistra)

        if (frontCol >= 0 && frontCol < terreno[row].length) {
            const frontTile = terreno[row][frontCol];
            if (frontTile === 4) { // Se il blocco davanti è numero 4
                myGamePiece.speedX = 0; // Ferma il movimento orizzontale
            }
        }
    }
}

function updateGameArea() {
    myGameArea.clear(); // Cancella la canvas
    drawTerreno(); // Disegna il terreno sopra la canvas

    myGamePiece.speedX = 0;

    // Controlla se il personaggio deve saltare
    if (myGameArea.keys["ArrowUp"]) {
        myGamePiece.jump();
    }

    // Controlla il movimento orizzontale
    if (myGamePiece.x >= (myGameArea.canvas.width / 2)) {
        myGamePiece.x = myGameArea.canvas.width / 2; // Blocca il personaggio a metà canvas

        if (myGameArea.keys["ArrowLeft"]) {
            if (myGameArea.backgroundX < minBackgroundX) {
                myGamePiece.speedX = -1;
                myGamePiece.imageList = myGamePiece.imageListRunning;
                specchia_immagine = true;
                myGameArea.backgroundX += myGameArea.backgroundSpeed;
            }
        } else if (myGameArea.keys["ArrowRight"]) {
            if (myGameArea.backgroundX > maxBackgroundX) {
                myGamePiece.imageList = myGamePiece.imageListRunning;
                specchia_immagine = false;
                myGameArea.backgroundX -= myGameArea.backgroundSpeed;
            }
        }
    } else {
        if (myGameArea.keys["ArrowLeft"]) {
            if (myGamePiece.x > 0 || myGameArea.backgroundX < minBackgroundX) {
                if (!(myGamePiece.x == 80 && specchia_immagine == true)) {
                    myGamePiece.speedX = -1;
                }
                if ((myGamePiece.x <= 80 && specchia_immagine == true)) {
                    myGamePiece.speedX = 0;
                    if (myGameArea.backgroundX < minBackgroundX) {
                        myGameArea.backgroundX += myGameArea.backgroundSpeed;
                    }
                }
                myGamePiece.imageList = myGamePiece.imageListRunning;
                specchia_immagine = true;
            }
        }
        if (myGameArea.keys["ArrowRight"]) {
            if (myGameArea.backgroundX > maxBackgroundX) {
                myGamePiece.speedX = 1;
                myGamePiece.imageList = myGamePiece.imageListRunning;
                specchia_immagine = false;
            }
        }
    }

    // Se nessun tasto è premuto, metti il personaggio in modalità idle
    if (!myGameArea.keys["ArrowLeft"] && !myGameArea.keys["ArrowRight"]) {
        myGamePiece.speedX = 0;
        myGamePiece.imageList = myGamePiece.imageListIdle;
    }

    // Controlla se il personaggio è uscito dalla canvas
    if (myGamePiece.y > myGameArea.canvas.height) {
        clearInterval(myGameArea.interval); // Ferma il gioco
        showGameOverPopup(); // Mostra il popup di Game Over
    }





    myGamePiece.update(); // Aggiorna la posizione del personaggio
    collisioni(); // Controlla la collisione con le isole
    myGameArea.drawGameObject(myGamePiece); // Disegna il personaggio sopra il terreno
}
// Avvia il gioco quando il DOM ha finito di caricarsi
document.addEventListener("DOMContentLoaded", function () {
    startGame();
});
