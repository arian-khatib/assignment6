/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.ejs`], // all .ejs files
  theme: {
    extend: {},
  
  },
  plugins: [
    require('daisyui'), // Adds DaisyUI components
    require('@tailwindcss/typography'), // Adds typography enhancements
  ],
  daisyui: {
    themes: ["fantasy"], // This is an example; adjust the theme as needed
  },
}
