/** Create and display a puzzle with interactive buttons */

/** The div that contains the whole puzzle */
const puzzleContainer = document.querySelector('#puzzle-container');

// const TEST_PUZZLE_ROWS = {
//     0: [0,0,4,0,5,0,9,1,0],
//     1: [0,0,1,0,4,0,0,0,0],
//     2: [0,0,3,0,0,0,0,0,0],
//     3: [0,0,9,0,0,0,3,0,0],
//     4: [0,4,0,0,1,9,2,0,8],
//     5: [7,0,0,0,0,0,1,0,0],
//     6: [0,0,0,7,0,0,0,0,5],
//     7: [0,0,0,0,0,2,8,0,0],
//     8: [0,5,2,4,0,1,0,9,7],
// };

/** Converts a puzzle object from rows to blocks */
function convertRowsToBlocks(puzzle) {
    /** Puzzle to be returned */
    const convertedPuzzle = {
        block0: [],
        block1: [],
        block2: [],
        block3: [],
        block4: [],
        block5: [],
        block6: [],
        block7: [],
        block8: [],
    }

    /** Iterate through the rows to extract blocks */
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const rowNum = 3*i + j;
            const row = puzzle[rowNum];
            for (let k = 0; k < 3; k++) {
                const blockNum = 3*i + k;
                const block = convertedPuzzle[`block${blockNum}`];
                for (let l = 0; l < 3; l++) {
                    const rowIndex = 3*k + l;
                    const rowValue = row[rowIndex];
                    block.push(rowValue);
                }
            }
        }
    }

    return convertedPuzzle;
}

const TEST_PUZZLE_BLOCKS = convertRowsToBlocks({
    0: [2,0,7,9,0,0,0,6,0],
    1: [0,0,0,7,0,0,0,5,0],
    2: [0,6,9,2,0,4,8,0,0],
    3: [0,1,0,0,0,0,0,0,0],
    4: [0,0,8,0,0,0,0,9,4],
    5: [0,0,0,0,0,0,0,0,0],
    6: [0,0,2,4,0,9,1,0,8],
    7: [7,0,0,0,0,1,0,2,9],
    8: [0,0,0,0,0,7,5,0,0],
});

const rowAndColNumberLookup = [
    [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],
    [[0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5]],
    [[0,6],[0,7],[0,8],[1,6],[1,7],[1,8],[2,6],[2,7],[2,8]],
    [[3,0],[3,1],[3,2],[4,0],[4,1],[4,2],[5,0],[5,1],[5,2]],
    [[3,3],[3,4],[3,5],[4,3],[4,4],[4,5],[5,3],[5,4],[5,5]],
    [[3,6],[3,7],[3,8],[4,6],[4,7],[4,8],[5,6],[5,7],[5,8]],
    [[6,0],[6,1],[6,2],[7,0],[7,1],[7,2],[8,0],[8,1],[8,2]],
    [[6,3],[6,4],[6,5],[7,3],[7,4],[7,5],[8,3],[8,4],[8,5]],
    [[6,6],[6,7],[6,8],[7,6],[7,7],[7,8],[8,6],[8,7],[8,8]],
]

function displayPuzzle(puzzle) {
    for (let blockNum = 0; blockNum < 9; blockNum++) {
        /** Create 9 blocks */
        const block = document.createElement('div');
        block.setAttribute('id', 'block');

        for (let cellNum = 0; cellNum < 9; cellNum++) {
            /** Create 9 cells for each block */
            const cell = document.createElement('div');

            /** Find cell location */
            const cellLocation = rowAndColNumberLookup[blockNum][cellNum];
            const cellRow = cellLocation[0];
            const cellCol = cellLocation[1];

            /** Add cell row, col, and block as classes */
            const cellClassList = cell.classList
            cellClassList.add(`row-${cellRow}`);
            cellClassList.add(`col-${cellCol}`);
            cellClassList.add(`block-${blockNum}`)

            /** Check value of input puzzle to determine id of cell */
            const cellValue = puzzle[`block${blockNum}`][cellNum];
            if (cellValue === 0) {
                /** Cell is empty, so we add subcells */
                cell.setAttribute('id', 'cell');
                for (let subCellNum = 0; subCellNum < 9; subCellNum++) {
                    /** Create 9 sub-cells for each cell */
                    const subCell = document.createElement('div');
                    subCell.setAttribute('id', 'sub-cell');
                    subCell.classList.add(`value-${subCellNum+1}`);
                    subCell.textContent = `${subCellNum+1}`;

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
                cell.textContent = cellValue;
                cellClassList.add(`value-${cellValue}`);
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
    const parentCell = subCell.parentNode;

    /** Change selected sub cells to filled, and vice-a-versa */
    if (subCellId == 'selected-sub-cell') {
        selectedToFilled(subCell, subCellValue, parentCell);
    } else if (subCellId == 'filled-sub-cell') {
        filledToDefault(subCell, subCellValue, parentCell);
    }
}

function selectedToFilled(subCell, subCellValue, parentCell) {
    /** Remove hover event listeners */
    subCell.removeEventListener('mouseenter', subCellFill);
    subCell.removeEventListener('mouseleave', subCellDefault);

    /** Change color of subcell */
    subCell.setAttribute('id', 'filled-sub-cell');

    /** Add class to parent cell */
    parentCell.classList.add(`value-${subCellValue}`);
}

function filledToDefault(subCell, subCellValue, parentCell) {
    /** Remove class from parent cell */
    parentCell.classList.remove(`value-${subCellValue}`);

    /** Change color of subcell */
    subCell.setAttribute('id', 'sub-cell');

    /** Add hover event listeners */
    subCell.addEventListener('mouseenter', subCellFill);
    subCell.addEventListener('mouseleave', subCellDefault);
}

function subCellShiftClick(subCell) {
    /** Target parent cell of subcell and retrieve subcell value */
    const parentCell = subCell.parentNode;
    const subCellValue = subCell.textContent;

    /** Compare with solved puzzle */

    /** Remove all other subcells of parent subcell */
    parentCell.childNodes.forEach(child => parentCell.removeChild(child));

    /** Change attributes of cell, its content, and add a click event */
    parentCell.setAttribute('id', 'filled-cell');
    parentCell.classList.add(`value-${subCellValue}`);
    parentCell.textContent = subCellValue;
    parentCell.addEventListener('click', cellClick);

    /** Remove pencil marks from adjacent cells */
    removeOutdatedPencilMarks(parentCell, subCellValue);
}

function removeOutdatedPencilMarks(inputCell, inputValue) {
    /** Get the class list of the input cell */
    const inputCellClassList = inputCell.classList;

    /** Get input cell row, column, and block numbers */
    const inputCellRow = inputCellClassList[0];
    const inputCellCol = inputCellClassList[1];
    const inputCellBlock = inputCellClassList[2];

    /** Iterate over the blocks */
    puzzleContainer.childNodes.forEach(block => {
        /** Retrieve the empty cells of this block */
        const emptyCells = [];
        block.childNodes.forEach(cell => {
            if (cell.getAttribute('id') == 'cell') emptyCells.push(cell);
        });

        /** Iterate over the empty cells */
        emptyCells.forEach(cell => {
            /** Get the class list of the current cell */
            const cellClassList = cell.classList;

            /** If the cell is in the same row as the input cell */
            if (cellClassList.contains(inputCellRow)) {
                /** Iterate over the subcells */
                cell.childNodes.forEach(subCell => {
                    /** If the subcell is filled and has the same value as the input value*/
                    if (subCell.getAttribute('id') == 'filled-sub-cell' && subCell.classList.contains(`value-${inputValue}`)) {
                        filledToDefault(subCell, inputValue, cell);
                    }
                });
            }

            /** Otherwise, if the cell is in the same column as the input cell */
            else if (cellClassList.contains(inputCellCol)) {
                /** Iterate over the subcells */
                cell.childNodes.forEach(subCell => {
                    /** If the subcell is filled and has the same value as the input value*/
                    if (subCell.getAttribute('id') == 'filled-sub-cell' && subCell.classList.contains(`value-${inputValue}`)) {
                        filledToDefault(subCell, inputValue, cell);
                    }
                });
            }

            /** Otherwise, if the cell is in the same block as the input cell */
            else if (cellClassList.contains(inputCellBlock)) {
                /** Iterate over the subcells */
                cell.childNodes.forEach(subCell => {
                    /** If the subcell is filled and has the same value as the input value*/
                    if (subCell.getAttribute('id') == 'filled-sub-cell' && subCell.classList.contains(`value-${inputValue}`)) {
                        filledToDefault(subCell, inputValue, cell);
                    }
                });
            }
        });
    });
}

function cellClick(event) {
    /** rgb color values for reference */
    const white = 'rgb(255, 255, 255)';

    /** Target cell */
    const cell = event.target;

    /** Retrieve cell value and background color */
    const cellValue = cell.textContent;
    const cellBackgroundColor = getComputedStyle(cell).backgroundColor;

    /** Remove highlighting from all cells */
    const allEmptyCells = document.querySelectorAll('#cell');
    allEmptyCells.forEach(cell => cell.setAttribute('style', 'background-color: white'));
    const allFilledCells = document.querySelectorAll('#filled-cell');
    allFilledCells.forEach(cell => cell.setAttribute('style', 'background-color: white'));

    /** Determine background color to direct control flow */
    if (cellBackgroundColor == white) {
        /** Add highlighting to clicked cell */
        cell.setAttribute('style', 'background-color: lightblue');

        /** Gather all the other cells with the same value */
        const sameValueCells = [];
        allEmptyCells.forEach(cell => {
            if (cell.classList.contains(`value-${cellValue}`)) sameValueCells.push(cell);
        });
        allFilledCells.forEach(cell => {
            if (cell.classList.contains(`value-${cellValue}`)) sameValueCells.push(cell);
        });

        /** Add highlighting to all other cells with the same value */
        sameValueCells.forEach(cell => cell.setAttribute('style', 'background-color: lightblue'));
    }
}

