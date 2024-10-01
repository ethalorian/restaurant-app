import Image from "next/image";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "./ui/drawer";
import { RestaurantCombobox } from "./restSearch";
import { DialogTitle, DialogDescription } from "./ui/dialog";
import Restaurants from "./restaurants";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl lg:text-8xl mb-2 md:mb-4">Looking for a Snack?</h1>
        <h4 className="text-base md:text-lg">Welcome to Food Finder! If you can't find it here you won't find it anywhere!</h4>
      </div>
      
      <Drawer>
        <DrawerTrigger asChild>
          <div className="cursor-pointer flex flex-col items-center">
            <Image
              src="/foodfinder.png"
              alt="food finder logo"
              priority
              width={600}
              height={600}
              className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto mt-4 md:mt-6"
            />
            <p className="text-lg md:text-xl lg:text-2xl font-medium text-center mt-4">
              <strong>CLICK ABOVE TO START</strong><br/>
            </p>
          </div>
        </DrawerTrigger>
        <DrawerContent className="h-[100dvh] w-full max-w-full">
        <ScrollArea className="h-full w-full">
          <div className="p-2 sm:p-4 flex flex-col items-center">
            <main className="w-full max-w-[90vw] sm:max-w-3xl">
              <div className="flex flex-col items-center text-center">
                <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold mb-2 mt-2">Partner Restaurants</DialogTitle>
                <div className="mt-2 sm:mt-4 w-full max-w-full sm:max-w-md">
                  <RestaurantCombobox />
                </div>
                <DialogDescription className="mb-2 sm:mb-4 mt-2 sm:mt-4 text-xs sm:text-sm md:text-base">
                  Search and select from our partner restaurants.
                </DialogDescription>
                
                <div className="mt-2 sm:mt-4 w-full">
                  <Restaurants />
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <DrawerClose asChild>
                  <Button variant="outline" size="sm">Close</Button>
                </DrawerClose>
              </div>
            </main>
          </div>
        </ScrollArea>
      </DrawerContent>
          
      </Drawer>
    </div>
  );
}