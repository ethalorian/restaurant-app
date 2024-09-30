import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import { ShoppingCartProvider } from "@/contexts/ShoppingCartContext";
import { Toaster } from "@/components/ui/toaster";




const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";



export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Food Finder",
  description: "The place where you find your food!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > 
          
            <ShoppingCartProvider>
                <main className="min-h-screen flex flex-col items-center">
                  <div className="flex-1 w-full flex flex-col gap-5 items-center">
                    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                        <div className="flex gap-2 items-center font-semibold">
                          <Image
                            src="/foodfinder.png"
                            alt="Food Finder Logo"
                            width={35}
                            height={35}
                          />
                          <Link href={"/"} className='text-l'>Food Finder</Link>
                        </div>
                        <HeaderAuth />
                      </div>
                    </nav>
                    <div className="flex flex-col gap-5 max-w-5xl p-5">
                      {children}
                    </div>
                    <Toaster/>

                    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xl gap-8 py-16">
                      <p>
                        ethalorian
                      </p>
                      <ThemeSwitcher />
                    </footer>
                  </div>
                </main>
              </ShoppingCartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
