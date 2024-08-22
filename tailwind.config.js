/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'local-profile': "url('/img/localprofile.png')",
      },
    },
  },
  plugins: [],
}

