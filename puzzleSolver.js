/** Here is where the logic to solve a puzzle will be stored */


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

const TEST_PUZZLE_ROWS = {
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

/** Converts a puzzle object from rows to blocks */
function convertRowsToBlocks(puzzle) {
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
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const row = puzzle[`row${3*i+j}`];
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    const value = row[3*k + l];
                    console.log(value);
                }
            }
        }
    }
}