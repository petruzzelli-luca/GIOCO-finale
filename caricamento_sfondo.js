// Creazione della matrice del terreno
const terreno = [
    // ...esempio di matrice con un percorso per Super Mario...
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 3, 3, 1, 4, 1],
    [1, 2, 1, 2, 1, 3, 3, 1, 4, 1],
    [1, 2, 1, 2, 1, 1, 1, 1, 4, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 4, 1],
    [1, 1, 1, 1, 1, 1, 1, 2, 4, 1],
    [1, 4, 4, 4, 4, 4, 1, 2, 4, 1],
    [1, 4, 5, 5, 5, 4, 1, 2, 4, 1],
    [1, 4, 5, 1, 5, 4, 1, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Funzione per visualizzare la matrice (opzionale)
function stampaTerreno() {
    console.log(terreno.map(riga => riga.join(' ')).join('\n'));
}

// Esegui la stampa per verificare
stampaTerreno();
