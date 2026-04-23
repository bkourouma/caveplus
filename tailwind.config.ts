import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        bordeaux: "#7B1E3A",
        cream: "#F7F2E9",
        charcoal: "#1F2937",
        ink: "#0B0B0B",
        mist: "#E8E4DB",
        success: "#2F855A",
        warning: "#C05621",
        error: "#9B2C2C"
      },
      fontFamily: {
        display: ["var(--font-outfit)"],
        body: ["var(--font-inter)"]
      },
      boxShadow: {
        soft: "0 16px 40px rgba(11, 11, 11, 0.08)"
      },
      backgroundImage: {
        velvet:
          "radial-gradient(circle at top, rgba(212,175,55,0.18), transparent 28%), linear-gradient(135deg, rgba(123,30,58,0.95), rgba(11,11,11,0.98))"
      }
    }
  },
  plugins: []
};

export default config;
