import { useState, useEffect, useRef } from "react";
import { useDropdownPosition } from "../hooks/useDropdownPosition";
import { Input } from "@/components/ui/input";
import { useStats } from "../contexts/statsContext";
import LoadingHexagon from "./loading-shine";
import NeonButton from "./neon-button";

export default function Landing() {
  const inputRef = useRef<HTMLInputElement>(null);
  const showAbove = useDropdownPosition(inputRef);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tag, setTag] = useState("");
  const {
    playerData,
    suggestions,
    isLoading,
    error,
    fetchPlayerStats,
    searchPlayers,
  } = useStats();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchPlayers(tag);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [tag, searchPlayers]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlayerStats(tag);
  };

  const handleSuggestionClick = (name: string) => {
    setTag(name);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="flex justify-center min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="w-full max-w-5xl px-4 py-8 md:py-16 flex flex-col items-center">
        <h1 className="mb-6 md:mb-8 text-5xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 px-2">
          Nightclub Wrapped
        </h1>

        <div className="relative w-full max-w-md mb-8 md:mb-12">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75 animate-pulse" />
          <div className="relative px-4 py-3 md:px-6 md:py-4 bg-black rounded-lg">
            <p className="text-sm md:text-base text-gray-100 text-center">
              Enter your tag to see your Nightclub journey
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-md space-y-4 px-4"
        >
          <div className="relative">
            {suggestions.length > 0 && showSuggestions && showAbove && (
              <div className="absolute py-4 bottom-full mb-1 w-full bg-gray-800 rounded-md border border-gray-700 shadow-lg z-20">
                {suggestions.map((player) => (
                  <button
                    key={player.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(player.name);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors duration-150 first:rounded-t-md last:rounded-b-md"
                  >
                    {player.name}
                  </button>
                ))}
              </div>
            )}

            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter your tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-gray-800 border-gray-700 text-white"
            />

            {suggestions.length > 0 && showSuggestions && !showAbove && (
              <div className="absolute top-full mt-1 w-full bg-gray-800 rounded-md border border-gray-700 shadow-lg z-20">
                {suggestions.map((player) => (
                  <button
                    key={player.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(player.name);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors duration-150 first:rounded-t-md last:rounded-b-md"
                  >
                    {player.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <NeonButton />
          </div>
        </form>

        {isLoading && (
          <div className="mt-8 flex justify-center">
            <LoadingHexagon />
          </div>
        )}

        {playerData && (
          <div className="mt-8 w-full max-w-md px-4 space-y-4">
            <div className="text-center text-green-500">
              Found player: {playerData!.name}
            </div>
            <textarea
              className="w-full h-32 p-2 rounded text-black text-sm"
              readOnly
              value={JSON.stringify(playerData, null, 2)}
            />
          </div>
        )}

        {error && (
          <div className="mt-8 text-red-500 text-center px-4">
            Player not found
          </div>
        )}
      </div>
    </main>
  );
}
