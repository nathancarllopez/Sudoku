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

const TEST_PUZZLE = {
    row0: [8, 0, 0, 0, 5, 1, 7, 9, 0],
    row1: [0, 0, 0, 0, 0, 0, 2, 0, 0],
    row2: [2, 7, 1, 8, 9, 3, 4, 0, 0],
    row3: [0, 6, 8, 7, 1, 2, 5, 0, 0],
    row4: [4, 5, 0, 6, 3, 9, 0, 0, 7],
    row5: [0, 1, 3, 0, 0, 4, 6, 2, 0],
    row6: [3, 8, 0, 0, 0, 5, 1, 7, 0],
    row7: [6, 9, 5, 1, 2, 0, 3, 4, 8],
    row8: [0, 2, 0, 3, 4, 0, 9, 0, 6],
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
        const row = puzzle[`row${rowNum}`];
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
        rowNum in options ? options.rowNum.colNum = [] : options.rowNum = {colNum: []};
    });

    /** Fill dictionary */
    for (let value of [1,2,3,4,5,6,7,8,9]) {
        const eliminatedEmptyCells = new Set();
        for (let [valueRowNum, valueColNum] of getCellsWithValue(puzzle, value)) {
            /** Eliminate empties from row valueRowNum */
            for (let colNum = 0; colNum < 9; colNum++) {
                const cellValue = puzzle[`row${valueRowNum}`][colNum];
                if (!cellValue) eliminatedEmptyCells.add([valueRowNum, colNum]);
            }
            /** Eliminate empties from col valueColNum */
            for (let rowNum = 0; rowNum < 9; rowNum++) {
                const cellValue = puzzle[`row${rowNum}`][valueColNum];
                if (!cellValue) eliminatedEmptyCells.add([rowNum, valueColNum]);
            }
            /** Eliminate empties from the block containing the cell valueRowNum, valueColNum */
            for (let blockNum = 0; blockNum < 9; blockNum++) {
                const block = ALL_BLOCKS[`block${blockNum}`]
                if (block.includes([valueRowNum, valueColNum])) {
                    for (let [rowNum, colNum] of block) {
                        const cellValue = puzzle[`row${rowNum}`][colNum];
                        if (!cellValue) eliminatedEmptyCells.add([rowNum, colNum]);
                    }
                }
            }
        }
        /** Add value to options at all empty cells that have not been eliminated */
        emptyCells.forEach(cell => {
            if (!eliminatedEmptyCells.includes(cell)) options.rowNum.colNum.push(value);
        });
    }
    return options;
}