import { Hero } from "@/components/sections/Hero";
import { Bento } from "@/components/sections/Bento";
import { About } from "@/components/sections/About";
import { Marquee } from "@/components/sections/Marquee";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShaderBackground } from "@/components/ShaderBackground";
import { SectionDivider, ScrollProgress } from "@/components/SectionDivider";
import { ScrollFrame, DataStream } from "@/components/ScrollFrame";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ShaderBackground />
      <ScrollProgress />
      <DataStream side="left" />
      <DataStream side="right" />

      <div
        className="relative min-h-screen text-foreground selection:bg-primary/30 selection:text-primary"
        style={{ zIndex: 2 }}
      >
        <Navbar />
        <main id="main-content">
          <Hero />

          <SectionDivider label="highlights" index="// 00" />

          <ScrollFrame label="// HIGHLIGHTS" className="mx-6 lg:mx-16 rounded-xl">
            <Bento />
          </ScrollFrame>

          <Marquee />

          <SectionDivider label="about" index="// 01" />

          <ScrollFrame label="// ABOUT_ME" className="mx-6 lg:mx-16 rounded-xl">
            <About />
          </ScrollFrame>

          <SectionDivider label="skills" index="// 02" />

          <ScrollFrame label="// ARSENAL" className="mx-6 lg:mx-16 rounded-xl">
            <Skills />
          </ScrollFrame>

          <SectionDivider label="projects" index="// 03" />

          <ScrollFrame label="// PROJECTS" className="mx-6 lg:mx-16 rounded-xl">
            <Projects />
          </ScrollFrame>

          <SectionDivider label="experience" index="// 04" />

          <ScrollFrame label="// EXPERIENCE" className="mx-6 lg:mx-16 rounded-xl">
            <Experience />
          </ScrollFrame>

          <SectionDivider label="writing" index="// 05" />

          <ScrollFrame label="// BLOG" className="mx-6 lg:mx-16 rounded-xl">
            <Blog />
          </ScrollFrame>

          <SectionDivider label="contact" index="// 06" />

          <ScrollFrame label="// CONTACT" className="mx-6 lg:mx-16 rounded-xl">
            <Contact />
          </ScrollFrame>
        </main>
        <Footer />
      </div>
    </>
  );
}
