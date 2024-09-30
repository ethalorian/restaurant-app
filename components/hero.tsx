import Image from "next/image";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "./ui/drawer";
import { RestaurantCombobox } from "./restSearch";
import { DialogTitle, DialogDescription } from "./ui/dialog";
import Restaurants from "./restaurants";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl mb-2 md:mb-4">Looking for a Snack?</h1>
          <h4 className="text-base md:text-lg">Welcome to Food Finder! The only place to find what you are craving.</h4>
        </div>
      </div>
      
      <Drawer>
        <DrawerTrigger asChild>
          <div className="cursor-pointer">
            <Image
              src="/foodfinder.png"
              alt="food finder logo"
              priority
              width={400}
              height={400}
              className="w-full max-w-[300px] md:max-w-[400px] h-auto mt-4 md:mt-0"
            />
            <p className="text-lg md:text-xl font-medium text-center mt-2">
              <strong>OPEN SEARCH</strong><br/>
            </p>
          </div>
        </DrawerTrigger>

          <DrawerContent className="h-[80vh] sm:h-[80vh]">
            <div className="p-4 relative">
              <main className="grid grid-cols-6 gap-4 md:gap-5 px-[5px] md:px-4">
                {/* Empty column 1 */}
                <div className="col-span-1"></div>
                
                {/* Center content in columns 2-5 */}
                <div className="col-span-4 flex flex-col items-center text-center">
                  <DialogTitle className="text-2xl font-bold mb-2 mt-2">Partner Restaurants</DialogTitle>
                  <div className="mt-6 w-full">
                    <RestaurantCombobox />
                  </div>
                  <DialogDescription className="mb-4 mt-4">Search and select from our partner restaurants.</DialogDescription>
                  
                  <div className="mt-4 w-full">
                    <Restaurants />
                  </div>
                </div>
                
                {/* Close button in column 6 */}
                <div className="hidden sm:flex col-span-1 justify-end items-start mr-5">
                  <DrawerClose asChild>
                    <Button variant="outline" size="sm">Close</Button>
                  </DrawerClose>
                </div>
              </main>
            </div>
          </DrawerContent>
      </Drawer>

      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-2" />
    </div>
  );
}