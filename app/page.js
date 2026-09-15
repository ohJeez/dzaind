import LoadingScreen from "../components/LoadingScreen";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import PixelCursor from "../components/PixelCursor";
import About from "../components/About";
import Work from "../components/Work";
import Services from "../components/Services";
import Experimental from "../components/Experimental";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main id="top" className="page-shell">
      <LoadingScreen />
      <PageTransition />
      <PixelCursor />
      <Navbar />
      <Hero />
      <About />
      <Work />
      <Services />
      <Experimental />
      <Contact />
      <Footer />
    </main>
  );
}