import { db } from "@/lib/notifier";
import { MenuCard } from "@/components/MenuCard";
import { Navbar } from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function Page() {
  const today = new Date().toISOString().slice(0, 10);

  const { data: menu } = await db
    .from("menus")
    .select("id, cutoff_at")
    .eq("served_on", today)
    .maybeSingle();

  if (!menu) {
    return (
      <>
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-16">
          <div className="rounded-[2rem] bg-white/90 border border-gray-100 shadow-2xl p-10">
            <h1 className="text-5xl font-black text-gray-900 mb-6">Menu Coming Soon</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our pop-up kitchen is working on a fresh selection for today. Check back shortly for delicious dishes and handcrafted flavors.
            </p>
          </div>
        </main>
      </>
    );
  }

  const now = new Date();
  const cutoff = new Date(menu.cutoff_at);

  if (now < cutoff) {
    const { data: items } = await db
      .from("menu_items")
      .select("id, name, price_cents")
      .eq("menu_id", menu.id)
      .eq("available", true)
      .order("name");

    return (
      <>
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-10 lg:py-14">
          <section className="rounded-[2rem] bg-white/95 border border-gray-100 shadow-2xl p-8 mb-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-3">Today&apos;s Menu</p>
                <h1 className="text-5xl font-black text-gray-900 tracking-tight max-w-2xl">
                  Fresh flavors served daily from our pop-up kitchen.
                </h1>
              </div>
              <div className="rounded-3xl bg-amber-50 border border-amber-100 px-6 py-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Orders close at</p>
                <p className="text-2xl font-black text-amber-900 mt-2">
                  {cutoff.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {items?.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="rounded-[2rem] bg-white/95 border border-gray-100 shadow-2xl p-12 text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-5">Closed for Today</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            We&apos;re taking a short break to prepare something exceptional. Please come back soon for the next fresh menu.
          </p>
          <p className="mt-6 text-sm text-gray-400">We&apos;ll be serving again at 9:00 AM.</p>
        </div>
      </main>
    </>
  );
}
