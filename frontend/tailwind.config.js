/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
      extend: {
        fontFamily: {
          pthin: ["Poppins-Thin", "sans-serif"],
          pextralight: ["Poppins-ExtraLight", "sans-serif"],
          plight: ["Poppins-Light", "sans-serif"],
          pregular: ["Poppins-Regular", "sans-serif"],
          pmedium: ["Poppins-Medium", "sans-serif"],
          psemibold: ["Poppins-SemiBold", "sans-serif"],
          pbold: ["Poppins-Bold", "sans-serif"],
          pextrabold: ["Poppins-ExtraBold", "sans-serif"],
          pblack: ["Poppins-Black", "sans-serif"],
          pmediumitalic: ["Poppins-MediumItalic", "sans-serif"],
          psemibolditalic: ["Poppins-SemiBoldItalic", "sans-serif"],
          pbolditalic: ["Poppins-BoldItalic", "sans-serif"],
        },
        colors: {
          rose: '#fad0c4',
          blush: '#fde2e4',
      },
      },
    },
  plugins: [],
};
