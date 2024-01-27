
// Main Pixi canvas

'use client';

import { BlurFilter, TextStyle, Texture } from "pixi.js";
import { Stage, Container, Sprite, Text} from "@pixi/react";
import { useMemo } from "react";

import Board from './board';

import meowslots from './meowslots.png';

// lightblue: 0xadd8e6

export default function Pixi() {
    const blurFilter = useMemo(() => new BlurFilter(4), []);

    return (
      <Stage options={{ backgroundColor: 'black' }} width={800} height={600}>
        <Container x={400} y={50}>
          {/* <Text
            text="Meowslots"
            anchor={{ x: 0.5, y: 0.5 }}
            style={
              new TextStyle({
                fontSize: 100,
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fill: ["black", "white", "orange"],
                dropShadow: true,
                dropShadowColor: "#ccced2",
                stroke: 'gold',
                strokeThickness: 3,
              })
            }
          /> */}
          <Sprite image={meowslots.src} x={0} y={25} width={100} height={100} anchor={{x: 0.5, y: 0.5}} />
        </Container>
        <Board />
      </Stage>
    );
}