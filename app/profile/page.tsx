import { PageBand } from "@/components/ui/Cards";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  return <PageBand title="Profile"><div className="glass grid gap-5 rounded-lg p-6 md:grid-cols-[180px_1fr]"><div className="grid h-40 w-40 place-items-center rounded-lg bg-cyan-300/10 text-5xl font-black">{user?.username?.[0]?.toUpperCase()}</div><div><h2 className="text-3xl font-black">{user?.username}</h2><p className="mt-2 text-slate-300">{user?.email}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-white/5 p-4">Coins: <b>{user?.coins}</b></div><div className="rounded-lg bg-white/5 p-4">Highscore: <b>{user?.highscore}</b></div></div><form action="/api/player/avatar" method="post" encType="multipart/form-data" className="mt-5"><input name="avatar" type="file" accept="image/png,image/jpeg,image/webp" className="text-sm" /><button className="game-button ml-3 px-4">Upload Avatar</button></form></div></div></PageBand>;
}
