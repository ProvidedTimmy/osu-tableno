import type { Config } from "tailwindcss";

export default {
  content: [
    "{pages,components}/**/*.{ts,tsx}",
  ],
  darkMode: "media",
} satisfies Config;
