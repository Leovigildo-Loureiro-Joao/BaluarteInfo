module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#CB2020",
        secondary: "#F6F6F6",
        accent: "white",
        "text": "#757575",
        "min-white": "#F6F6F6",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        serif: ["Roboto", "serif"],

      },backgroundImage: {
        'fundo-baluarte': "url('../assets/rectangle.jpg')",
        'footer': "url('../assets/wave.svg')",
        'missao-visao': "url('../assets/bottom.svg')",
      },backgroundColor:{
        'sombra-vermelha': "#540000",
      },fontSize:{
        'title-min-white': "2.5rem",
        'title-min-white-2': "1.5rem",
        'h1-Big': "3rem",
        'subtitle': "2rem",
        'li-nav': "1.4rem",
        'h1-title': "2.5rem",
        'h2-title': "1.5rem",
        'h2-title-big': "1.8rem",
        'text-pargh': "1.3rem",
        'html-size': "62.5%",
      },boxShadow:{
        'sombra-vermelha': "0px 0px 20px 0px #540000",
      },borderRadius:{
        'inputRectangle': "10px 10px 10px 10px",
        'buttonRectangle': "10px 10px 10px 10px",
      },padding:{
        'inputRectangle': "20px",
      },height:{
        'inputRectangle': "50px",
      },width:{
        'inputRectangle': "400px",
      },margin:{
        'inputRectangle': "20px",
      },

    },
  },
  plugins: [],
}