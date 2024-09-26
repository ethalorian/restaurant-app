import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-col md:flex-row gap-4 items-center">  
        <div className="flex flex-col items-center justify-center text-center">  
          <h1 className="text-6xl md:text-8xl lg:text-10xl mb-2 md:mb-4">Looking for a Snack?</h1>
          <h4 className="text-lg md:text-xl">Welcome to Food Finder! The only place to find what you are craving.</h4>
        </div>
      </div>
      <Image
          src="/foodfinder.png"
          alt="food finder logo"
          width={400}
          height={400}
          className="w-full max-w-[300px] md:max-w-[400px] h-auto mt-4 md:mt-0"
        />
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-2" />
    </div>
  );
}
