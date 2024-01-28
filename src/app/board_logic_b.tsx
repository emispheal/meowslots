

const TILE_WEIGHTS = {
    'L1' : 40,
    'L2' : 40,
    'L3' : 40,
    'L4' : 40,
    'H1' : 20,
    'J1' : 1,
    'W' : 50,
    'B' : 10
}

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

function weightedRandomSelection(itemsWithWeights: Object): string {
    // Extract items and weights from the itemsWithWeights object
    const items = Object.keys(itemsWithWeights);
    const weights = Object.values(itemsWithWeights);
  
    // Compute the cumulative weights
    const cumulativeWeights = [];
    let totalWeight = 0;
    for (const weight of weights) {
      totalWeight += weight;
      cumulativeWeights.push(totalWeight);
    }
  
    // Select a random value within the range of the total weight
    const randomValue = Math.random() * totalWeight;
  
    // Find the item that corresponds to the random value
    for (let i = 0; i < items.length; i++) {
      if (randomValue < cumulativeWeights[i]) {
        return items[i];
      }
    }
  
    // This line should never be reached if the weights are non-zero and the logic is correct
    throw new Error('Failed to select a random item based on weights.');
  }

  function spawnBoard(): string[][] {
    let board: string[][] = [];
    for (let i = 0; i < 3; i++) {
      let row: string[] = [];
      for (let j = 0; j < 3; j++) {
        row.push(weightedRandomSelection(TILE_WEIGHTS)); 
      }
      board.push(row);
    }
    return board;
  }

  function extractPayline(board: string[][], c1: [number, number], c2: [number, number], c3: [number, number]): string[] {
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
  
  // Example usage:
//   const board = spawnBoard();
//   console.log('Board:', board);

  console.log(calcPaylineMulti(['B', 'W', 'W']));

