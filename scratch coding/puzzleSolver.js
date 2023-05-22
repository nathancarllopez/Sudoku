/** 
 * This code solves sudoku puzzles 
 * 
 * A puzzle is an object of arrays, with each array storing the values of one row:
 * examplePuzzle = {
 *  0: [1,2,3,4,5,6,7,8,9],
 *  1: [2,3,4,5,6,7,8,9,1],
 *  ...
 *  8: [9,1,2,3,4,5,6,7,8],
 * }
 * 
 * A value of 1-9 means the cell is already filled with that value,
 * whereas a value of 0 designates an empty cell.
 * */

const TEST_PUZZLE_ROWS = {
    0: [2,4,0,9,0,0,5,0,1],
    1: [0,8,9,0,1,0,0,0,0],
    2: [5,1,0,4,0,0,0,0,0],
    3: [4,0,0,0,0,0,8,0,0],
    4: [0,0,6,0,0,0,4,0,0],
    5: [8,2,0,0,0,0,3,5,0],
    6: [0,0,0,0,6,0,0,9,4],
    7: [0,0,0,2,0,0,0,8,0],
    8: [3,0,0,8,0,0,6,0,0],
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

/**
 * Hard coded access to the block positions of a puzzle
 */
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
     * row- and column-numbers to eliminate
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

console.log("input", TEST_PUZZLE_ROWS)
console.log("solution", solvePuzzle(TEST_PUZZLE_ROWS));