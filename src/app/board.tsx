// 3 reel 8 cats
// I don't know how slots work so this is a rough sketch
// as long as there's a negative payout no engagement optimisations necessary :^)


// dark modal overlay when paying out

// add sounds idk

// make trees for payout probs

// draw lines through the model when paying out

// legend
// cat000 = standard 
// cat 001 = standard
// cat 002 = standard
// cat 003 = standard
// cat 004 = better
// cat 005 = jackpot
// cat 006 = wildcard
// cat 007 = bonus game

import cat0 from "../sprites/cat000.png";
import cat1 from "../sprites/cat001.png";
import cat2 from "../sprites/cat002.png";
import cat3 from "../sprites/cat003.png";
import cat4 from "../sprites/cat004.png";
import cat5 from "../sprites/cat005.png";
import cat6 from "../sprites/cat006.png";
import cat7 from "../sprites/cat007.png";
// {Object.entries(cats).map(([key, entry], index) => <Sprite key={index} image={entry.src} x={0} y={0} anchor={{ x: 0.5, y: 0.5 }}/>  )}   
const cats = {cat0, cat1, cat2, cat3, cat4, cat5, cat6, cat7}

import React, { useState } from 'react';
import { BlurFilter, TextStyle, Texture, Graphics, ColorMatrixFilter } from "pixi.js";
import { Stage, Container, Sprite, Text, useTick} from "@pixi/react";
import { StaticImageData } from "next/image";

import SpinButton from "./SpinButton";

// import { calcBoardPayout } from "./board_logic_b";



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

import spindown from '../sprites/spindown.jpg';
import spinup from '../sprites/spinup.jpg'; 
import redline from '../sprites/redline.jpg';
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
      try {
        if (nonWSymbol === 'B') {
          return 0;
        }
        return nonWSymbol ? PAYOUTS[nonWSymbol]['2'] : 0;
      } catch {
        console.log('ERROR:', nonWSymbol, payline);
        return 0;
      }
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





const TILE_TO_CAT : {[key: string]: StaticImageData} = {
  'L1' : cat0,
  'L2' : cat1,
  'L3' : cat2,
  'L4' : cat3,
  'H1' : cat4,
  'J1' : cat5,
  'W' : cat6,
  'B' : cat7
}

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

const BETS = [1, 5, 10, 20, 50]

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

function spawnBoard(reel_num: number, reel_height: number): string[][] {
  let board: string[][] = [];
  for (let i = 0; i < reel_num; i++) {
    let row: string[] = [];
    for (let j = 0; j < reel_height; j++) {
      row.push(weightedRandomSelection(TILE_WEIGHTS)); 
    }
    board.push(row);
  }
  return board;
}


export default function Board(props: any) {

  const [tickCount, setTickCount] = React.useState(0);
  const [animDelay, setAnimDelay] = React.useState(1000);

  const [isAnimating, setIsAnimating] = React.useState(false);

  const [spinInProgress, setSpinInProgress] = React.useState(false);

  const [curBetIdx, setCurBetIdx] = React.useState(0);
  const [balance, setBalance] = React.useState(1000);
  const [spinsLeft, setSpinsleft] = React.useState(0);

  const [spinSprite, setSpinSprite] = React.useState(spinup);

  // the full reel will be 11 symbols long, when a new outcome board is spawned
  // it will be added to the top, the next spin will land on this new board 
    const [fullReel, setFullReel] = React.useState(spawnBoard(3, 11));

    const [board, setBoard] = React.useState(spawnBoard(3, 3));

    const replaceBoard = () => {
      setBoard(spawnBoard(3,3));
      setFullReel((prevFullReel) => {
        return [
          board[0].concat(prevFullReel[0].slice(3)),
          board[1].concat(prevFullReel[1].slice(3)),
          board[2].concat(prevFullReel[2].slice(3))
        ]
      })
    }

    const blurFilter = React.useMemo(() => {
        return new BlurFilter(10);
      }, []);

      const colorMatrixFilter = React.useMemo(() => {
        let colorMatrix = new ColorMatrixFilter();
        colorMatrix.contrast(0.5, true);
        return colorMatrix;
      }, []);
    
    function calcBoardPayout(board: string[][]): any[] {
      let multi_results = [];
      console.log('board', board);
      let idx = 0;
      setWonLines([false, false, false, false, false]);
      for (const line of PAYLINES) {
        const [c1, c2, c3] = line;
        const line_result = extractPayline(board, c1, c2, c3);
        const multi_result = calcPaylineMulti(line_result);
        console.log(line_result, multi_result);
    
        multi_results.push(multi_result);
        if (multi_result !== 0) {
          console.log('idx', idx);
          ((currentIndex) => { // Immediately-invoked function to capture current index
            setWonLines((prevWonLines) => {
              console.log('prev', prevWonLines);
              const newWonLines = [...prevWonLines];
              newWonLines[currentIndex] = true;
              console.log('new', newWonLines);
              return newWonLines;
            });
          })(idx);
        } else {
          ((currentIndex) => { // Immediately-invoked function to capture current index
            setWonLines((prevWonLines) => {
              console.log('prev', prevWonLines);
              const newWonLines = [...prevWonLines];
              newWonLines[currentIndex] = false;
              console.log('new', newWonLines);
              return newWonLines;
            });
          })(idx);
        }
        console.log('final res', wonLines);
        idx += 1
      }
    
      return multi_results;
    }

    const [topAlpha, setTopAlpha] = useState(0.0)
    const [midAlpha, setMidAlpha] = useState(0.0)
    const [botAlpha, setBotAlpha] = useState(0.0)
    const [D1Alpha, setD1Alpha] = useState(0.0)
    const [D2Alpha, setD2Alpha] = useState(0.0)

    const [lineCountAnim, setLineCountAnim] = useState(0)

    const [wonLines, setWonLines] = useState([false, false, false, false, false]);

    const animateLines = () => {
      setLineCountAnim(1000);
    }

    useTick(delta => {
      console.log('ticking')
      if (spinsLeft > 0) {
        if (isAnimating) {
          // do nothing
        } else {
          replaceBoard();
          animateBoard();
          const multi_results = calcBoardPayout(board);
          console.log('multi res here', multi_results)
          for (let i = 0; i < multi_results.length; i++) {
            let multi_result = multi_results[i];
            console.log(multi_result, 'wtf');
            if (multi_result === "6B") {
              setSpinsleft((prevSpinsLeft) => prevSpinsLeft + 6);
            } else if (multi_result === "3B") {
              setSpinsleft((prevSpinsLeft) => prevSpinsLeft + 3);
            } else if (typeof multi_result === "number") {
              // Check if it's a number before multiplying
              setBalance((prevBalance) => prevBalance + (multi_result * BETS[curBetIdx]));
            }
          }
          setSpinsleft((prevSpinsLeft) => prevSpinsLeft - 1);
        }
        
      } else {
        setSpinInProgress(false);
      }

        if (tickCount > 0) {
          // just kinda hardcode animations
          setTickCount((oldTickCount) => oldTickCount - 50);
        } else if (tickCount == 0 && isAnimating) {
          // do a delay and then unlock
          if (animDelay > 0) {
            setAnimDelay((oldAnimDelay) => oldAnimDelay - 10);
            if (lineCountAnim <= 0) {
              animateLines();
            }
          } else {
            setIsAnimating(false);
            setAnimDelay(1000);
          }
        }

        if (lineCountAnim > 0) {
          if (wonLines[0]) {
            setTopAlpha((topAlpha) => (topAlpha + 0.1) % 1);
          }
          if (wonLines[1]) {
            setMidAlpha((midAlpha) => (midAlpha + 0.1) % 1);
          }
          if (wonLines[2]) {
            setBotAlpha((botAlpha) => (botAlpha + 0.1) % 1);
          }
          if (wonLines[3]) {
            setD1Alpha((D1Alpha) => (D1Alpha + 0.1) % 1);
          }
          if (wonLines[4]) {
            setD2Alpha((D2Alpha) => (D2Alpha + 0.1) % 1);
          }
          setLineCountAnim((oldLineCountAnim) => oldLineCountAnim - 10);
          
        } else {
          setTopAlpha(0.0);
          setMidAlpha(0.0);
          setBotAlpha(0.0);
          setD1Alpha(0.0);
          setD2Alpha(0.0);
        
        }
    })

    const animateBoard = () => {
      // setIsAnimating(true);
      // redundant modulos fix later TODO: 
      if (!isAnimating) {
        setIsAnimating(true);
        setTickCount((oldTickCount) => (oldTickCount + 5500));
      }
    }

    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(250, 150, 500, 300); // Set the mask's size to match the container's
    mask.endFill();

    return (
      <React.Fragment>
        
        
        <Container x={300} y={200} mask={mask}>
          {/* refactor this into a component later maybe */}
          {fullReel[0].map((symbol, index) => (
            <Sprite
              key={index}
              image={TILE_TO_CAT[symbol].src}
              width={100}
              height={100}
              x={0}
              y={(0 + index * 100 + tickCount) % 1100}
              anchor={{ x: 0.5, y: 0.5 }}
              interactive={true}
              onclick={() => animateBoard()}
              onpointerdown={() => console.log(props.spins)}
            />
          ))}
          
        </Container>
        <Container x={400} y={200} mask={mask}>
          {/* refactor this into a component later maybe */}
          {fullReel[1].map((symbol, index) => (
            <Sprite
              key={index}
              image={TILE_TO_CAT[symbol].src}
              width={100}
              height={100}
              x={0}
              y={(0 + index * 100 + tickCount) % 1100}
              anchor={{ x: 0.5, y: 0.5 }}
              interactive={true}
              onclick={() => animateBoard()}
              onpointerdown={() => console.log(props.spins)}
            />
          ))}
        </Container>
        <Container x={500} y={200} mask={mask}>
          {/* refactor this into a component later maybe */}
          {fullReel[2].map((symbol, index) => (
            <Sprite
              key={index}
              image={TILE_TO_CAT[symbol].src}
              width={100}
              height={100}
              x={0}
              y={(0 + index * 100 + tickCount) % 1100}
              anchor={{ x: 0.5, y: 0.5 }}
              interactive={true}
              onclick={() => animateBoard()}
              onpointerdown={() => console.log(props.spins)}
            />
          ))}
        </Container>
        <Container x={100} y={200}>
          <Text
            text="do spin"
            interactive={true}
            onclick={() => {
              console.log("meant to spin");
              if (!isAnimating) {
                animateBoard();
              }
            }}
            style={
              new TextStyle({
                fontSize: 20,
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fill: ["black", "white", "orange"],
                dropShadow: true,
                dropShadowDistance: 2,
                dropShadowAlpha: 0.5,
                dropShadowColor: "#ccced2",
                stroke: "gold",
                strokeThickness: 3,
              })
            }
          />
          <Text
            text="do replace"
            interactive={true}
            onclick={() => {
              console.log("meant to replace");
              replaceBoard();
            }}
            y={100}
            style={
              new TextStyle({
                fontSize: 20,
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fill: ["black", "white", "orange"],
                dropShadow: true,
                dropShadowDistance: 2,
                dropShadowAlpha: 0.5,
                dropShadowColor: "#ccced2",
                stroke: "gold",
                strokeThickness: 3,
              })
            }
          />
        </Container>
        {/* This should contain all the UI buttons, should rly be in a sibling component tho TODO: */}
        <Container x={600} y={100}>
          <Sprite
              image={spinSprite.src}
              width={200}
              height={100}
              x={150}
              y={150}
              anchor={{ x: 0.5, y: 0.5 }}
              interactive={true}
              onclick={() => {
                if (!spinInProgress) {
                  console.log("clicked spin");
                  setSpinInProgress(true);
                  setBalance((prevBalance) => prevBalance - BETS[curBetIdx]);
                  setSpinsleft(1);
                }
                
              }}
              onpointerdown={() => setSpinSprite(spindown)}
              onpointerup={() => setSpinSprite(spinup)}
            />
          

          <Text
            text={`Current Bet: \$${BETS[curBetIdx]}`}
            interactive={true}
            onclick={() => {
              console.log("clicked bet");
            }}
            x={50}
            y={48}
            style={
              new TextStyle({
                fontSize: 30,
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fill: ["pink", "white", "pink"],
                dropShadow: true,
                dropShadowDistance: 2,
                dropShadowAlpha: 0.5,
                dropShadowColor: "#ccced2",
                stroke: "red",
                strokeThickness: 3,
              })
            }
          />
          <Text
            text={`<`}
            interactive={true}
            onclick={() => {
              console.log("clicked small arr");
              if (!spinInProgress) {
                setCurBetIdx(
                  (prevBetIdx) => (prevBetIdx - 1 + 5) % BETS.length
                );
              }
            }}
            y={20}
            style={
              new TextStyle({
                fontSize: 80,
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fill: ["gray", "white", "gray"],
                dropShadow: true,
                dropShadowDistance: 2,
                dropShadowAlpha: 0.5,
                dropShadowColor: "#ccced2",
                stroke: "red",
                strokeThickness: 3,
              })
            }
          />
          <Text
            text={`>`}
            interactive={true}
            onclick={() => {
              console.log("clicked large arr");
              if (!spinInProgress) {
                setCurBetIdx((prevBetIdx) => (prevBetIdx + 1) % BETS.length);
              }
            }}
            x={250}
            y={20}
            style={
              new TextStyle({
                fontSize: 80,
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fill: ["gray", "white", "gray"],
                dropShadow: true,
                dropShadowDistance: 2,
                dropShadowAlpha: 0.5,
                dropShadowColor: "#ccced2",
                stroke: "red",
                strokeThickness: 3,
              })
            }
          />
          <Text
            text={`Total Balance: \$${balance}`}
            x={0}
            y={0}
            style={
              new TextStyle({
                fontSize: 35,
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fill: ["gray", "white", "gray"],
                dropShadow: true,
                dropShadowDistance: 2,
                dropShadowAlpha: 0.5,
                dropShadowColor: "#ccced2",
                stroke: "red",
                strokeThickness: 3,
              })
            }
          />
        </Container>
        <Sprite
          image={redline.src}
          x={400}
          width={250}
          y={200}
          alpha={topAlpha}
          anchor={{ x: 0.5, y: 0.5 }}
        />
        <Sprite
          image={redline.src}
          x={400}
          width={250}
          y={300}
          alpha={midAlpha}
          anchor={{ x: 0.5, y: 0.5 }}
        />
        <Sprite
          image={redline.src}
          x={400}
          width={250}
          y={400}
          alpha={botAlpha}
          anchor={{ x: 0.5, y: 0.5 }}
        />
        <Sprite
          image={redline.src}
          x={400}
          width={300}
          y={300}
          rotation={Math.PI / 4}
          alpha={D1Alpha}
          anchor={{ x: 0.5, y: 0.5 }}
        />
        <Sprite
          image={redline.src}
          x={400}
          width={300}
          y={300}
          rotation={Math.PI * 3 / 4 }
          alpha={D2Alpha}
          anchor={{ x: 0.5, y: 0.5 }}
        />
      </React.Fragment>
    );
}