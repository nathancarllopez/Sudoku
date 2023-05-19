/** 
 * This code solves sudoku puzzles 
 * 
 * A puzzle is an object of arrays, with each array storing the valeus of one row:
 * examplePuzzle = {
 *  row0: [1,2,3,4,5,6,7,8,9],
 *  row1: [2,3,4,5,6,7,8,9,1],
 *  ...
 *  row8: [9,1,2,3,4,5,6,7,8],
 * }
 * 
 * A value of 1-9 means the cell is already filled with that value,
 * whereas a value of 0 designates an empty cell.
 * */

const TEST_PUZZLE_ROWS = {
    0: [8, 0, 0, 0, 5, 1, 7, 9, 0],
    1: [0, 0, 0, 0, 0, 0, 2, 0, 0],
    2: [2, 7, 1, 8, 9, 3, 4, 0, 0],
    3: [0, 6, 8, 7, 1, 2, 5, 0, 0],
    4: [4, 5, 0, 6, 3, 9, 0, 0, 7],
    5: [0, 1, 3, 0, 0, 4, 6, 2, 0],
    6: [3, 8, 0, 0, 0, 5, 1, 7, 0],
    7: [6, 9, 5, 1, 2, 0, 3, 4, 8],
    8: [0, 2, 0, 3, 4, 0, 9, 0, 6],
}

const ALL_BLOCKS = {
    block0: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],
    block1: [[0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5]],
    block2: [[0,6],[0,7],[0,8],[1,6],[1,7],[1,8],[2,6],[2,7],[2,8]],
    block3: [[3,0],[3,1],[3,2],[4,0],[4,1],[4,2],[5,0],[5,1],[5,2]],
    block4: [[3,3],[3,4],[3,5],[4,3],[4,4],[4,5],[5,3],[5,4],[5,5]],
    block5: [[3,6],[3,7],[3,8],[4,6],[4,7],[4,8],[5,6],[5,7],[5,8]],
    block6: [[6,0],[6,1],[6,2],[7,0],[7,1],[7,2],[8,0],[8,1],[8,2]],
    block7: [[6,3],[6,4],[6,5],[7,3],[7,4],[7,5],[8,3],[8,4],[8,5]],
    block8: [[6,6],[6,7],[6,8],[7,6],[7,7],[7,8],[8,6],[8,7],[8,8]],
}

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

function getOptions(puzzle) {
    /** Build an empty object based on the empty cells */
    const options = {};
    const emptyCells = getEmptyCells(puzzle);
    emptyCells.forEach(cell => {
        const rowNum = cell[0];
        const colNum = cell[1];
        rowNum in options ? options[rowNum][colNum] = [] : options[rowNum] = {[colNum]: []};
    });

    /** Fill dictionary */
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
        emptyCells.forEach(emptyCell => { // For each empty cell
            for (index = 0; index < eliminatedEmptyCells.length; index++) { // Look through the
                const eliminatedCell = eliminatedEmptyCells[index];         // eliminated cells
                if (eliminatedCell[0] == emptyCell[0] && eliminatedCell[1] == emptyCell[1]) break; // If you find a match, move onto the next empty cell
                if (index == eliminatedEmptyCells.length - 1) options[emptyCell[0]][emptyCell[1]].push(value); // If you didn't find a match, add value to options
            }
        });
    }
    return options;
}

function getSingleValueCells(options) {
    // /** Generate the options for the empty cells */
    // const options = getOptions(puzzle);

    /** Look through options to find cells that only have a single value */
    const singleValueCells = {};
    for (rowNum in options) {
        for (colNum in options[rowNum]) {
            const valueArray = options[rowNum][colNum];
            if (valueArray.length == 1) {
                const value = valueArray[0];
                rowNum in singleValueCells ? singleValueCells[rowNum][colNum] = value : singleValueCells[rowNum] = {[colNum]: value};
            }
        }
    }
    return singleValueCells;
}

function getLonelyValueCells(options) {
    /** Generate the options for the empty cells */
}

function updateOptions(valueRowNum, valueColNum, value, options) {
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

function fillSvAndLvCells(puzzle) {
    /** Generate the options for the empty cells */
    let options = getOptions(puzzle);

    /** Fill the single value cells */
    let singleValueCells = getSingleValueCells(options);
    while (Object.keys(singleValueCells).length > 0) {
        /** Fill all the single value cells */
        for (rowNum in singleValueCells) {
            for (colNum in singleValueCells[rowNum]) {
                const value = singleValueCells[rowNum][colNum];
                puzzle[rowNum][colNum] = value;
                options = updateOptions(rowNum, colNum, value, options);
            }
        }

        /** Generate the single value cells for the updated options */
        singleValueCells = getSingleValueCells(options);
    }

    return puzzle;
}

console.log(TEST_PUZZLE_ROWS);