import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        kreova: {
          bg: "#05070D",
          surface: "#0B0F1A",
          card: "#101528",
          border: "#1F2740",
          accent: "#4CC9F0",
          accent2: "#7C5CFF",
          muted: "#8B93A7",
        },
        // Palet khusus untuk halaman Public Digital Profile ("/u/[username]") —
        // warm ivory + espresso, terpisah dari tema dashboard/login/register.
        identity: {
          bg: "#F8F6F2",
          primary: "#3A2E27",
          secondary: "#E9E1D8",
          accent: "#8B735F",
        },
      },
      backgroundImage: {
        "kreova-gradient": "linear-gradient(135deg, #4CC9F0 0%, #7C5CFF 100%)",
        "kreova-radial":
          "radial-gradient(circle at 20% -10%, rgba(76,201,240,0.18), transparent 40%), radial-gradient(circle at 100% 0%, rgba(124,92,255,0.15), transparent 45%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
