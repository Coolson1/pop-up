import { db } from "@/lib/notifier";
import { MenuCard } from "@/components/MenuCard";
import { Cart } from "@/components/Cart";
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
        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 border border-amber-100">
            <h1 className="text-4xl font-bold text-amber-800 mb-4">No Menu Published Yet</h1>
            <p className="text-lg text-amber-600">Check back soon! Our chef is preparing something delicious.</p>
          </div>
        </main>
      </>
    );
  }

  const now = new Date();
  const cutoff = new Date(menu.cutoff_at);

  if (now > cutoff) {
    const { data: items } = await db
      .from("menu_items")
      .select("id, name, price_cents")
      .eq("menu_id", menu.id)
      .eq("available", true)
      .order("name");

    return (
      <>
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-[1fr_340px] gap-8">
          <section>
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-amber-800 mb-3 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                Today&apos;s Menu
              </h1>
              <p className="text-lg text-amber-600 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Orders close at{" "}
                {cutoff.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </header>
            <div className="grid sm:grid-cols-2 gap-5">
              {items?.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </section>
          <Cart />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 inline-block">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Closed for Today</h1>
          <p className="text-lg text-gray-600">Check back tomorrow for fresh offerings!</p>
          <p className="text-sm text-gray-400 mt-4">We&apos;ll be serving again at 9:00 AM</p>
        </div>
      </main>
    </>
  );
}