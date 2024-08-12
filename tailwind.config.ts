import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "blue-1": "#0A065C",
        "blue-2": "#F5F7FB",
        "blue-3": "#04A1E3",
        "grey-1": "#737373",
        "grey-2": "#f0f0f0",
        "grey-3": "#8B8B8B",
        "red-1": "#FF5252",
        "purple-1": "#C6D4FF",
        "purple-2": "#4D426D",
        "green-1": "#13E0E0",
        "pink-1": "#FDDAD6",
      },
    },
  },
  plugins: [],
};

export default withUt(config);
