
// im going to couple the the board spawning with the board display logic
// along with the bonus spins or spins left logic.
// this component should only calc the payouts.


const PAYLINES: number[][][] = [
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
]

const BASE_MULTI = 0.25

const PAYOUTS : { [key: string]: { '2': number | string, '3': number | string } } = {
    'L1' : {'2' : BASE_MULTI, '3' : BASE_MULTI*2},
    'L2' : {'2' : BASE_MULTI, '3' : BASE_MULTI*2},
    'L3' : {'2' : BASE_MULTI, '3' : BASE_MULTI*2},
    'L4' : {'2' : BASE_MULTI, '3' : BASE_MULTI*2},
    'H1' : {'2' : BASE_MULTI*4, '3' : BASE_MULTI*8},
    'J1' : {'2' : BASE_MULTI*12, '3' : BASE_MULTI*16},
}

  function extractPayline(board: string[][], c1: number[], c2: number[], c3: number[]): string[] {
    const payline: string[] = [
      board[c1[0]][c1[1]],
      board[c2[0]][c2[1]],
      board[c3[0]][c3[1]]
    ];
    return payline;
  }

//   converted from python, prayge
  function calcPaylineMulti(payline: string[]): number | string {
    
    var count: { [key: string]: number } = payline.reduce((acc: { [key: string]: number }, symbol: string) => {
        acc[symbol] = (acc[symbol] || 0) + 1;
        return acc;
      }, {});
    
    const p0 = payline[0], p1 = payline[1], p2 = payline[2];
    const num_W = payline.filter(symbol => symbol === 'W').length;
  
    if (num_W === 3) {
      return 0;
    }
    if (p0 === p1 && p1 === p2 && p2 === 'B') {
      return '6B';
    }
    else if (p0 === p1 && p1 === 'B') {
      return '3B';
    }
    else if (num_W === 2) {
      for (const element in count) {
        if (count[element] === 1) {
          if (element === 'B') {
            return 0;
          }
          return PAYOUTS[element]['2'];
        }
      }
    }
    else if (num_W === 1) {
      for (const element in count) {
        if (count[element] === 2) {
          if (element === 'B') {
            return 0;
          }
          return PAYOUTS[element]['3'];
        }
      }
      if (p2 === 'W') {
        return 0;
      } else {
        const nonWSymbol = payline.find(symbol => symbol !== 'W');

        return nonWSymbol ? PAYOUTS[nonWSymbol]['2'] : 0;
      }
    }
    else {
      for (const element in count) {
        if (count[element] === 2 && p0 === p1 && p0 === element) {
          return PAYOUTS[element]['2'];
        } else if (count[element] === 3) {
          return PAYOUTS[element]['3'];
        }
      }
      return 0;
    }
    return 0;
  }

  export function calcBoardPayout(board: string[][]): any[] {
    let multi_results = [];
    for (const line of PAYLINES) {
      const [c1, c2, c3] = line;
      const line_result = extractPayline(board, c1, c2, c3);
      const multi_result = calcPaylineMulti(line_result);

      multi_results.push(multi_result);
    }

    return multi_results;
  }
  


  // Example usage:
//   const board = spawnBoard();
//   console.log('Board:', board);

  console.log(calcPaylineMulti(['W', 'B', 'L1']));

