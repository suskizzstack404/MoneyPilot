import GlassCard from '../../components/GlassCard'
import VoiceAssistantWidget from '../../components/voice/VoiceAssistantWidget'
import AIInsightsPanel from '../../components/dashboard/AIInsightsPanel'
import { ErrorState } from '../../components/dashboard/StateViews'
import { useDashboardDataContext } from '../../contexts/DashboardDataContext'
import { generateInsights } from '../../utils/insights'

export default function AIAssistantPage() {
  const { transactions, subscriptions, error, refetch } = useDashboardDataContext()

  if (error) return <ErrorState message={error} onRetry={refetch} />

  const insights = generateInsights(transactions, subscriptions)

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink-100 font-display">AI Assistant</h1>
        <p className="text-sm text-ink-500 mt-1">
          Talk to MoneyPilot, and see what it's noticed about your spending.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <VoiceAssistantWidget />
        </div>
        <div className="lg:col-span-2">
          <GlassCard className="p-5 sm:p-6 h-full">
            <p className="text-sm font-semibold text-ink-100 mb-4">Insights</p>
            <AIInsightsPanel insights={insights} />
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
