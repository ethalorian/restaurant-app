import { FaTwitter, FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { ThemeSwitcher } from './theme-switcher';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-20 lg:px-8">
        <div className="mt-10 flex justify-center space-x-10">
          <Link href="https://twitter.com/ethalorian" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <FaTwitter className="h-6 w-6" />
          </Link>
          <Link href="https://github.com/ethalorian" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">GitHub</span>
            <FaGithub className="h-6 w-6" />
          </Link>
        </div>

        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {currentYear} Ethalorian. All rights reserved. 
        </p>
        <div className="flex justify-center mt-4">
        <ThemeSwitcher/>
        </div>
      </div>
    </footer>
  );
}