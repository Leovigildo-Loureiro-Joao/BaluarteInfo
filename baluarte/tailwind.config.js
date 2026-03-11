// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // 🎨 CORES - Mantendo as que definiu
      colors: {
        primary: {
          DEFAULT: "#CB2020",
          light: "#E64D4D",
          dark: "#A01A1A",
          shadow: "#540000",
        },
        secondary: {
          DEFAULT: "#F6F6F6",
          dark: "#E0E0E0",
        },
        accent: {
          DEFAULT: "#FFFFFF",
        },
        text: {
          primary: "#333333",    // Texto principal mais escuro
          secondary: "#757575",   // Seu tom original
          light: "#999999",
          white: "#FFFFFF",
        },
        background: {
          DEFAULT: "#FFFFFF",
          light: "#F6F6F6",      // sua min-white
          dark: "#F0F0F0",
        },
        status: {
          success: "#27AE60",
          warning: "#E67E22",
          error: "#CB2020",
          info: "#2C3E50",
        }
      },

      // 📝 FONTES
      fontFamily: {
        sans: ["Roboto", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Roboto", "Georgia", "serif"],
        heading: ["Roboto", "sans-serif"], // Para títulos
        body: ["Roboto", "sans-serif"],    // Para corpo de texto
      },

      // 📏 TIPOGRAFIA - Sistema consistente
      fontSize: {
        // Base: 16px (1rem = 16px)
        "xs": ["0.68rem", { lineHeight: "0.92rem" }],     // 10.9px
        "sm": ["0.78rem", { lineHeight: "1.1rem" }],      // 12.5px
        "base": ["0.9rem", { lineHeight: "1.3rem" }],     // 14.4px
        "lg": ["1rem", { lineHeight: "1.45rem" }],        // 16px
        "xl": ["1.1rem", { lineHeight: "1.55rem" }],      // 17.6px
        "2xl": ["1.3rem", { lineHeight: "1.8rem" }],      // 20.8px
        "3xl": ["1.6rem", { lineHeight: "2rem" }],        // 25.6px
        "4xl": ["1.85rem", { lineHeight: "2.2rem" }],     // 29.6px
        "5xl": ["2.4rem", { lineHeight: "1" }],           // 38.4px
        "6xl": ["2.95rem", { lineHeight: "1" }],          // 47.2px
        
        // Mantendo suas definições customizadas
        "title-min-white": "2.5rem",      // 40px
        "title-min-white-2": "1.5rem",    // 24px
        "h1-big": "3rem",                  // 48px
        "subtitle": "2rem",                // 32px
        "li-nav": "1.45rem",                // 23.2px
        "h1-title": "2.4rem",              // 38.4px
        "h2-title": "1.45rem",               // 23.2px
        "h2-title-big": "1.6rem",            // 25.6px
        "text-pargh": "1.15rem",             // 18.4px
      },

      // 🎯 ESPAÇAMENTO - Sistema consistente
      spacing: {
        '0': '0px',
        'px': '1px',
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',      // 4px
        '1.5': '0.375rem',   // 6px
        '2': '0.5rem',       // 8px
        '2.5': '0.625rem',   // 10px
        '3': '0.75rem',      // 12px
        '3.5': '0.875rem',   // 14px
        '4': '1rem',         // 16px
        '5': '1.25rem',      // 20px
        '6': '1.5rem',       // 24px
        '7': '1.75rem',      // 28px
        '8': '2rem',         // 32px
        '9': '2.25rem',      // 36px
        '10': '2.5rem',      // 40px
        '11': '2.75rem',     // 44px
        '12': '3rem',        // 48px
        '14': '3.5rem',      // 56px
        '16': '4rem',        // 64px
        '20': '5rem',        // 80px
        '24': '6rem',        // 96px
        '28': '7rem',        // 112px
        '32': '8rem',        // 128px
      },

      // 🔲 BORDAS
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',     // 2px
        'base': '0.25rem',    // 4px
        'md': '0.375rem',     // 6px
        'lg': '0.5rem',       // 8px
        'xl': '0.75rem',      // 12px
        '2xl': '1rem',        // 16px
        '3xl': '1.5rem',      // 24px
        'full': '9999px',
        'input': '10px',      // Seu inputRectangle
        'button': '10px',      // Seu buttonRectangle
      },

      // 📦 SOMBRAS
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'base': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'sombra-vermelha': '0px 0px 20px 0px #540000',
        'none': 'none',
      },

      // 🖼️ BACKGROUND IMAGES
      backgroundImage: {
        'fundo-baluarte': "url('/src/assets/rectangle.jpg')",
        'footer': "url('/src/assets/wave.svg')",
        'missao-visao': "url('/src/assets/bottom.svg')",
        'gradient-primary': 'linear-gradient(135deg, #CB2020 0%, #540000 100%)',
        'gradient-light': 'linear-gradient(135deg, #F6F6F6 0%, #FFFFFF 100%)',
      },

      // 📱 BREAKPOINTS (já existentes no Tailwind)
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      // ⏱️ ANIMAÇÕES
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },

      // 📏 LARGURAS/ALTURAS CUSTOMIZADAS
      width: {
        'input': '400px',
      },
      height: {
        'input': '50px',
      },
    },
  },
  plugins: [],
}
