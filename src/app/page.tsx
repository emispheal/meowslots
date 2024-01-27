"use client";

import dynamic from "next/dynamic";

const PixiComponentWithNoSSR = dynamic(
  () => import('./pixi'),
  { ssr: false }
);

export default function Home() {

  return (
    <PixiComponentWithNoSSR />
  );
}
