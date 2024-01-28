
// This file generates the board's output - the final outcome - based on given probabiltiies
// Multi wins/outcomes to be implemented soonTM

import React from 'react';

const REEL_NUM = 3
const REEL_HEIGHT = 3

const outcomeProbabilities= [
    { name: 'doubleLow', probability: '0.125' },
    { name: 'tripleLow', probability: '0.125' },
    { name: 'nothing', probability: '0.42' },
    { name: 'doubleHigh', probability: '0.15' },
    { name: 'tripleHigh', probability: '0.1' },
    { name: 'doubleJackpot', probability: '0.02' },
    { name: 'tripleJackpot', probability: '0.001' },
    { name: 'threeBonus', probability: '0.045' },
    { name: 'sixBonus', probability: '0.005' },
];

function pickWeightedOutcome(outcomes: any) {
  const totalWeight = outcomes.reduce(
    (total: any, outcome: any) => total + outcome.probability,
    0
  );
  let random = Math.random() * totalWeight;
  for (let i = 0; i < outcomes.length; i++) {
    if (random < outcomes[i].probability) {
      return outcomes[i].name;
    }
    random -= outcomes[i].probability;
  }
}

/**
 * Generates a random integer between the specified minimum and maximum values.
 *
 * @param {number} min - the minimum value for the random integer
 * @param {number} max - the maximum value for the random integer
 * @return {number} the generated random integer
 */
function getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
  
// TODO: enum/symlink the types lol
function generateArrays(n: number, num: number, win: boolean) {

    // fudge wildcard xd
    const wildcardProb = [
        { name: true, probability: '0.1' },
        { name: false, probability: '0.9' },
    ];
    
    let gennedArrays: number[][] = [[], [], []];

    for (let i = 0; i < n; i++) {
        if (pickWeightedOutcome(wildcardProb) === true && i === 2) {
            gennedArrays[i].push(6); 
        } else {
            gennedArrays[i].push(num);
        }
    }

    var excludedNumbers = [num, 6];

    function getRandomNumberNotInExcluded(rangeStart: number, rangeEnd: number, excludedNumbers: number[]): number {

        const availableNumbers = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, index) => index + rangeStart)
                                      .filter(n => !excludedNumbers.includes(n));
      
        if (availableNumbers.length === 0) {
          throw new Error('No available numbers that are not excluded.');
        }
      
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        return availableNumbers[randomIndex];
      }

      for (let i = 0; i < REEL_NUM; i++) {
            while (gennedArrays[i].length < REEL_HEIGHT) {
                let pickedNum = getRandomNumberNotInExcluded(0, 7, excludedNumbers);
                gennedArrays[i].push(pickedNum);
                
          }
      }
      
      // Example usage:
    //   const excludedNumbers = [2, 3, 5]; // Numbers to exclude
    //   const randomNum = getRandomNumberNotInExcluded(1, 10, excludedNumbers);
    //   console.log('Random Number:', randomNum);

    //   DeepShuffle arrays



    return gennedArrays;
}


// TODO: fix typescript types later if i have time
export default function BoardLogic(props: any) {

    console.log(props);
    // do paylines later, just go for any consecutive from first = win/match
    // A, B, C, D, 2, 4, W, B
    // Wildcard doesnt work with bonus
    // i only need to care about winning slots, populate the rest with useless tiles that cannot win, apply wildcards after the fact
    // TODO: animation continuity from previous slot
    // LETTER, LETTER = 0.25
    // LETTER, LETTER, LETTER = 0.5
    // 2, 2 = 1
    // 2, 2, 2 = 2
    // 4, 4 = 16
    // 4, 4, 4 = 64
    // B, B = 3 spins
    // B, B, B = 6 spin
    // only one outcome at a time, i just want an MVP ;-
    // idk distribution wanted, just give whatever false win rate, volatility idk sim it out check median later
    // 0.25 : 12.5% 
    // 0.5 : 12.5% 
    // 0 : 42%
    // 1 : 15%
    // 2: 10%
    // 16: 2%
    // 64: 0.1%
    // 3 spins ~ : 4.5% chance
    // 6 spins ~ : 0.5% chance
    // x=(0.25*0.125)+(0.5*0.125)+(0*0.42)+(1*0.15)+(2*0.1)+(16*0.02)+(64*0.001)+(3*x*0.045)+(6*x*0.005)
    // x approx 0.991317
    // RTP - 99.1317%

    const [outcome, setOutcome] = React.useState(null);

    const handlePickOutcome = () => {
        const pickedOutcome = pickWeightedOutcome(outcomeProbabilities);
        setOutcome(pickedOutcome);
      };

    if (outcome == null)
    {
      return;
    }

    switch (outcome) {
        case 'doubleLow':
            const randomInteger: number = getRandomInteger(0, 3)
            


            break;
        case 'tripleLow':
            // Handle tripleLow outcome
            break;
        case 'nothing':
            // Handle nothing outcome
            break;
        case 'doubleHigh':
            // Handle doubleHigh outcome
            break;
        case 'tripleHigh':
            // Handle tripleHigh outcome
            break;
        case 'doubleJackpot':
            // Handle doubleJackpot outcome
            break;
        case 'tripleJackpot':
            // Handle tripleJackpot outcome
            break;
        case 'twoBonus':
            // gives 3 bonus spins
            break;
        case 'threeBonus':
            // gives 6 bonus spins
            break;
        default:
            // Handle unknown or default outcome
            break;

    }


    
    props.setFinalBoard([])

    




}