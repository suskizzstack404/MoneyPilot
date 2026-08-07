import VoiceOrb from '../VoiceOrb'

export default function SessionLoader() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <VoiceOrb size="lg" listening={false} />
        <p className="text-sm text-ink-500">Checking your session…</p>
      </div>
    </div>
  )
}
