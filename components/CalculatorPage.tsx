import type { JSX } from "preact";
import TabletCalculator from "./TabletCalculator.tsx";

export default function CalculatorPage(): JSX.Element {
  return (
    <main class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)] rounded-lg p-6 w-full max-w-[480px]">
        <div class="flex justify-between items-start gap-4 mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            osu! Tablet Area Calculator
          </h1>
          <a
            href="https://github.com/ProvidedTimmy/osu-tableno"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 underline py-1"
          >
            GitHub
          </a>
        </div>
        <TabletCalculator />
      </div>
    </main>
  );
}
