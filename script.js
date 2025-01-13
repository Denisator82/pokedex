// document.addEventListener('DOMContentLoaded', () => {
//     const gallery = document.getElementById('gallery');
//     const types = ['fire', 'water', 'steel', 'plant', 'poison', 'electro', 'dragon', 'ghost', 'fight', 'bug', 'fairy', 'normal', 'ground', 'fly'];

//     types.forEach(type => {
//         const div = document.createElement('div');
//         div.classList.add('thumbnail', type);
//         gallery.appendChild(div);
//     });
// });


// URL für die Pokémon-API
const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=40&offset=0";

// HTML-Elemente
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const idPicture = document.getElementById("idPicture");
const close = document.getElementById("close");

// Liste der Pokémon
let pokemonList = [];
let currentPokemonIndex = 0; // Index des aktuell angezeigten Pokémon

// Typenfarben
const typeColors = {
    fire: "#FF7043",
    water: "#42A5F5",
    steel: "#B0BEC5",
    grass: "#66BB6A",
    poison: "#AB47BC",
    electric: "#FFEB3B",
    dragon: "#7E57C2",
    ghost: "#757575",
    fighting: "#EF5350",
    bug: "#8BC34A",
    fairy: "#F48FB1",
    normal: "#A1887F",
    ground: "#D4A190",
    flying: "#81D4FA"
};

// Funktion, um Pokémon-Liste von der API zu laden
async function fetchPokemons() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP-Error: ${response.status}`);
        const data = await response.json();
        pokemonList = data.results;
        displayGallery(pokemonList);
    } catch (error) {
        console.error("Fehler beim Abrufen der Pokémon-Liste:", error);
    }
}

// Funktion, um die Galerie mit Pokémon-Bildern und Typen zu füllen
async function displayGallery(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        const pokemon = pokemonList[i];
        const response = await fetch(pokemon.url);
        const details = await response.json();

        // Pokémon-Element erstellen
        const div = document.createElement("div");
        div.classList.add("thumbnail");

        // Typ des Pokémon bestimmen
        const primaryType = details.types[0].type.name;
        const backgroundColor = typeColors[primaryType] || "#D3D3D3"; // Standardfarbe für unbekannte Typen
        div.style.backgroundColor = backgroundColor;

        // Bild hinzufügen
        const thumbnail = document.createElement("img");
        thumbnail.src = details.sprites.front_default;
        thumbnail.alt = details.name;

        // Namen hinzufügen
        const name = document.createElement("p");
        name.textContent = details.name;

        // Aufbau des Pokémon-Elements
        div.appendChild(thumbnail);
        div.appendChild(name);

        // Klicken, um Lightbox zu öffnen
        div.setAttribute("onclick", `showLightbox(${i})`);
        gallery.appendChild(div);
    }
}

// Funktion, um das angeklickte Pokémon in der Lightbox anzuzeigen
function showLightbox(index) {
    currentPokemonIndex = index; // Speichern des aktuellen Index
    const pokemon = pokemonList[index];
    fetch(pokemon.url)
        .then((response) => response.json())
        .then((details) => {
            idPicture.src = details.sprites.other["official-artwork"].front_default || details.sprites.front_default;
            idPicture.alt = pokemon.name;
            lightbox.classList.remove("hidden");
        });
}

// Funktion, um die Navigation in der Lightbox zu ermöglichen
function navigatePokemon(direction) {
    currentPokemonIndex += direction;

    // Sicherstellen, dass der Index im gültigen Bereich bleibt
    if (currentPokemonIndex < 0) {
        currentPokemonIndex = pokemonList.length - 1; // Zum letzten Pokémon springen
    } else if (currentPokemonIndex >= pokemonList.length) {
        currentPokemonIndex = 0; // Zum ersten Pokémon springen
    }

    // Lightbox mit neuem Pokémon aktualisieren
    showLightbox(currentPokemonIndex);
}

// Funktion, um die Lightbox zu schließen
function closeLightbox() {
    lightbox.classList.add("hidden");
}

// Initial Pokémon laden
document.addEventListener("DOMContentLoaded", () => {
    fetchPokemons();
});

