import { green } from 'react-native-reanimated/lib/typescript/Colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
    
      content: ['./App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',],
    
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
        primary: '#14798B',
        background: '#F9FAFB',
        secondary: "#D9D9D9"
      },

      },
    },
    plugins: ["nativewind/babel"],
  }
