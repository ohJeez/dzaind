import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";

export const metadata = {
  title: "DZAIND — LIVE TO TELL THE TALE",
  description:
    "DZAIND is a creative digital studio focused on identities, digital experiences, motion, and experimental development.",
  keywords: [
    "DZAIND",
    "creative studio",
    "brand identity",
    "digital experiences",
    "motion design",
    "experimental development",
  ],
  openGraph: {
    title: "DZAIND — LIVE TO TELL THE TALE",
    description: "DZAIND is a creative digital studio crafting cinematic identities and digital experiences.",
    type: "website",
    url: "https://dzaind.studio",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
