document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const types = ['fire', 'water', 'steel', 'plant', 'poison', 'electro', 'dragon', 'ghost', 'fight', 'bug', 'fairy', 'normal', 'ground', 'fly'];

    types.forEach(type => {
        const div = document.createElement('div');
        div.classList.add('thumbnail', type);
        gallery.appendChild(div);
    });
});
