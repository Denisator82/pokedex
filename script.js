// URL für die Pokémon-API
const baseApiUrl = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0;
const limit = 20;

const pokemonGallery = document.getElementById("pokemonGallery");
const lightbox = document.getElementById("lightbox");
const loadMoreButton = document.getElementById("loadMore");
const loadingScreen = document.getElementById("loadingScreen");
const notFoundMessage = document.querySelector("#not-found-message");

let pokemonList = [];

// Verzögerung mit Lade-Gif
const delay = async (ms) => {
    loadingScreen.style.display = "flex";
    await new Promise((resolve) => setTimeout(resolve, ms));
    loadingScreen.style.display = "none";
};

// API-Aufruf für Pokémon-Daten
const fetchPokemons = async (offset, limit) => {
    const response = await fetch(`${baseApiUrl}?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return data.results;
};

// Pokémon-Details abrufen
const fetchPokemonDetails = async (pokemon) => {
    const response = await fetch(pokemon.url);
    if (!response.ok) throw new Error(`Fehler bei ${pokemon.name}`);
    return await response.json();
};

// Farben für Pokémon-Typen definieren
const typeColors = {
    grass: "#78C850",
    fire: "#F08030",
    water: "#6890F0",
    bug: "#A8B820",
    normal: "#A8A878",
    poison: "#A040A0",
    electric: "#F8D030",
    ground: "#E0C068",
    fairy: "#EE99AC",
    fighting: "#C03028",
    psychic: "#F85888",
    rock: "#B8A038",
    ghost: "#705898",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    flying: "#A890F0"
};

// Pokémon anzeigen
const displayGallery = async (newPokemonList) => {
    const detailsList = await Promise.all(newPokemonList.map(fetchPokemonDetails));

    detailsList.forEach((details) => {
        const types = details.types.map((t) => t.type.name).join(", ");
        const bgColor = typeColors[details.types[0]?.type.name] || "#D3D3D3";
        const thumbnailHTML = templates.pokemonThumbnail(
            details.id,
            details.name,
            types,
            details.sprites.front_default,
            bgColor
        );
        pokemonGallery.insertAdjacentHTML("beforeend", thumbnailHTML);
        pokemonList.push(details);
    });
};

// Lightbox anzeigen
const showLightbox = (index) => {
    const pokemon = pokemonList[index-1];
    const types = pokemon.types.map((t) => t.type.name).join(", ");
    const bgColor = typeColors[pokemon.types[0]?.type.name] || "#D3D3D3";
    const stats = {
        hp: pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || "N/A",
        attack: pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || "N/A",
        defense: pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat || "N/A"
    };
    const lightboxHTML = templates.lightboxContent(
        pokemon.id,
        pokemon.name,
        types,
        stats,
        pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default,
        bgColor
    );
    lightbox.innerHTML = lightboxHTML;
    lightbox.classList.remove("hidden");
};

// Pokémon laden mit Delay
const loadMorePokemon = async () => {
    loadMoreButton.disabled = true;  // Deaktiviere den Button während des Ladevorgangs
    await delay(3000);

    const newPokemonList = await fetchPokemons(currentOffset, limit);
    await displayGallery(newPokemonList);

    currentOffset += limit;
    loadMoreButton.disabled = false;  // Aktiviere den Button nach dem Laden
};

// Lightbox schließen
const closeLightbox = () => {
    lightbox.classList.add("hidden");
};

// Event Listener für "Mehr laden"
loadMoreButton.addEventListener("click", loadMorePokemon);

// Initiales Laden
document.addEventListener("DOMContentLoaded", async () => {
    await loadMorePokemon();
});

// Suche im Suchfeld
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim().toLowerCase();

    // Deaktiviere den "Lade mehr"-Button während der Suche
    loadMoreButton.disabled = true;

    if (query.length >= 3) {
        const filteredPokemons = pokemonList.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(query)
        );
        updateGallery(filteredPokemons);
    } else if (query.length === 0) {
        // Zeige alle Pokémon, wenn das Suchfeld leer ist
        updateGallery(pokemonList);
    }
});

// Galerie mit neuen Pokémon aktualisieren
const updateGallery = (filteredList) => {
    pokemonGallery.innerHTML = ""; // Alte Einträge entfernen
    filteredList.forEach((pokemon) => {
        const types = pokemon.types.map((t) => t.type.name).join(", ");
        const bgColor = typeColors[pokemon.types[0]?.type.name] || "#D3D3D3";
        const thumbnailHTML = templates.pokemonThumbnail(
            pokemon.id,
            pokemon.name,
            types,
            pokemon.sprites.front_default,
            bgColor
        );
        pokemonGallery.insertAdjacentHTML("beforeend", thumbnailHTML);
    });

    // Wenn das Suchfeld leer ist, reaktiviere den "Lade mehr"-Button
    if (filteredList.length === 0) {
        loadMoreButton.disabled = false;
    }
};

// let currentCardIndex = -1; // Startindex für die Karte (wird erst gesetzt, wenn eine Karte geöffnet wird)

// // Funktion für "Zurück"-Button
// function prevCard() {
//     if (currentCardIndex > 0) {
//         currentCardIndex--; // Einen Schritt zurück
//         updateLightboxContent(currentCardIndex); // Inhalte aktualisieren
//     }
// }

// // Funktion für "Weiter"-Button
// function nextCard() {
//     if (currentCardIndex < pokemonList.length - 1) {
//         currentCardIndex++; // Einen Schritt vor
//         updateLightboxContent(currentCardIndex); // Inhalte aktualisieren
//     }
// }

// // Aktualisiert die Inhalte der Lightbox basierend auf dem aktuellen Index
// function updateLightboxContent(index) {
//     if (index < 0 || index >= pokemonList.length) return; // Überprüfe, ob der Index gültig ist

//     const pokemon = pokemonList[index]; // Hole das Pokémon basierend auf dem Index
//     const types = pokemon.types.map((t) => t.type.name).join(", ");
//     const bgColor = typeColors[pokemon.types[0]?.type.name] || "#D3D3D3";
//     const stats = {
//         hp: pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || "N/A",
//         attack: pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || "N/A",
//         defense: pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat || "N/A"
//     };

//     // Ersetze den Inhalt der Lightbox mit aktualisierten Daten
//     lightbox.innerHTML = templates.lightboxContent(
//         pokemon.id,
//         pokemon.name,
//         types,
//         stats,
//         pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default,
//         bgColor
//     );

//     // Sicherstellen, dass die Buttons die neuen Funktionen verwenden
//     document.querySelector(".prev").onclick = prevCard;
//     document.querySelector(".next").onclick = nextCard;
// }

// // Lightbox schließen
// function closeLightbox() {
//     lightbox.classList.add("hidden");
//     // currentCardIndex bleibt unverändert, damit beim Öffnen einer neuen Karte der Index korrekt bleibt
// }

// // Wenn eine Karte angeklickt wird, öffne die Lightbox und setze den aktuellen Index
// function openCard(index) {
//     currentCardIndex = index; // Setze den aktuellen Index auf die angeklickte Karte
//     updateLightboxContent(currentCardIndex); // Zeige die entsprechende Karte in der Lightbox an
//     lightbox.classList.remove("hidden"); // Zeige die Lightbox an
// }

// // Beispiel: Event Listener für das Klicken auf eine Karte
// document.querySelectorAll('.thumbnail').forEach((card, index) => {
//     card.addEventListener('click', () => openCard(index));
// });
