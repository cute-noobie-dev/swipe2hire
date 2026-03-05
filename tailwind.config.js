/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          blue:   "#2563EB",
          violet: "#9333EA",
          bg:     "#0C0C14",
          surface:"#13131F",
          card:   "#1A1A2E",
          border: "#2A2A40",
          muted:  "#6B7280",
        },
      },
      boxShadow: {
        card: "0 4px 32px rgba(37, 99, 235, 0.12)",
        glow: "0 0 40px rgba(37, 99, 235, 0.25)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
}
