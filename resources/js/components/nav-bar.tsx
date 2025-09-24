import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { LogoLink } from '@/components/logo-link';
import { useSearchStore } from "@/stores/useSearchStore";
import { SpinnerCircle } from "@/components/ui/spinner-circle"; 
import { AnimatePresence, motion } from "framer-motion";
import { router } from '@inertiajs/react';
import { Menu, X } from "lucide-react"; // for hamburger icons

interface NavBarProps {
  onSearch?: (results: any[]) => void;
}

export const Navbar: React.FC<NavBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("colorado");
  const results = useSearchStore((state) => state.results);
  const setResults = useSearchStore((state) => state.setResults);
  const loading = useSearchStore((state) => state.loading);
  const setLoading = useSearchStore((state) => state.setLoading);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isDark, setIsDark] = useState<boolean>(
    () => localStorage.theme === "dark"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔹 Debounced fetch
  const fetchMarkets = useRef(
    debounce(async (search: string) => {
      if (!search) {
        setResults({ items: [] });
        return;
      }

      setLoading(true);

      try {
        const res = await axios.get(
          `/api/markets?query=${encodeURIComponent(search)}`
        );
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400)
  ).current;

  useEffect(() => {
    fetchMarkets(searchQuery);
    return () => fetchMarkets.cancel();
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

return (
  <nav className="bg-white dark:bg-[#121212] shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        {/* Logo */}
        <div className="flex-shrink-0 text-xl font-bold text-blue-600 dark:text-blue-400">
          <LogoLink />
        </div>

        {/* Hamburger (mobile only) */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Nav + Search */}
        <div className="hidden justify-center lg:flex lg:items-center lg:space-x-6 w-full ml-6">
          {/* Search Bar */}
          <div ref={wrapperRef} className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-900
                placeholder-gray-400 focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:border-blue-500
                dark:bg-[#121212] dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
            />

            {/* Desktop Suggestions */}
            {showSuggestions &&
              results &&
              "items" in results &&
              results.items.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                    rounded-md shadow-lg max-h-60 overflow-y-auto z-50 w-full"
                >
                  {results.items.map((item: any) => (
                    <li
                      key={item.parcl_id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setShowSuggestions(false);
                        setLoading(true);
                        router.visit(`/markets/${item.parcl_id}`);
                        setLoading(false);
                      }}
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {item.region}, {item.state_abbreviation}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}

            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <SpinnerCircle />
              </div>
            )}
          </div>

          {/* Links */}
          <a
            href="/"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
          >
            Home
          </a>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
              <span className="text-yellow-400">☀️</span>
            ) : (
              <span className="text-gray-800">🌙</span>
            )}
          </button>
        </div>
      </div>
    </div>

    {/* 🔹 Mobile Search Bar (always visible, outside burger) */}
    <div className="lg:hidden px-4 pb-2">
      <div ref={wrapperRef} className="relative w-full">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-3 py-2 border rounded-md bg-white text-gray-900
            placeholder-gray-400 focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:border-blue-500
            dark:bg-[#121212] dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700"
        />

        {/* Mobile Suggestions */}
        {showSuggestions &&
          results &&
          "items" in results &&
          results.items.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                rounded-md shadow-lg max-h-60 overflow-y-auto z-50 w-full"
            >
              {results.items.map((item: any) => (
                <li
                  key={item.parcl_id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setShowSuggestions(false);
                    setLoading(true);
                    router.visit(`/markets/${item.parcl_id}`);
                    setLoading(false);
                  }}
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {item.region}, {item.state_abbreviation}
                  </span>
                </li>
              ))}
            </motion.ul>
          )}

        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <SpinnerCircle />
          </div>
        )}
      </div>
    </div>

    {/* Mobile menu links */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          key="mobileMenu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden px-4 pb-4 space-y-4 overflow-hidden"
        >
          <a
            href="/"
            className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
          >
            Home
          </a>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
          >
            {isDark ? (
              <span className="text-yellow-400">☀️</span>
            ) : (
              <span className="text-gray-800">🌙</span>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
);

};
