/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",   // 🔥 viktig
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        Primary: "#111111",
        Secondary: "#666666",
        Background: "FFFFFF",
        Surface: "#F7F7F7",
        accent: "FF4C3B",
        Border: "#EEEEEE",
      }
    },
  },
  plugins: [],
}