/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./build/index.html", "../node_modules/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}

