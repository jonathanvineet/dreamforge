import { useReveal } from "@/hooks/use-reveal";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { BentoShowcase } from "@/components/BentoShowcase";
import { Categories } from "@/components/Categories";
import { Order } from "@/components/Order";
import { Footer } from "@/components/Footer";
import { CursorDot } from "@/components/CursorDot";
import { useEffect } from "react";

const Index = () => {
  useReveal();

  useEffect(() => {
    document.title = "Dream Forge — Crafting Ideas Into Reality";
    const desc = "Dream Forge is a refined 3D printing studio creating custom figures, decor, and prototypes for creators, students, and collectors.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); }
    m.setAttribute("content", desc);
  }, []);

  const handleGetQuote = () => {
    const orderElem = document.getElementById("order");
    if (orderElem) {
      orderElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <CursorDot />
      <Hero onGetQuote={handleGetQuote} />
      <About />
      <BentoShowcase />
      <Categories />
      <Order />
      <Footer />
    </main>
  );
};

export default Index;
