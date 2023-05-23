/** 
 * 
 * Until I figure out how importing and exporting works,
 * all of the javascript code for sudoku will be put into this one file
 * 
 */

/**
 * 
 * Contents
 * 
 * 0. Constants
 * 1. Interaction
 * 2. Solver
 * 3. Builder
 * 4. Utility functions
 * 
 */

/** ******************************************
 * *******************************************
 * **************** Constants ****************
 * *******************************************
 * *******************************************
 */
//#region
/** The div that contains the whole puzzle */
const PUZZLE_CONTAINER = document.querySelector('#puzzle-container');

/** The div that contains the instructions and score */
const INSTRUCTIONS_AND_SCORE_CONTAINER = document.querySelector('#instructions-and-score-container');

/** The p that displays the score */
const SCORE_STRING = document.querySelector('#strikes');

/** The p that displays a message at game over */
const GAME_OVER_MESSAGE = document.querySelector('#game-over-message');

/** The form that controls difficulty */
const START_BUTTON = document.querySelector('#start-game-button');

/** The empty cells */
let EMPTY_CELLS;

/** The number of wrong answers entered */
let STRIKES = 0;

/** Indicates a game over */
let GAME_OVER = false;

/** Stopwatch timer ID */
let STOPWATCH_ID;

/** Two testing puzzles */
const TEST_PUZZLE_1 = [
    [2,0,7,9,0,0,0,6,0],
    [0,0,0,7,0,0,0,5,0], // These arrays are
    [0,6,9,2,0,4,8,0,0], // the rows of the
    [0,1,0,0,0,0,0,0,0], // puzzle
    [0,0,8,0,0,0,0,9,4],
    [0,0,0,0,0,0,0,0,0],
    [0,0,2,4,0,9,1,0,8],
    [7,0,0,0,0,1,0,2,9],
    [0,0,0,0,0,7,5,0,0],
];

const TEST_PUZZLE_2 = [
    [2,4,0,9,0,0,5,0,1],
    [0,8,9,0,1,0,0,0,0],
    [5,1,0,4,0,0,0,0,0],
    [4,0,0,0,0,0,8,0,0],
    [0,0,6,0,0,0,4,0,0],
    [8,2,0,0,0,0,3,5,0],
    [0,0,0,0,6,0,0,9,4],
    [0,0,0,2,0,0,0,8,0],
    [3,0,0,8,0,0,6,0,0],
]

/** A finished puzzle, also for testing */
const FINISHED_PUZZLE = {
    0: [5,3,4,6,7,8,9,1,2],
    1: [6,7,2,1,9,5,3,4,8],
    2: [1,9,8,3,4,2,5,6,7],
    3: [8,5,9,7,6,1,4,2,3],
    4: [4,2,6,8,5,3,7,9,1],
    5: [7,1,3,9,2,4,8,5,6],
    6: [9,6,1,5,3,7,2,8,4],
    7: [2,8,7,4,1,9,6,3,5],
    8: [3,4,5,2,8,6,1,7,9],
}

/** A blank puzzle, used to build puzzles */
const BLANK_PUZZLE = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
]

/** 
 * The row and column numbers of the blocks
 * Hard-coded for global access
 */
const ALL_BLOCKS = [
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
//#endregion

/** ******************************************
 * *******************************************
 * **************** Interaction **************
 * *******************************************
 * *******************************************
 */
//#region
//#region

/** Add an event listener to the start button */
START_BUTTON.addEventListener('click', startGame);

/**
 * Main function:
 * Starts a game by checking on the difficulty radio buttons,
 * and then calling buildAPuzzle and displayPuzzle
 * 
 */
function startGame() {
    /** See what difficulty was selected */
    const difficultyRadioButtons = document.querySelectorAll('input[name="difficulty"]');
    let selectedDifficulty;
    for (const radioButton of difficultyRadioButtons) {
        if (radioButton.checked) {
            selectedDifficulty = radioButton.value;
            break;
        }
    }

    /** Builds a puzzle based on the selected difficulty */
    const puzzle = buildAPuzzle(selectedDifficulty);

    /** Display the puzzle */
    displayPuzzle(puzzle);
}

/**
 * Creates and displays the puzzle as a nested grid of divs.
 * Manages event listeners for cells and subcells
 * 
 * @param {*} puzzle 
 */
function displayPuzzle(puzzle) {
    /** Clear out the old puzzle */
    while (PUZZLE_CONTAINER.firstChild) {
        PUZZLE_CONTAINER.removeChild(PUZZLE_CONTAINER.firstChild);
    }

    /** Solve the puzzle to pass as a parameter to the event listeners */
    const solvedPuzzle = solvePuzzle(puzzle);

    /** Create the new puzzle */
    for (let blockNum = 0; blockNum < 9; blockNum++) {
        /** Create 9 blocks */
        const block = document.createElement('div');
        block.setAttribute('id', 'block');

        for (let cellNum = 0; cellNum < 9; cellNum++) {
            /** Create 9 cells for each block */
            const cell = document.createElement('div');

            /** Find cell location */
            const cellLocation = ALL_BLOCKS[blockNum][cellNum];
            const cellRow = cellLocation[0];
            const cellCol = cellLocation[1];

            /** Add cell row, col, and block as classes */
            const cellClassList = cell.classList
            cellClassList.add(`row-${cellRow}`);
            cellClassList.add(`col-${cellCol}`);
            cellClassList.add(`block-${blockNum}`)

            /** Check value of input puzzle to determine id of cell */
            const cellValue = puzzle[cellRow][cellCol];
            if (!cellValue) {
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
                    subCell.addEventListener('click', event => clickSubCellWhichType(event, solvedPuzzle));

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
        PUZZLE_CONTAINER.appendChild(block);
    }

    PUZZLE_CONTAINER.setAttribute('style', 'border-right-width: 5px');
    manageStopwatch();

    EMPTY_CELLS = document.querySelectorAll('#cell');

    // console.log("The solution", solvedPuzzle);
}

function manageStopwatch() {
    if (GAME_OVER) {
        clearInterval(STOPWATCH_ID);
    } else {
        let minutesLabel = document.getElementById("minutes");
        let secondsLabel = document.getElementById("seconds");
        let totalSeconds = 0;

        function setTime() {
            ++totalSeconds;
            secondsLabel.textContent = pad(totalSeconds%60);
            minutesLabel.textContent = pad(parseInt(totalSeconds/60));
        }

        function pad(val) {
            let valString = val + "";
            if(valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }
        }

        STOPWATCH_ID = setInterval(setTime, 1000);
    }
}
//#endregion

/**
 * ***********************************
 * Functions called by event listeners
 * ***********************************
 */
//#region
function removeOutdatedPencilMarks(inputCell, inputValue) {
    /** Get the class list of the input cell */
    const inputCellClassList = inputCell.classList;

    /** Get input cell row, column, and block numbers */
    const inputCellRow = inputCellClassList[0];
    const inputCellCol = inputCellClassList[1];
    const inputCellBlock = inputCellClassList[2];

    /** Iterate over the blocks */
    PUZZLE_CONTAINER.childNodes.forEach(block => {
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

function punishWrongAnswer() {
    if (!GAME_OVER) {
        STRIKES++;
        if (STRIKES == 1) {
            SCORE_STRING.textContent = `You have ${STRIKES} strike.`;
        } else if (STRIKES == 2) {
            SCORE_STRING.textContent = `You have ${STRIKES} strikes.`;
        } else {
            SCORE_STRING.textContent = `You have ${STRIKES} strikes.`;
            GAME_OVER_MESSAGE.textContent = "game over";
            GAME_OVER = true;
            manageStopwatch();
        }
    }
}

/**
 * When a subcell is clicked, this function creates or
 * removes a pencil mark. That is, it changes the subcell
 * text color to black or back to transparent.
 * 
 * @param {*} subCell 
 */
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

/**
 * Subfunction of subCellClick
 * 
 * @param {*} subCell 
 * @param {*} subCellValue 
 * @param {*} parentCell 
 */
function selectedToFilled(subCell, subCellValue, parentCell) {
    /** Remove hover event listeners */
    subCell.removeEventListener('mouseenter', subCellFill);
    subCell.removeEventListener('mouseleave', subCellDefault);

    /** Change color of subcell */
    subCell.setAttribute('id', 'filled-sub-cell');

    /** Add class to parent cell */
    parentCell.classList.add(`value-${subCellValue}`);
}

/**
 * Subfunction of subCellClick
 * 
 * @param {*} subCell 
 * @param {*} subCellValue 
 * @param {*} parentCell 
 */
function filledToDefault(subCell, subCellValue, parentCell) {
    /** Remove class from parent cell */
    parentCell.classList.remove(`value-${subCellValue}`);

    /** Change color of subcell */
    subCell.setAttribute('id', 'sub-cell');

    /** Add hover event listeners */
    subCell.addEventListener('mouseenter', subCellFill);
    subCell.addEventListener('mouseleave', subCellDefault);
}

/**
 * When a subcell is shift+clicked, 
 * 
 * @param {*} subCell 
 */
function subCellShiftClick(subCell, solvedPuzzle) {
    /** Target parent cell of subcell and retrieve subcell value */
    const parentCell = subCell.parentNode;
    const parentCellClassList = parentCell.classList;
    const parentCellRowString = parentCellClassList[0];
    const parentCellRowNum = parentCellRowString.slice(-1);
    const parentCellColString = parentCellClassList[1];
    const parentCellColNum =  parentCellColString.slice(-1);
    const subCellValue = subCell.textContent;

    /** Compare with solved puzzle */
    const solutionCellValue = solvedPuzzle[parentCellRowNum][parentCellColNum];
    // console.log("solution", solutionCellValue);
    // console.log("guess", subCellValue);
    if (subCellValue == solutionCellValue) {
        /** Remove all other subcells of parent subcell */
        parentCell.childNodes.forEach(child => parentCell.removeChild(child));

        /** Change attributes of cell, its content, and add a click event */
        parentCell.setAttribute('id', 'filled-cell');
        parentCell.classList.add(`value-${subCellValue}`);
        parentCell.textContent = subCellValue;
        parentCell.addEventListener('click', cellClick);

        /** Remove pencil marks from adjacent cells */
        removeOutdatedPencilMarks(parentCell, subCellValue);

        /** Recalculate the empty cells */
        EMPTY_CELLS = document.querySelectorAll('#cell');

        /** If there are no empty cells */
        if (!EMPTY_CELLS.length) {
            GAME_OVER_MESSAGE.textContent = 'You win!'
            GAME_OVER = true;
            manageStopwatch();
        }

    } else {
        punishWrongAnswer();
    }
}
//#endregion

/**
 * ************************
 * Event listener functions
 * ************************
 */
//#region

/**
 * When the mouse is hovering over a subcell,
 * this function changes the text content from
 * transparent to red
 * 
 * @param {*} event 
 */
function subCellFill(event) {
    /** Target subCell */
    const subCell = event.target;

    /** Change color to red */
    subCell.setAttribute('id', 'selected-sub-cell');
}

/**
 * When the mouse stops hovering over a subcell,
 * this function changes the text content from
 * red to transparent
 * 
 * @param {*} event 
 */
function subCellDefault(event) {
    /** Target subcell */
    const subCell = event.target;

    /** Change color to black */
    subCell.setAttribute('id', 'sub-cell');
}

/**
 * When a subcell is clicked, this function first
 * distinguishes click from shift+click. Then, it
 * activates the corresponding function: a click
 * activates a pencil mark being created, and a 
 * shift+click activates a cell being filled
 * 
 * @param {*} event 
 */
function clickSubCellWhichType(event, solvedPuzzle) {
    /** Target subcell */
    const subCell = event.target;

    /** Check if shift is pressed */
    const shiftPressed = event.shiftKey;
    if (shiftPressed) {
        subCellShiftClick(subCell, solvedPuzzle);
    } else {
        subCellClick(subCell);
    }
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
//#endregion
//#endregion

/** ******************************************
 * *******************************************
 * **************** Solver *******************
 * *******************************************
 * *******************************************
 */
//#region
/** 
 * This code solves sudoku puzzles 
 * 
 * A puzzle is a nested array, with each array storing the values of one row:
 * examplePuzzle = [
 *  [1,2,3,4,5,6,7,8,9],
 *  [2,3,4,5,6,7,8,9,1],
 *  ...
 *  [9,1,2,3,4,5,6,7,8],
 * ]
 * 
 * A value of 1-9 means the cell is already filled with that value,
 * whereas a value of 0 designates an empty cell.
 * */

function getCellsWithValue(puzzle, value) {
    const cellsWithValue = [];
    for (let rowNum = 0; rowNum < 9; rowNum++) {
        const row = puzzle[rowNum];
        for (let colNum = 0; colNum < 9; colNum++) {
            if (row[colNum] == value) cellsWithValue.push([rowNum, colNum]);
        }
    }
    return cellsWithValue;
}

function getEmptyCells(puzzle) {
    return getCellsWithValue(puzzle, 0);
}

/**
 * A nested object representing the possible values that each empty cell could have
 * 
 * @param {*} puzzle - (object)
 * @returns 
 */
function getOptions(puzzle) {
    /** Build a nested object keyed by the row- and column-number of the empty cells */
    const options = {};
    const emptyCells = getEmptyCells(puzzle);
    emptyCells.forEach(cell => {
        const rowNum = cell[0];
        const colNum = cell[1];
        rowNum in options ? options[rowNum][colNum] = [] : options[rowNum] = {[colNum]: []};
    });

    /** 
     * Fill dictionary:
     * 
     * The idea is to iterate through the cells of each value and use their
     * row- and column-numbers to eliminate empty cells. Any empty cell that
     * remains gets the value as an option
     */
    for (let value of [1,2,3,4,5,6,7,8,9]) {
        const eliminatedEmptyCells = [];
        for (let [valueRowNum, valueColNum] of getCellsWithValue(puzzle, value)) {
            /** Eliminate empties from row valueRowNum */
            for (let colNum = 0; colNum < 9; colNum++) {
                const cellValue = puzzle[valueRowNum][colNum];
                if (!cellValue) {
                    if (!eliminatedEmptyCells.find(cell => cell[0] == valueRowNum && cell[1] == colNum)) {
                        eliminatedEmptyCells.push([valueRowNum, colNum]);
                    }
                }
            }
            /** Eliminate empties from col valueColNum */
            for (let rowNum = 0; rowNum < 9; rowNum++) {
                const cellValue = puzzle[rowNum][valueColNum];
                if (!cellValue) {
                    if (!eliminatedEmptyCells.find(cell => cell[0] == rowNum && cell[1] == valueColNum)) {
                        eliminatedEmptyCells.push([rowNum, valueColNum]);
                    }
                }
            }
            /** Eliminate empties from the block containing the cell valueRowNum, valueColNum */
            for (let blockNum in ALL_BLOCKS) {
                const block = ALL_BLOCKS[blockNum];
                if (block.find(cell => cell[0] == valueRowNum && cell[1] == valueColNum)) {
                    for (let [rowNum, colNum] of block) {
                        const cellValue = puzzle[rowNum][colNum];
                        if (!cellValue) {
                            if (!eliminatedEmptyCells.find(cell => cell[0] == rowNum && cell[1] == colNum)) {
                                eliminatedEmptyCells.push([rowNum, colNum]);
                            }
                        }
                    }
                    break;
                }
            }
        }
        /** Add value to options at all empty cells that have not been eliminated */
        emptyCells.forEach(emptyCell => {
            for (index = 0; index < eliminatedEmptyCells.length + 1; index++) {
                /** If we've reached the end of the loop, then no matches were found */
                if (index == eliminatedEmptyCells.length) {
                    options[emptyCell[0]][emptyCell[1]].push(value);
                    break;
                }

                /** If the empty cell is one of the eliminated cells, then move onto the next empty cell */
                const eliminatedCell = eliminatedEmptyCells[index];
                if (eliminatedCell[0] == emptyCell[0] && eliminatedCell[1] == emptyCell[1]) break;
            }
        });
    }
    return options;
}

/**
 * Returns the single value cells determined by the options
 * 
 * @param {*} options (object) Possible values each empty cell could have
 * @returns {*} singleValueCells (object) Cells with only one possible value
 */
function getSingleValueCells(options) {
    /** Initialize an object to hold the result */
    const singleValueCells = {};

    /** Look through options */
    for (rowNum in options) {
        for (colNum in options[rowNum]) {
            /** Retrive the values at cell rowNum, colNum */
            const valueArray = options[rowNum][colNum];

            /** If there is only one possible value, add rowNum, colNum, and the value to singleValueCells */
            if (valueArray.length == 1) {
                const value = valueArray[0];
                rowNum in singleValueCells ? singleValueCells[rowNum][colNum] = value : singleValueCells[rowNum] = {[colNum]: value};
            }
        }
    }
    return singleValueCells;
}

function getLonelyValueCells(options) {
    /** Initialize an object to hold the result */
    const lonelyValueCells = {};

    /** For each value */
    for (let value of [1,2,3,4,5,6,7,8,9]) {

        /** Find any lonely cells in the rows */
        for (rowNum in options) {

            /** Collect all cells that have value as an option */
            const rowCells = [];
            for (colNum in options[rowNum]) {
                const cellOptions = options[rowNum][colNum];
                if (cellOptions.includes(value)) rowCells.push([rowNum, colNum]);
            }

            /** If only one cell was collected, add it to lonelyValueCells */
            if (rowCells.length == 1) {
                const lonelyCell = rowCells[0];
                const lonelyCellRowNum = lonelyCell[0];
                const lonelyCellColNum = lonelyCell[1];
                if (lonelyCellRowNum in lonelyValueCells) {
                    lonelyValueCells[lonelyCellRowNum][lonelyCellColNum] = value;
                } else {
                    lonelyValueCells[lonelyCellRowNum] = {[lonelyCellColNum]: value};
                }
            }
        }

        /** Find any lonely cells in the columns */
        for (colNum = 0; colNum < 9; colNum++) {
            /** Collect all cells that have value as an option */
            const colCells = [];
            for (rowNum in options) {
                if (colNum in options[rowNum]) {
                    const cellOptions = options[rowNum][colNum];
                    if (cellOptions.includes(value)) colCells.push([rowNum, colNum]);
                }
            }
    
            /** If there is only one cell collected, add it to lonelyValueCells */
            if (colCells.length == 1) {
                const lonelyCell = colCells[0];
                const lonelyCellRowNum = lonelyCell[0];
                const lonelyCellColNum = lonelyCell[1];
                if (lonelyCellRowNum in lonelyValueCells) {
                    lonelyValueCells[lonelyCellRowNum][lonelyCellColNum] = value;
                } else {
                    lonelyValueCells[lonelyCellRowNum] = {[lonelyCellColNum]: value};
                }
            }
        }

        /** Find any lonely cells in the blocks */
        for (blockNum in ALL_BLOCKS) {
            const block = ALL_BLOCKS[blockNum];
            /** Collect all cells that have value as an option */
            const blockCells = [];
            for (let [rowNum, colNum] of block) {
                if (rowNum in options && colNum in options[rowNum]) {
                    const cellOptions = options[rowNum][colNum];
                    if (cellOptions.includes(value)) blockCells.push([rowNum, colNum]);
                }
            }

            /** If there is only one cell collected, add it to lonelyValueCells */
            if (blockCells.length == 1) {
                const lonelyCell = blockCells[0];
                const lonelyCellRowNum = lonelyCell[0];
                const lonelyCellColNum = lonelyCell[1];
                if (lonelyCellRowNum in lonelyValueCells) {
                    lonelyValueCells[lonelyCellRowNum][lonelyCellColNum] = value;
                } else {
                    lonelyValueCells[lonelyCellRowNum] = {[lonelyCellColNum]: value};
                }
            }
        }

    }
    return lonelyValueCells;
}

function updateOptions(valueRowNum, valueColNum, value, inputOptions) {
    /** Create a copy of the input options to work with */
    let options = JSON.parse(JSON.stringify(inputOptions));

    /** Remove the cell at valueRowNum, valueColNum from options */
    delete options[valueRowNum][valueColNum];

    /** Remove value from all cells in row # valueRowNum */
    for (let colNum = 0; colNum < 9; colNum++) {
        if (colNum in options[valueRowNum]) {
            const newCellOptions = options[valueRowNum][colNum].filter(digit => digit !== value);
            options[valueRowNum][colNum] = newCellOptions;
        }
    }

    /** Remove value from all cells in col # valueColNum */
    for (let rowNum = 0; rowNum < 9; rowNum++) {
        if (rowNum in options && valueColNum in options[rowNum]) {
            const newCellOptions = options[rowNum][valueColNum].filter(digit => digit !== value);
            options[rowNum][valueColNum] = newCellOptions;
        }
    }

    /** Remove value from all cells in same block as cell at valueRowNum, valueColNum */
    for (let blockNum in ALL_BLOCKS) {
        const block = ALL_BLOCKS[blockNum];
        if (block.find(cell => cell[0] == valueRowNum && cell[1] == valueColNum)) {
            for (let [rowNum, colNum] of block) {
                if (rowNum in options && colNum in options[rowNum]) {
                    const newCellOptions = options[rowNum][colNum].filter(digit => digit !== value);
                    options[rowNum][colNum] = newCellOptions;
                }
            }
            break;
        }
    }
    
    return options;
}

function checkOptionsForContradiction(puzzle, options) {
    /** Initialize a boolean to return */
    let contradiction = false;

    /** Look through empty cells and check if options has an empty array */
    for (let [rowNum, colNum] of getEmptyCells(puzzle)) {
        if (options[rowNum][colNum].length == 0) contradiction = true;
    }

    return contradiction;
}

function fillSvCells(puzzle, options) {
    /** Initialize an array to hold the result, will be changed if no contradictions are found */
    let result = false;

    /** Retrieve the single value cells */
    let singleValueCells = getSingleValueCells(options);

    /** Initialize a boolean to indicate contradictions */
    let contradictionFound = false;

    /** While single value cells remain in the puzzle */
    while (Object.keys(singleValueCells).length > 0) {
        /** Look through the single value cells */
        for (rowNum in singleValueCells) {
            for (colNum in singleValueCells[rowNum]) {
                /** Retrieve the value */
                const value = singleValueCells[rowNum][colNum];

                /** Fill the value in the puzzle and update options */
                puzzle[rowNum][colNum] = value;
                options = updateOptions(rowNum, colNum, value, options);

                /** If the options have a contradiction exit the loop */
                if (checkOptionsForContradiction(puzzle, options)) {
                    contradictionFound = true;
                    break;
                }
            }

            /** Exit the loop if a contradiction is found */
            if (contradictionFound) break;
        }

        /** If we found a contradiction, exit the while loop */
        if (contradictionFound) {
            break;
        } 
        /** Otherwise, look for new single value cells with the updated options */
        else {
            singleValueCells = getSingleValueCells(options);
        }
    }

    /** If we did not find any contradictions, redefine result */
    if (!contradictionFound) {
        result = [puzzle, options];
    }

    return result;
}

function fillLvAndSvCells(puzzle, options) {
    /** Initialize a variable to hold the result */
    let result = false;

    /** Fill any single value cells */
    let fillSvCellsResult = fillSvCells(puzzle, options);

    /** If filling the single value cells gave a contradiction, return result */
    if (!fillSvCellsResult) return result;

    /** Otherwise, unpack result fillSvCellsResult array */
    puzzle = fillSvCellsResult[0];
    options = fillSvCellsResult[1];

    /** Generate the lonely value cells */
    let lonelyValueCells = getLonelyValueCells(options);

    /** Initialize a boolean to indicate contradictions */
    let contradictionFound = false;

    /** Alternate filling lonely and single value cells until none of either remain */
    while(Object.keys(lonelyValueCells).length > 0) {
        /** Fill the lonely value cells */
        for (rowNum in lonelyValueCells) {
            for (colNum in lonelyValueCells[rowNum]) {
                /** Retrieve the value */
                const value = lonelyValueCells[rowNum][colNum];

                /** Fill the value in the puzzle and update the options */
                puzzle[rowNum][colNum] = value;
                options = updateOptions(rowNum, colNum, value, options);

                /** If the options have a contradiction exit the loop */
                if (checkOptionsForContradiction(puzzle, options)) {
                    contradictionFound = true;
                    break;
                }
            }

            /** Exit the loop if a contradiction was found */
            if (contradictionFound) break;
        }

        /** If a contradiction was found, exit the while loop */
        if (contradictionFound) break;

        /** Fill any single value cells */
        let singleValueCells = getSingleValueCells(options);
        if (Object.keys(singleValueCells).length > 0) {
            fillSvCellsResult = fillSvCells(puzzle, options);
            if (!fillSvCellsResult) return result;
            puzzle = fillSvCellsResult[0];
            options = fillSvCellsResult[1];
        }

        /** Generate the lonely value cells with the updated options */
        lonelyValueCells = getLonelyValueCells(options);
    }

    /** If we did not find any contradictions, redefine result */
    if (!contradictionFound) {
        result = puzzle;
    }

    return result;
}

function buildGuessStack(puzzle, options) {
    /** Initialize variables */
    let guess = [];
    let minNumberOfPossibilities = 1;

    /** Find the first cell with the smallest number of options */
    let guessFound = false;
    while (guess.length == 0) {
        for (rowNum in options) {
            for (colNum in options[rowNum]) {
                const possibilites = options[rowNum][colNum];
                if (possibilites.length == minNumberOfPossibilities) {
                    guess = [rowNum, colNum, possibilites];
                    guessFound = true;
                }
                if (guessFound) break;
            }
            if (guessFound) break;
        }
        minNumberOfPossibilities++;
        if (minNumberOfPossibilities > 9) throw 'Possibilities too large';
    }

    /** Relabel the elements of guess */
    const guessRow = guess[0];
    const guessCol = guess[1];
    const guessPossibilities = guess[2];

    /** Create the guess stack */
    const guessStack = [];
    for (guessValue of guessPossibilities) {
        /** Create a copy of the puzzle */
        let duplicatePuzzle = JSON.parse(JSON.stringify(puzzle));

        /** Fill in the guess cell with one of the possibilities and update the options */
        duplicatePuzzle[guessRow][guessCol] = guessValue;
        let duplicateOptions = updateOptions(guessRow, guessCol, guessValue, options);

        /** If duplicateOptions has a contradiction, skip to the next guess value */
        if (checkOptionsForContradiction(duplicatePuzzle, duplicateOptions)) continue;

        /** Fill the single- and lonely-value cells */
        let fillLvAndSvCellsResult = fillLvAndSvCells(duplicatePuzzle, duplicateOptions);

        /** If filling the lonely- and single-value cells produced a contradiction, skip to the next guess value */
        if (fillLvAndSvCellsResult === false) continue;
        
        /** Otherwise, add the filled-in puzzle to the top of the guess stack */
        guessStack.push(fillLvAndSvCellsResult)
    }

    return guessStack;
}

function solvePuzzle(inputPuzzle) {
    /** Make a copy of the puzzle to work with */
    let puzzle = JSON.parse(JSON.stringify(inputPuzzle));

    /** If the puzzle has no empty cells, return it */
    let emptyCount = getEmptyCells(puzzle).length;
    if (emptyCount == 0) return puzzle;

    /** Generate options and build the main guess stack */
    options = getOptions(puzzle);
    let guessStack = buildGuessStack(puzzle, options);

    /** While there are empty cells */
    while (emptyCount > 0) {

        /** Take the top puzzle off the stack and see how many empty cells it has */
        puzzle = guessStack.pop();
        emptyCount = getEmptyCells(puzzle).length;

        /** If there are no empty cells, return the puzzle */
        if (emptyCount == 0) return puzzle;

        /** Otherwise, check this puzzle for contradictions */
        options = getOptions(puzzle);
        if (!checkOptionsForContradiction(puzzle, options)) {
            /** If not, build a guess stack for this puzzle */
            const childGuessStack = buildGuessStack(puzzle, options);

            /** Add the new guess stack to the main guess stack */
            childGuessStack.forEach(kid => guessStack.push(kid));
        }
    }
}
//#endregion

/** ******************************************
 * *******************************************
 * **************** Builder ******************
 * *******************************************
 * *******************************************
 */
//#region
/**
 * Finds solutions to the inputPuzzle, computing up to max of them.
 * Max is defaulted to 2 because our main use for the function is to
 * decide if a puzzle has a unique solution
 * 
 * @param {*} inputPuzzle 
 * @param {*} max 
 * @returns (integer) The number of solutions the function could find
 */
function countSolutions(inputPuzzle, max = 2) {
    const solutions = [];
    let solutionCount = solutions.length;

    let puzzle = JSON.parse(JSON.stringify(inputPuzzle));

    if (!getEmptyCells(puzzle).length) {
        solutions.push(puzzle);
        solutionCount = solutions.length;

    } else {
        let options = getOptions(puzzle);
        const guessStack = buildGuessStack(puzzle, options);
        let guessCount = guessStack.length;

        while (solutionCount < max && guessCount > 0) {
            puzzle = guessStack.pop();

            if (!getEmptyCells(puzzle).length) {
                solutions.push(puzzle);
            } else {
                options = getOptions(puzzle);
                if (!checkOptionsForContradiction(puzzle, options)) {
                    const childGuessStack = buildGuessStack(puzzle, options);
                    childGuessStack.forEach(kid => guessStack.push(kid));
                }
            }

            solutionCount = solutions.length;
            guessCount = guessStack.length;
        }
    }

    return solutionCount;
}

function buildAPuzzle(difficulty) {
    let puzzle = JSON.parse(JSON.stringify(BLANK_PUZZLE))
    let emptyCells = getEmptyCells(puzzle);
    let options = getOptions(puzzle);

    let iterations = 0;
    while (true) {
        /** Random empty cell */
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCell = emptyCells.splice(randomIndex, 1)[0]; // Works like 
                                                                 // list.pop(index)
                                                                 // from Python

        /** Random value from options */
        const randomCellPossibilities = options[randomCell[0]][randomCell[1]];
        randomIndex = Math.floor(Math.random() * randomCellPossibilities.length);
        const randomValue = randomCellPossibilities.splice(randomIndex, 1)[0];

        /** Update the puzzle */
        puzzle[randomCell[0]][randomCell[1]] = randomValue;
        let updatedOptions = updateOptions(randomCell[0], randomCell[1], randomValue, options);

        /** If the puzzle has a unique solution */
        if (countSolutions(puzzle) == 1) {
            /** If the difficulty is set to hard, run randomRemove */
            if (difficulty == 'hard') {
                console.log('easy puzzle', puzzle);
                puzzle = randomRemove(puzzle);
            }

            return puzzle;
        }

        /** If the puzzle has no solutions, reverse the update */
        if (countSolutions(puzzle) == 0) {
            puzzle[randomCell[0]][randomCell[1]] = 0;
            emptyCells.push(randomCell);
        }

        /** Otherwise, the puzzle has multiple solutions */
        else {
            /** Reassign options to updatedOptions */
            options = updatedOptions;
        }
        
        /** Count the iterations */
        iterations++;
    }
}

function randomRemove(inputPuzzle) {
    /** Create a copy of the puzzle */
    let puzzle = JSON.parse(JSON.stringify(inputPuzzle));

    /** Get the filled cells */
    const allCells = ALL_BLOCKS.flat();
    const allFilledCells = allCells.filter(cell => puzzle[cell[0]][cell[1]]);

    
    let workingFilledCells = JSON.parse(JSON.stringify(allFilledCells));

    /** Randomly check each filled cell to see if it can be removed */
    const removedCells = [];
    while (workingFilledCells.length > 0) {
        /** Select a random filled cell and remove it from filledCells */
        let randomIndex = Math.floor(Math.random() * workingFilledCells.length);
        const randomFilledCell = workingFilledCells.splice(randomIndex, 1)[0];

        /** Record the cells value */
        const randomFilledCellValue = puzzle[randomFilledCell[0]][randomFilledCell[1]];

        /** Remove the value from the puzzle */
        puzzle[randomFilledCell[0]][randomFilledCell[1]] = 0;

        /** If the puzzle does not have a unique solution */
        if (countSolutions(puzzle) !== 1) {
            /** Add the value back to the cell */
            puzzle[randomFilledCell[0]][randomFilledCell[1]] = randomFilledCellValue;
        }

        removedCells.push(randomFilledCell);
    }
    
    return puzzle;
}

// function buildAPuzzle() {
//     let puzzle = JSON.parse(JSON.stringify(BLANK_PUZZLE))
//     let emptyCells = getEmptyCells(puzzle);
//     let options = getOptions(puzzle);

//     let iterations = 0;
//     while (true) {
//         /** Random empty cell */
//         let randomIndex = Math.floor(Math.random() * emptyCells.length);
//         const randomCell = emptyCells.splice(randomIndex, 1)[0]; // Works like 
//                                                                  // list.pop(index)
//                                                                  // from Python

//         /** Random value from options */
//         const randomCellPossibilities = options[randomCell[0]][randomCell[1]];
//         randomIndex = Math.floor(Math.random() * randomCellPossibilities.length);
//         const randomValue = randomCellPossibilities.splice(randomIndex, 1)[0];

//         /** Update the puzzle */
//         puzzle[randomCell[0]][randomCell[1]] = randomValue;
//         let updatedOptions = updateOptions(randomCell[0], randomCell[1], randomValue, options);

//         /** If the puzzle has a unique solution, return it */
//         if (countSolutions(puzzle) == 1) {
//             console.log(`This puzzle took ${iterations} iterations to build.`);
//             return puzzle;
//         }

//         /** If the puzzle has no solutions, reverse the update */
//         if (countSolutions(puzzle) == 0) {
//             puzzle[randomCell[0]][randomCell[1]] = 0;
//             emptyCells.push(randomCell);
//         }

//         /** Otherwise, the puzzle has at least two solutions */
//         else {
//             /** Reassign options to updatedOptions */
//             options = updatedOptions;
//         }
        
//         /** Count the iterations */
//         iterations++;
//     }
// }
//#endregion

/** ******************************************
 * *******************************************
 * **************** Utility ******************
 * *******************************************
 * *******************************************
 */

// /** Converts a puzzle object from rows to blocks */
// function convertRowsToBlocks(puzzle) {
//     /** Puzzle to be returned */
//     const convertedPuzzle = {
//         block0: [],
//         block1: [],
//         block2: [],
//         block3: [],
//         block4: [],
//         block5: [],
//         block6: [],
//         block7: [],
//         block8: [],
//     }

//     /** Iterate through the rows to extract blocks */
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//             const rowNum = 3*i + j;
//             const row = puzzle[rowNum];
//             for (let k = 0; k < 3; k++) {
//                 const blockNum = 3*i + k;
//                 const block = convertedPuzzle[`block${blockNum}`];
//                 for (let l = 0; l < 3; l++) {
//                     const rowIndex = 3*k + l;
//                     const rowValue = row[rowIndex];
//                     block.push(rowValue);
//                 }
//             }
//         }
//     }

//     return convertedPuzzle;
// }