import Hero from "@/components/hero";
import Restaurants from "@/components/restaurants";

export default async function Index() {
  return (
    <>
      <Hero />
      <main className="grid grid-cols-1 md:grid-cols-6 gap-4 px-4">
        {/* Restaurants component takes 2/3 width on non-md screens and starts in column 1 */}
        <div className="col-span-1 md:col-span-3">
          <Restaurants />
        </div>
        {/* You can add other content in the remaining 1/3 space if needed */}
        <div className="col-span-1">
          {/* Additional content can go here */}
        </div>
      </main>
    </>
  );
}