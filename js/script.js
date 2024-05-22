let currentGrid = [];
let currentWords = [];

function generateWordSearch() {
    const input = document.getElementById('wordsInput').value;
    const words = input.split(',').map(word => word.trim().toUpperCase());
    currentWords = words;
    const gridSize = 15;
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));

    words.forEach(word => {
        placeWordInGrid(grid, word);
    });

    fillEmptySpaces(grid);
    currentGrid = grid;
    displayGrid(grid);
    displayWordList(words);
}

function placeWordInGrid(grid, word) {
    const gridSize = grid.length;
    let placed = false;
    const directions = ['horizontal', 'vertical', 'diagonal'];

    while (!placed) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(grid, word, row, col, direction)) {
            for (let i = 0; i < word.length; i++) {
                if (direction === 'horizontal') grid[row][col + i] = word[i];
                if (direction === 'vertical') grid[row + i][col] = word[i];
                if (direction === 'diagonal') grid[row + i][col + i] = word[i];
            }
            placed = true;
        }
    }
}

function canPlaceWord(grid, word, row, col, direction) {
    const gridSize = grid.length;
    if (direction === 'horizontal' && col + word.length > gridSize) return false;
    if (direction === 'vertical' && row + word.length > gridSize) return false;
    if (direction === 'diagonal' && (col + word.length > gridSize || row + word.length > gridSize)) return false;

    for (let i = 0; i < word.length; i++) {
        if (direction === 'horizontal' && grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
        if (direction === 'vertical' && grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
        if (direction === 'diagonal' && grid[row + i][col + i] !== '' && grid[row + i][col + i] !== word[i]) return false;
    }
    return true;
}

function fillEmptySpaces(grid) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
}

function displayGrid(grid) {
    const container = document.getElementById('wordSearchContainer');
    container.innerHTML = '';
    const table = document.createElement('table');
    for (let row = 0; row < grid.length; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < grid[row].length; col++) {
            const td = document.createElement('td');
            td.textContent = grid[row][col];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    container.appendChild(table);
}

function displayWordList(words) {
    const container = document.getElementById('wordListContainer');
    container.innerHTML = '<h3>Palabras a buscar:</h3>';
    const ul = document.createElement('ul');
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        ul.appendChild(li);
    });
    container.appendChild(ul);
}

function solveWordSearch() {
    const grid = currentGrid;
    const words = currentWords;

    words.forEach(word => {
        findAndHighlightWord(grid, word);
    });
}

function findAndHighlightWord(grid, word) {
    const gridSize = grid.length;
    const directions = ['horizontal', 'vertical', 'diagonal'];

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            for (let direction of directions) {
                if (checkWordInGrid(grid, word, row, col, direction)) {
                    highlightWordInGrid(grid, word, row, col, direction);
                }
            }
        }
    }
}

function checkWordInGrid(grid, word, row, col, direction) {
    const gridSize = grid.length;
    if (direction === 'horizontal' && col + word.length > gridSize) return false;
    if (direction === 'vertical' && row + word.length > gridSize) return false;
    if (direction === 'diagonal' && (col + word.length > gridSize || row + word.length > gridSize)) return false;

    for (let i = 0; i < word.length; i++) {
        if (direction === 'horizontal' && grid[row][col + i] !== word[i]) return false;
        if (direction === 'vertical' && grid[row + i][col] !== word[i]) return false;
        if (direction === 'diagonal' && grid[row + i][col + i] !== word[i]) return false;
    }
    return true;
}

function highlightWordInGrid(grid, word, row, col, direction) {
    const container = document.getElementById('wordSearchContainer');
    const table = container.querySelector('table');

    for (let i = 0; i < word.length; i++) {
        if (direction === 'horizontal') table.rows[row].cells[col + i].classList.add('highlight');
        if (direction === 'vertical') table.rows[row + i].cells[col].classList.add('highlight');
        if (direction === 'diagonal') table.rows[row + i].cells[col + i].classList.add('highlight');
    }
}

async function saveAsPDF() {
    const { jsPDF } = window.jspdf;
    const container = document.createElement('div');
    const wordSearchClone = document.getElementById('wordSearchContainer').cloneNode(true);
    const wordListClone = document.getElementById('wordListContainer').cloneNode(true);

    container.appendChild(wordSearchClone);
    container.appendChild(wordListClone);
    document.body.appendChild(container);
    const canvas = await html2canvas(container);
    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10);
    pdf.save('sopa-de-letras.pdf');
}

async function saveAsPNG() {
    const container = document.createElement('div');
    const wordSearchClone = document.getElementById('wordSearchContainer').cloneNode(true);
    const wordListClone = document.getElementById('wordListContainer').cloneNode(true);

    container.appendChild(wordSearchClone);
    container.appendChild(wordListClone);
    document.body.appendChild(container);
    const canvas = await html2canvas(container);
    document.body.removeChild(container);

    const link = document.createElement('a');
    link.download = 'sopa-de-letras.png';
    link.href = canvas.toDataURL();
    link.click();
}
