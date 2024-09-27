import Image from "next/image";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "./ui/drawer";
import { RestaurantCombobox } from "./restSearch";
import { DialogTitle, DialogDescription } from "./ui/dialog";

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

        <DrawerContent className="h-[80vh] sm:h-[50vh]">
          <div className="p-4 relative">
            <DialogTitle className="text-2xl font-bold mb-2">Partner Restaurants</DialogTitle>
            <DialogDescription className="mb-4">Search and select from our partner restaurants.</DialogDescription>
            <DrawerClose className="absolute right-4 top-4 px-2 py-1 bg-gray-200 rounded">Close</DrawerClose>
            <div className="mt-6">
              <RestaurantCombobox />
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-2" />
    </div>
  );
}