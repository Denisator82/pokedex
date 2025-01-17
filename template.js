const templates = {
    pokemonThumbnail: (id, name, types, image, bgColor) => `
        <div class="thumbnail" style="background-color: ${bgColor}" onclick="showLightbox(${id})">
            <p class="pokemon-id">ID: ${id}</p>
            <h3>${name.toUpperCase()}</h3>
            <img src="${image}" alt="${name}">
            <p class="pokemon-types">Type(s): ${types}</p>
        </div>
    `,
    lightboxContent: (id, name, types, stats, image, bgColor) => `
            
        <div id="pokemonCard" class="card-total" style="background-color: ${bgColor}">
            <img src="./assets/cross.png" id="close" onclick="closeLightbox()">
            <div class="card">
                <img class="pokemon-big-picture" id="idPicture" src="${image}" alt="${name}">
                <div class="pokemon-info-chart" id="pokemonInfo">
                    <h2 id="pokemonName">${name.toUpperCase()}</h2>
                    <p><strong>ID:</strong> ${id}</p>
                    <p><strong>Types:</strong> ${types}</p></br>
                    <p><strong>HP:</strong> ${stats.hp}</p>
                    <p><strong>Attack:</strong> ${stats.attack}</p>
                    <p><strong>Defense:</strong> ${stats.defense}</p> 
                </div>
                <div class="skip">
                    <button class="card-nav prev" onclick="prevCard()">
                    <img src="./assets/chevron_left.png" alt="Zurück" />
                    </button>
                    <button class="card-nav next" onclick="nextCard()">
                    <img src="./assets/chevron_right.png" alt="Weiter" />
                    </button>
                </div>
            </div>
        </div>
    `
};