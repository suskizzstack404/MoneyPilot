import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../sections/Hero'
import TrustedBy from '../sections/TrustedBy'
import Features from '../sections/Features'
import DashboardShowcase from '../sections/DashboardShowcase'
import HowItWorks from '../sections/HowItWorks'
import AIAssistant from '../sections/AIAssistant'
import Pricing from '../sections/Pricing'
import FAQ from '../sections/FAQ'
import FinalCTA from '../sections/FinalCTA'

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-canvas font-body">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <DashboardShowcase />
        <HowItWorks />
        <AIAssistant />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
