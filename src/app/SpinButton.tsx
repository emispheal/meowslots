
import { TextStyle } from 'pixi.js';
import { Graphics, Text, Sprite } from '@pixi/react';
import { useCallback, useState } from 'react';
import React from 'react';

import spindown from '../sprites/spindown.jpg';
import spinup from '../sprites/spinup.jpg'; 

export default function SpinButton({name, x, y, onClick}: {name: string, x: number, y: number, onClick: Function}) {

    const draw = useCallback((g: any) => {
        g.lineStyle(2, 0x0000ff, 1);
        g.beginFill(0xff00bb, 0.25);
        g.drawRoundedRect(0, 0, 100, 25, 15);
        g.endFill();
      }, []);

    const [spinSprite, setSpinSprite] = useState(spinup);

    return (
        <React.Fragment>
        {/* <Graphics draw={draw} x={x} y={y}/>
        <Text
            text={name}
            interactive={true}
            onclick={() => {
              console.log("meant to ...");
            }}
            x = {x}
            y = {y}
            style={
              new TextStyle({
                fontSize: 20,
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fill: ["black", "white", "orange"],
                dropShadow: true,
                dropShadowDistance: 2,
                dropShadowAlpha: 0.5,
                dropShadowColor: "#ccced2",
                stroke: 'gold',
                strokeThickness: 3,
              })
            }
          /> */}
          <Sprite
              image={spinSprite.src}
              width={200}
              height={100}
              x={x}
              y={x}
              anchor={{ x: 0.5, y: 0.5 }}
              interactive={true}
              onclick={() => onClick()}
              onpointerdown={() => setSpinSprite(spindown)}
              onpointerup={() => setSpinSprite(spinup)}
            />

          </React.Fragment>
    );
}