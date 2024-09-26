import Hero from "@/components/hero";
import Restaurants from "@/components/restaurants";

export default async function Index() {
  return (
    <>
      <Hero />
      <main className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 px-[5px] md:px-4">
        {/* Empty column 1 */}
        <div className="hidden md:block md:col-span-1"></div>
        
        {/* Restaurants component takes up columns 2-5 on md screens */}
        <div className="col-span-1 md:col-start-2 md:col-span-4 px-10 md:px-0">
          <Restaurants />
        </div>
        
        {/* Empty column 6 */}
        <div className="hidden md:block md:col-span-1"></div>
      </main>
    </>
  );
}