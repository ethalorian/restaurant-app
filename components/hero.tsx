import Image from "next/image";
export default function Header() {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex flex-row gap-1">  
        <div className="flex flex-col items-center justify-center">  
          <h1 className="text-8xl text-center mb-4">Looking for a Snack?</h1>
          <h4 className="text-xl text-center">Welcome to Food Finder! The only place to find what you are craving.</h4>
        </div>
        <Image
            src="/foodfinder.png"
            alt="food finder logo"
            width={400}
            height={400}
          />
      </div>
      
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-2" />
    </div>
  );
}
