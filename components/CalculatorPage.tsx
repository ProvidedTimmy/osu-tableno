import type { JSX } from "preact";
import TabletCalculator from "./TabletCalculator.tsx";

export default function CalculatorPage(): JSX.Element {
  return (
    <main class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-start justify-center px-[12px] py-6 sm:py-10">
      <div class="bg-white dark:bg-gray-800 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)] rounded-lg p-[16px] sm:p-6 w-full max-w-[560px]">
        <div class="flex flex-wrap justify-between items-start gap-4 mb-6">
          <h1 class="min-w-0 flex-1 basis-64 break-words text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
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
