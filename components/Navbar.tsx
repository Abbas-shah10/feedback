"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  console.log("hello from client components");
  return (
    <nav className="bg-neutral-900 text-white px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <div className="text-xl font-bold tracking-wide">DevBrand</div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-8 font-medium">
          <Link
            href="/"
            className={`${pathname ? "text-emerald-400" : ""} hover:text-emerald-200 transition-colors`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-emerald-400 transition-colors"
          >
            About
          </Link>
          <Link
            href="/services"
            className="hover:text-emerald-400 transition-colors"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="hover:text-emerald-400 transition-colors"
          >
            Contact
          </Link>
        </ul>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md hover:bg-neutral-800 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg
            className="h-6 width-6 fill-none stroke-current"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              // Close "X" Icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger Menu Icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Responsive Dropdown Drawer */}
      {isOpen && (
        <div className="md:hidden mt-4 border-t border-neutral-800 pt-4">
          <ul className="flex flex-col space-y-3 px-2 font-medium">
            <li>
              <a
                href="#home"
                className="block py-2 hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="block py-2 hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="block py-2 hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block py-2 hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
