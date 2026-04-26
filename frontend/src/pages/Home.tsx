import { Nav } from '../components/landing/Nav';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Capabilities } from '../components/landing/Capabilities';
import { SampleReport } from '../components/landing/SampleReport';
import { Voices } from '../components/landing/Voices';
import { FAQ } from '../components/landing/FAQ';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export default function Home() {
  return (
    <main className="grain min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <HowItWorks />
      <Capabilities />
      <SampleReport />
      <Voices />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
