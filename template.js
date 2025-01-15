const templates = {
    pokemonThumbnail: (id, name, types, image, bgColor) => `
        <div class="thumbnail" style="background-color: ${bgColor}" onclick="showLightbox(${id})">
            <p class="pokemon-id">ID: ${id}</p>
            <h3>${name}</h3>
            <img src="${image}" alt="${name}">
            <p class="pokemon-types">Type(s): ${types}</p>
        </div>
    `,
    lightboxContent: (id, name, types, stats, image, bgColor) => `
            
        <div id="pokemon-card" class="card" style="background-color: ${bgColor}">
            <span id="close" onclick="closeLightbox()">X</span>
            <img id="idPicture" src="${image}" alt="${name}">
            <div id="pokemon-info">
                <h2 id="pokemon-name">${name}</h2>
                <p><strong>ID:</strong> ${id}</p>
                <p><strong>Types:</strong> ${types}</p>
                <p><strong>HP:</strong> ${stats.hp}</p>
                <p><strong>Attack:</strong> ${stats.attack}</p>
                <p><strong>Defense:</strong> ${stats.defense}</p>
            </div>
        </div>
    `
};


