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
    0: [2,0,7,9,0,0,0,6,0],
    1: [0,0,0,7,0,0,0,5,0],
    2: [0,6,9,2,0,4,8,0,0],
    3: [0,1,0,0,0,0,0,0,0],
    4: [0,0,8,0,0,0,0,9,4],
    5: [0,0,0,0,0,0,0,0,0],
    6: [0,0,2,4,0,9,1,0,8],
    7: [7,0,0,0,0,1,0,2,9],
    8: [0,0,0,0,0,7,5,0,0],
}

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

            /** If there is only one cell collected, add it to lonelyValueCells */
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

function updateOptions(valueRowNum, valueColNum, value, options) {
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

function fillSvCells(puzzle, options) {
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

        /** Generate the single value cells with the updated options */
        singleValueCells = getSingleValueCells(options);
    }

    return [puzzle, options];
}

function fillLvAndSvCells(puzzle, options) {
    /** Fill any single value cells */
    [puzzle, options] = fillSvCells(puzzle, options);

    /** Generate the lonely value cells */
    let lonelyValueCells = getLonelyValueCells(options);

    /** Alternate filling lonely and single value cells until none of either remain */
    while(Object.keys(lonelyValueCells).length > 0) {
        /** Fill the lonely value cells */
        for (rowNum in lonelyValueCells) {
            for (colNum in lonelyValueCells[rowNum]) {
                const value = lonelyValueCells[rowNum][colNum];
                puzzle[rowNum][colNum] = value;
                options = updateOptions(rowNum, colNum, value, options);
            }
        }

        /** Fill any single value cells */
        let singleValueCells = getSingleValueCells(options);
        if (Object.keys(singleValueCells).length > 0) [puzzle, options] = fillSvCells(puzzle, options);

        /** Generate the lonely value cells with the updated options */
        lonelyValueCells = getLonelyValueCells(options);
    }
    
    return puzzle;
}

function checkForContradiction(puzzle, options) {
    /** Initialize a boolean to return */
    let contradiction = false;

    /** Look through empty cells and check if options has an empty array */
    for (let [rowNum, colNum] of getEmptyCells(puzzle)) {
        if (options[rowNum][colNum] === []) contradiction = true;
    }

    return contradiction;
}

function buildGuessStack(puzzle, options) {
    /** Initialize variables */
    let guess = [];
    let numberOfPossibilities = 10;

    /** Find the first cell with the smallest number of options */
    for (rowNum in options) {
        for (colNum in options[rowNum]) {
            const possibilites = options[rowNum][colNum];
            if (possibilites.length < numberOfPossibilities) {
                guess = [rowNum, colNum, possibilites];
                numberOfPossibilities = possibilites.length;
            }
        }
    }

    /** Relabel the elements of guess */
    const guessRow = guess[0];
    const guessCol = guess[1];
    const guessPossibilities = guess[2];

    /** Create the guess stack */
    const guessStack = [];
    for (value of guessPossibilities) {
        let duplicatePuzzle = JSON.parse(JSON.stringify(puzzle));
        duplicatePuzzle[guessRow][guessCol] = value;
        let duplicateOptions = getOptions(duplicatePuzzle);
        duplicatePuzzle = fillLvAndSvCells(duplicatePuzzle, duplicateOptions);
        guessStack.push(duplicatePuzzle);
    }

    return guessStack;
}

function solvePuzzle(inputPuzzle) {
    /** Make a copy of the puzzle to work with */
    let puzzle = JSON.parse(JSON.stringify(inputPuzzle));

    /** Generate options and fill single value and lonely value cells */
    let options = getOptions(puzzle);
    puzzle = fillLvAndSvCells(puzzle, options);

    /** If the puzzle has no empty cells, return it */
    let emptyCount = getEmptyCells(puzzle).length;
    if (emptyCount == 0) return puzzle;

    /** Regenerate options and build the guess stack */
    options = getOptions(puzzle);
    let guessStack = buildGuessStack(puzzle, options);

    /** While there are empty cells */
    while (emptyCount > 0) {
        /** Take the top puzzle off the stack and see how many empty cells it has */
        puzzle = guessStack.pop();
        emptyCount = getEmptyCells(puzzle).length;

        /** If there are no empty cells, return the puzzle */
        if (emptyCount == 0) return puzzle;

        /** Otherwise, check the puzzle for a contradiction */
        options = getOptions(puzzle);
        if (!checkForContradiction(puzzle, options)) {
            const puzzleChildren = buildGuessStack(puzzle, options);
            puzzleChildren.forEach(kid => guessStack.push(kid));
        }
    }
}