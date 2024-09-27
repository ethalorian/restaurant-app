import Image from "next/image";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "./ui/drawer"; // Adjust the import path if needed
import { RestSearch } from "./restSearch";


export default function Header() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-6xl md:text-8xl lg:text-10xl mb-2 md:mb-4">Looking for a Snack?</h1>
          <h4 className="text-lg md:text-xl">Welcome to Food Finder! The only place to find what you are craving.</h4>
        </div>
      </div>
      
      {/* Drawer Trigger (image) */}
      <Drawer>
        <DrawerTrigger asChild>
          <Image
            src="/foodfinder.png"
            alt="food finder logo"
            width={400}
            height={400}
            className="w-full max-w-[300px] md:max-w-[400px] h-auto mt-4 md:mt-0 cursor-pointer"
          />
        </DrawerTrigger>
        <p className="text-2xl font-medium text-center justify-items-center">Click on the<br/> 
        <strong>MAGNIFYING GLASS ABOVE</strong><br/>
        to Check out a list of our partner restaurants.</p>

        {/* Drawer Content */}
        <DrawerContent className="h-[50vh]"> {/* Adjust the height to 50% of the viewport height */}
          <DrawerClose className="absolute right-4 top-4">Close</DrawerClose>
          <div className="p-4 ml-20">
            <h2 className="text-xl font-semibold">Drawer Content</h2>
            <RestSearch />
          </div>
        </DrawerContent>
      </Drawer>

      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-2" />
    </div>
    
  );
}
