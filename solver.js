document.addEventListener('keydown', e => e.key === 'Enter' && solve());
document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `t${4 * i + j}`;
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('autocorrect', 'off');
            input.setAttribute('autocapitalize', 'none');
            document.getElementById('inputs').insertBefore(input, document.getElementById('solve'));
        }
    }
});

var wordSet;
async function solve() {
    const response = await fetch(`resources/wordlists/${document.getElementById('dict').value}.txt`);
    wordSet = new Set((await response.text()).split(/\r?\n/));
    
    const tiles = [...Array(20)].map((_, i) =>
        document.getElementById(`t${i}`).value.trim().toLowerCase()).filter(Boolean);
  
    const validWords = {1: [], 2: [], 3: [], 4: []};
    
    // Start generating words from the tiles
    tiles.forEach((tile, i) => {
        addTile(validWords, [tile], tiles.slice(0, i).concat(tiles.slice(i + 1)), 1);
    });
    
    var solutions = document.getElementById('solutions')
    solutions.innerHTML = '';
    Object.entries(validWords).forEach(([k, v]) => {
        const t = document.createElement('p');
        t.innerText = `${k}-Tile`;
        t.style.fontWeight = 'bold';
        
        const p = document.createElement('p');
        p.innerText = v.map(a => a.join('-')).join(', ');
        
        solutions.appendChild(t);
        solutions.appendChild(p);
    });
}

// Function to generate combinations of tiles and check for valid words
function addTile(valid, curr, left, count) {
    if (wordSet.has(curr.join('')))
        valid[count].push(curr);

    if (count === 4 || left.length === 0)
        return; // Limit to 4 tiles

    left.forEach((tile, i) =>
        addTile(valid, [...curr, tile], [...left.slice(0, i), ...left.slice(i + 1)], count + 1));
}
