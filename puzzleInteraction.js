/** Create and display a puzzle with interactive buttons */

/** The div that contains the whole puzzle */
const puzzleContainer = document.querySelector('#puzzle-container');

const TEST_PUZZLE_BLOCKS = {
    block0: [8, 0, 0, 0, 0, 0, 2, 7, 1],
    block1: [0, 5, 1, 0, 0, 0, 8, 9, 3],
    block2: [7, 9, 0, 2, 0, 0, 4, 0, 0],
    block3: [0, 6, 8, 4, 5, 0, 0, 1, 3],
    block4: [7, 1, 2, 6, 3, 9, 0, 0, 4],
    block5: [5, 0, 0, 0, 0, 7, 6, 2, 0],
    block6: [3, 8, 0, 6, 9, 5, 0, 2, 0],
    block7: [0, 0, 5, 1, 2, 0, 3, 4, 0],
    block8: [1, 7, 0, 3, 4, 8, 9, 0, 6],
}

function displayPuzzle(puzzle) {
    for (let i = 0; i < 9; i++) {
        /** Create 9 blocks */
        const block = document.createElement('div');
        block.setAttribute('id', 'block');

        for (let j = 0; j < 9; j++) {
            /** Create 9 cells for each block */
            const cell = document.createElement('div');
            const puzzleValue = puzzle[`block${i}`][j];

            /** Check value of input puzzle to determine id of cell */
            if (puzzleValue === 0) {
                /** Cell is empty, so we add subcells */
                cell.setAttribute('id', 'cell');
                for (let k = 0; k < 9; k++) {
                    /** Create 9 sub-cells for each cell */
                    const subCell = document.createElement('div');
                    subCell.setAttribute('id', 'sub-cell');
                    subCell.textContent = `${k+1}`;

                    /** Add hover effect */
                    subCell.addEventListener('mouseenter', subCellFill);
                    subCell.addEventListener('mouseleave', subCellDefault);

                    /** Add click effect */
                    subCell.addEventListener('click', clickSubCell);

                    /** Add each sub-cell to its cell */
                    cell.appendChild(subCell);
                }
            } else {
                /** Cell is filled already */
                cell.setAttribute('id', 'filled-cell');
                cell.textContent = puzzleValue;
                cell.setAttribute('class', `value-${puzzleValue}`);
                cell.addEventListener('click', cellClick);
            }
            

            /** Add each cell to its block */
            block.appendChild(cell);
        }

        /** Add each block to puzzle */
        puzzleContainer.appendChild(block);
    }
}

/** Event listener functions */

function subCellFill(event) {
    /** Target subCell */
    const subCell = event.target;

    /** Change color to red */
    subCell.setAttribute('id', 'selected-sub-cell');
}

function subCellDefault(event) {
    /** Target subcell */
    const subCell = event.target;

    /** Change color to black */
    subCell.setAttribute('id', 'sub-cell');
}

function clickSubCell(event) {
    /** Target subcell */
    const subCell = event.target;

    /** Check if shift is pressed */
    const shiftPressed = event.shiftKey;
    if (shiftPressed) {
        subCellShiftClick(subCell);
    } else {
        subCellClick(subCell);
    }
}

function subCellClick(subCell) {
    /** Retrieve subcell id and subcell value */
    const subCellId = subCell.getAttribute('id');
    const subCellValue = subCell.textContent;

    /** Retrieve parent cell of subcell */
    const cell = subCell.parentNode;

    /** Check sub cell id to determine control flow */
    if (subCellId == 'selected-sub-cell') {
        /** Remove hover event listeners */
        subCell.removeEventListener('mouseenter', subCellFill);
        subCell.removeEventListener('mouseleave', subCellDefault);

        /** Change color of subcell */
        subCell.setAttribute('id', 'filled-sub-cell');

        /** Add class to parent cell */
        // cell.setAttribute('class', `value-${subCellValue}`);
        cell.classList.add(`value-${subCellValue}`);
        
    } else if (subCellId == 'filled-sub-cell') {
        /** Remove class from parent cell */
        cell.classList.remove(`value-${subCellValue}`);

        /** Change color of subcell */
        subCell.setAttribute('id', 'sub-cell');

        /** Add hover event listeners */
        subCell.addEventListener('mouseenter', subCellFill);
        subCell.addEventListener('mouseleave', subCellDefault);
    }
}

function subCellShiftClick(subCell) {
    /** Target parent cell of subcell and retrieve subcell value */
    const cell = subCell.parentNode;
    const subCellValue = subCell.textContent;

    /** Remove all other subcells of parent subcell */
    cell.childNodes.forEach(child => cell.removeChild(child));

    /** Change attributes of cell, its content, and add a click event */
    cell.setAttribute('id', 'filled-cell');
    cell.setAttribute('class', `value-${subCellValue}`);
    cell.textContent = subCellValue;
    cell.addEventListener('click', cellClick);

    /** Remove pencil marks from adjacent cells */
    
}

function cellClick(event) {
    /** rgb color values for reference */
    const white = 'rgb(255, 255, 255)';

    /** Target cell */
    const cell = event.target;

    /** Retrieve cell value and background color */
    const cellValue = cell.getAttribute('class');
    const cellBackgroundColor = getComputedStyle(cell).backgroundColor;

    /** Remove highlighting from all cells */
    const allCells = document.querySelectorAll('#cell');
    allCells.forEach(cell => cell.setAttribute('style', 'background-color: white'));
    const allFilledCells = document.querySelectorAll('#filled-cell');
    allFilledCells.forEach(cell => cell.setAttribute('style', 'background-color: white'));

    /** Determine background color to direct control flow */
    if (cellBackgroundColor == white) {
        /** Add highlighting to clicked cell and all cells with the same value */
        cell.setAttribute('style', 'background-color: lightblue');
        const sameValueCells = document.querySelectorAll(`.${cellValue}`);
        sameValueCells.forEach(cell => cell.setAttribute('style', 'background-color: lightblue'));
    }
}

