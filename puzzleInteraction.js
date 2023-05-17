/** Create and display a puzzle with interactive buttons */

/** The div that contains the whole puzzle */
const puzzle = document.querySelector('#puzzle');

/** There are 9 blocks in the whole puzzle, and each block contains 9 cells */
function createPuzzle() {
    for (let i = 0; i < 9; i++) {
        /** Create 9 blocks */
        const block = document.createElement('div');
        block.setAttribute('id', 'block');

        for (let j = 0; j < 9; j++) {
            /** Create 9 cells for each block */
            const cell = document.createElement('div');
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
                subCell.addEventListener('click', () => {
                    subCell.removeEventListener('mouseenter', subCellFill);
                    subCell.removeEventListener('mouseleave', subCellDefault);
                    subCell.setAttribute('id', 'filled-sub-cell');
                });

                /** Add each sub-cell to its cell */
                cell.appendChild(subCell);
            }

            /** Add each cell to its block */
            block.appendChild(cell);
        }

        /** Add each block to puzzle */
        puzzle.appendChild(block);
    }
}

/** Event listener functions */

function subCellFill(event) {
    const subCell = event.target;
    subCell.setAttribute('id', 'filled-sub-cell');
}

function subCellDefault(event) {
    const subCell = event.target;
    subCell.setAttribute('id', 'sub-cell');
}

function clickSubCell(subCell) {

}