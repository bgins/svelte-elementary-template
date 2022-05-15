module.exports = {
  mode: "jit",
  purge: {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    options: {
      safelist: [/data-theme$/],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        dark: {
          primary: "#43919b",
          secondary: "#30aadd",
          accent: "#00ffc6",
          neutral: "#282828",
          "base-content": "#ffffff",
          "base-100": "#111111",
          "--rounded-box": "2",
          "--rounded-btn": "2",
          "--rounded-badge": "2",
          "--tab-radius": "2"
        },
        light : {
          primary: "#43919b",
          secondary: "#30aadd",
          accent: "#00ffc6",
          neutral: "#e5e5e5",
          "base-content": "#000000",
          "base-100": "#ffffff",
          "--rounded-box": "2",
          "--rounded-btn": "2",
          "--rounded-badge": "2",
          "--tab-radius": "2"
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: "dark",
  },
};