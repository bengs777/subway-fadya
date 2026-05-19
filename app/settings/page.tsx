import { PageBand } from "@/components/ui/Cards";

export default function SettingsPage() {
  return <PageBand title="Settings"><div className="glass rounded-lg p-6"><h2 className="text-xl font-black">Gameplay</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="flex items-center justify-between rounded-lg bg-white/5 p-4">Sound<input type="checkbox" defaultChecked /></label><label className="flex items-center justify-between rounded-lg bg-white/5 p-4">Particles<input type="checkbox" defaultChecked /></label></div></div></PageBand>;
}
