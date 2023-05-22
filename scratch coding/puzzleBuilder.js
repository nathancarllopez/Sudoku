/** This code creates sudoku puzzles */

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
 * Finds up to solutions to the inputPuzzle, returning up to max of them.
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

function buildAPuzzle() {
    let puzzle = JSON.parse(JSON.stringify(BLANK_PUZZLE))
    let emptyCells = getEmptyCells(puzzle);

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

        /** If the puzzle has a unique solution, return it */
        if (countSolutions(puzzle) == 1) return puzzle;

        /** If the puzzle has no solutions, reverse the update */
        if (countSolutions(puzzle) == 0) {
            puzzle[randomCell[0]][randomCell[1]] = 0;
            emptyCells.push(randomCell);
        }

        iterations++;
        console.log(`iteration number ${iterations}`, puzzle);
    }
}
