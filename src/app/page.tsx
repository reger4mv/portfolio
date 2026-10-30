import { Cursor } from "@/components/cursor/Cursor";
import { Navigation } from "@/components/navigation/Navigation";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/projects/Work";
import { Playground } from "@/components/playground/Playground";
import { Skills } from "@/components/sections/Skills";
import { Creed } from "@/components/sections/Creed";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/footer/Footer";
import { SiteMotion } from "@/components/system/SiteMotion";

export default function HomePage() {
  return (
    <>
      <SiteMotion />
      <Cursor />
      <Navigation />

      <main id="main">
        <Hero />
        <About />
        <Work />
        <Playground />
        <Skills />
        <Creed />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
