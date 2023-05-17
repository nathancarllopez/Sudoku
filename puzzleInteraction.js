/** Create and display a puzzle with interactive buttons */

/** The div that contains the whole puzzle */
const puzzleContainer = document.querySelector('#puzzle-container');

/** A test puzzle to work with */
const TEST_PUZZLE = {
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

/** There are 9 blocks in the whole puzzle, and each block contains 9 cells */
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
    const subCell = event.target;
    subCell.setAttribute('id', 'selected-sub-cell');
}

function subCellDefault(event) {
    const subCell = event.target;
    subCell.setAttribute('id', 'sub-cell');
}

function clickSubCell(event) {
    const subCell = event.target;
    const shiftPressed = event.shiftKey;
    if (shiftPressed) {
        shiftClick(subCell);
    } else {
        standardClick(subCell);
    }
}

function standardClick(subCell) {
    const subCellId = subCell.getAttribute('id');
    if (subCellId == 'selected-sub-cell') {
        subCell.removeEventListener('mouseenter', subCellFill);
        subCell.removeEventListener('mouseleave', subCellDefault);
        subCell.setAttribute('id', 'filled-sub-cell');
    } else if (subCellId == 'filled-sub-cell') {
        subCell.setAttribute('id', 'sub-cell');
        subCell.addEventListener('mouseenter', subCellFill);
        subCell.addEventListener('mouseleave', subCellDefault);
    }
}

function shiftClick(subCell) {
    const cell = subCell.parentNode;
    const selectedNumber = subCell.textContent;
    cell.childNodes.forEach(child => cell.removeChild(child));
    cell.setAttribute('id', 'filled-cell');
    cell.textContent = selectedNumber;
}