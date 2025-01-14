// URL für die Pokémon-API
const baseApiUrl = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0; // Offset für die nächste Pokémon-Ladung
const limit = 20; // Anzahl der Pokémon pro Ladezyklus

// HTML-Elemente
const pokemonGallery = document.getElementById("pokemon-gallery");
const lightbox = document.getElementById("lightbox");
const idPicture = document.getElementById("idPicture");
const loadMoreButton = document.getElementById("loadMore");
const loadingIndicator = document.getElementById("loading");

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

// Pokémon-Liste
let pokemonList = [];
let currentPokemonIndex = 0;

// Pokémon-Liste laden
async function fetchPokemons(offset, limit) {
    try {
        const apiUrl = `${baseApiUrl}?limit=${limit}&offset=${offset}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP-Error: ${response.status}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Fehler beim Abrufen der Pokémon-Liste:", error);
        return [];
    }
}

// Galerie füllen
async function displayGallery(newPokemonList) {
    for (const pokemon of newPokemonList) {
        try {
            const response = await fetch(pokemon.url);
            if (!response.ok) throw new Error(`HTTP-Error: ${response.status}`);
            const details = await response.json();

            // Pokémon-Element erstellen
            const div = document.createElement("div");
            div.classList.add("thumbnail");

            // Typ und Hintergrundfarbe
            const primaryType = details.types[0]?.type.name || "unknown";
            const secondaryType = details.types[1]?.type.name || null;
            const backgroundColor = typeColors[primaryType] || "#D3D3D3";
            div.style.backgroundColor = backgroundColor;

            // ID und weitere Infos
            const pokemonId = document.createElement("p");
            pokemonId.textContent = `ID: ${details.id}`;
            pokemonId.classList.add("pokemon-id");

            const name = document.createElement("h3");
            name.textContent = details.name;

            const types = document.createElement("p");
            types.textContent = `Type(s): ${primaryType}${secondaryType ? `, ${secondaryType}` : ""}`;
            types.classList.add("pokemon-types");

            const thumbnail = document.createElement("img");
            thumbnail.src = details.sprites.front_default || "placeholder.png";
            thumbnail.alt = details.name;

            div.appendChild(pokemonId);
            div.appendChild(name);
            div.appendChild(types);
            div.appendChild(thumbnail);

            div.setAttribute("onclick", `showLightbox(${pokemonList.length})`);
            pokemonGallery.appendChild(div);

            // Pokémon zur Liste hinzufügen
            pokemonList.push(details);
        } catch (error) {
            console.error(`Fehler beim Abrufen von ${pokemon.name}:`, error);
        }
    }
}

// Button zum Laden weiterer Pokémon
async function loadMorePokemon() {
    loadMoreButton.disabled = true;
    loadingIndicator.classList.remove("hidden");

    const newPokemonList = await fetchPokemons(currentOffset, limit);
    await displayGallery(newPokemonList);

    currentOffset += limit;

    loadMoreButton.disabled = false;
    loadingIndicator.classList.add("hidden");
}

// Event Listener für den "Mehr laden"-Button
loadMoreButton.addEventListener("click", loadMorePokemon);

// Ladeverzögerung
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Lightbox-Funktionalität
function showLightbox(index) {
    currentPokemonIndex = index;
    const pokemon = pokemonList[index];

    // Setzt das Bild des Pokémon
    idPicture.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
    idPicture.alt = pokemon.name;

    // Setzt den Pokémon-Namen und ID
    document.getElementById("pokemon-name").textContent = pokemon.name;
    document.getElementById("pokemon-id").textContent = `ID: ${pokemon.id}`;

    // Setzt die Pokémon-Typen
    const types = pokemon.types.map(type => type.type.name).join(", ");
    document.getElementById("pokemon-types").textContent = `Type(s): ${types}`;

    // Setzt die Pokémon-Werte (HP, Angriff, Verteidigung)
    document.getElementById("pokemon-hp").textContent = `HP: ${pokemon.stats.find(stat => stat.stat.name === "hp")?.base_stat || "N/A"}`;
    document.getElementById("pokemon-attack").textContent = `Attack: ${pokemon.stats.find(stat => stat.stat.name === "attack")?.base_stat || "N/A"}`;
    document.getElementById("pokemon-defense").textContent = `Defense: ${pokemon.stats.find(stat => stat.stat.name === "defense")?.base_stat || "N/A"}`;

    // Dynamische Hintergrundfarbe der Karte basierend auf dem ersten Pokémon-Typ
    const primaryType = pokemon.types[0]?.type.name || "unknown";
    const backgroundColor = typeColors[primaryType] || "#D3D3D3"; // Standardfarbe für unbekannte Typen
    document.getElementById("pokemon-card").style.backgroundColor = backgroundColor;

    // Setzt das transparente Overlay
    lightbox.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Transparentes Overlay

    // Zeigt die Lightbox an
    lightbox.classList.remove("hidden");
}



// Navigiere zwischen den Pokémon
function navigatePokemon(direction) {
    currentPokemonIndex = (currentPokemonIndex + direction + pokemonList.length) % pokemonList.length;
    showLightbox(currentPokemonIndex);
}

// Schließe die Lightbox
function closeLightbox() {
    lightbox.classList.add("hidden");
}

// Erste Pokémon laden
document.addEventListener("DOMContentLoaded", async () => {
    const initialPokemonList = await fetchPokemons(currentOffset, limit);
    await displayGallery(initialPokemonList);
    currentOffset += limit;
});
