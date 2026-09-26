import { Ai } from "@/components/site/ai";
import { Features } from "@/components/site/features";
import { Closing, Footer } from "@/components/site/footer";
import { PageGuides, SectionRule } from "@/components/site/guides";
import { Hero } from "@/components/site/hero";
import { How } from "@/components/site/how";
import { Nav } from "@/components/site/nav";
import { Performance } from "@/components/site/performance";
import { Resilience } from "@/components/site/resilience";
import { Scale } from "@/components/site/scale";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { Who } from "@/components/site/who";

const sections = [Features, How, Performance, Resilience, Scale, Ai, Who, Closing];

export default function Home() {
  return (
    <div className="relative isolate pt-4">
      <ScrollProgress />
      <PageGuides />
      <Nav />
      <main>
        <Hero />
        {sections.map((Section, i) => (
          <div key={i}>
            <SectionRule />
            <Section />
          </div>
        ))}
      </main>
      <SectionRule />
      <Footer />
    </div>
  );
}
