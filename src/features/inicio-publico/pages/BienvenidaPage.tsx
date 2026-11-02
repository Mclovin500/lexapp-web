import { HeroSection } from '../components/HeroSection'
import { HowItWorksSection } from '../components/HowItWorksSection'
import { ForClientsSection } from '../components/ForClientsSection'
import { ForLawyersSection } from '../components/ForLawyersSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { ClosingBanner } from '../components/ClosingBanner'

export function BienvenidaPage() {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />
      <HowItWorksSection />
      <ForClientsSection />
      <ForLawyersSection />
      <FeaturesSection />
      <ClosingBanner />
    </div>
  )
}
