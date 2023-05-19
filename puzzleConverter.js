/** Here is where puzzles are converted from row-style to block-style */

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
            const row = puzzle[`row${rowNum}`];
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
