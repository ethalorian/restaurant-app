import Hero from "@/components/hero";
import Restaurants from "@/components/restaurants";

export default async function Index() {
  return (
    <>
      <Hero />
      <main className="grid grid-rows-[auto_1fr] grid-cols-1 md:grid-cols-3 gap-4 px-4">
        {/* Hero spans full width in the first row */}
        <div className="col-span-1 md:col-span-3">
          <Restaurants />
        </div>
      </main>
    </>
  );
}
