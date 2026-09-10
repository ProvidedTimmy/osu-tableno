import { Head } from "$fresh/runtime.ts";
import type { JSX } from "preact/jsx-runtime";
import CalculatorPage from "../components/CalculatorPage.tsx";

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>osu!tableno</title>
        <meta name="description" content="Calculate tablet dimensions for osu! with a 4:3 area ratio." />
      </Head>
      <CalculatorPage />
    </>
  );
}
