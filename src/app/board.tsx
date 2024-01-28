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

import React from 'react';
import { BlurFilter, TextStyle, Texture, Graphics } from "pixi.js";
import { Stage, Container, Sprite, Text, useTick} from "@pixi/react";

export default function Board() {


    const blurFilter = React.useMemo(() => {
        return new BlurFilter(10);
      }, []);
    
    const [tickCount, setTickCount] = React.useState(0);

    useTick(delta => {
        // setTickCount((oldTickCount) => oldTickCount + 25);
    })

    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(250, 200, 200, 300); // Set the mask's size to match the container's
    mask.endFill();

    return (
      <React.Fragment>
        <Container x={300} y={200} mask={mask}>
          {Object.entries(cats).map(([key, catImage], index) => (
            <Sprite
              key={index}
              image={catImage.src}
              width={100}
              height={100}
              x={0}
              y={(0 + index * 100 + tickCount) % 800}
              anchor={{ x: 0.5, y: 0.5 }}
              onclick={() => console.log(Object.entries(cats).forEach(i => console.log(i[1])))}
            />
          ))}
        </Container>
        <Container x={400} y={200}>
          {Object.entries(cats).map(([key, catImage], index) => (
            <Sprite
              key={index}
              image={catImage.src}
              width={100}
              height={100}
              x={0}
              y={(0 + index * 100 + tickCount) % 800}
              anchor={{ x: 0.5, y: 0.5 }}
            />
          ))}
        </Container>
        <Container x={500} y={200}>
          {Object.entries(cats).map(([key, catImage], index) => (
            <Sprite
              key={index}
              image={catImage.src}
              width={100}
              height={100}
              x={0}
              y={(0 + index * 100 + tickCount) % 800}
              anchor={{ x: 0.5, y: 0.5 }}
            />
          ))}
        </Container>
      </React.Fragment>
    );
}