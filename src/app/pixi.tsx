
// Main Pixi Canvas

'use client';

import { Stage, Container, Sprite, Text} from "@pixi/react";
import { useState } from "react";
import Board from './board';
import meowslots from './meowslots.png';
import winmultis from '../sprites/winmultis.jpg';

export default function Pixi() {

    return (
      <Stage options={{ backgroundColor: "black" }} width={1200} height={700}>
        <Container x={400} y={50}>
          <Sprite
            image={meowslots.src}
            x={0}
            y={25}
            width={100}
            height={100}
            anchor={{ x: 0.5, y: 0.5 }}
            interactive={true}
          />
        </Container>

        <Board />

        <Sprite
          image={winmultis.src}
          x={400}
          y={600}
          width={600}
          height={200}
          anchor={{ x: 0.5, y: 0.5 }}
        />
        
      </Stage>
    );
}