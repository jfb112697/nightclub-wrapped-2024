import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useStats } from "../contexts/statsContext";
import LoadingHexagon from "./loading-shine";
import NeonButton from "./neon-button";
import SocialShareButtons from "./share-buttons";

export default function Landing() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [tag, setTag] = useState("");
    const {
        playerData,
        suggestions,
        isLoading,
        error,
        wrappedImage,
        isGeneratingImage,
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
                            {!playerData
                                ? "Enter your tag to see your Nightclub journey"
                                : "Check out your wrapped below!"}
                        </p>
                    </div>
                </div>

                {/* Search Form - Only show if no image is being displayed */}
                {!wrappedImage && !isGeneratingImage && (
                    <form
                        onSubmit={handleSearch}
                        className="w-full max-w-md space-y-4 px-4"
                    >
                        <div className="relative">
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="Enter your tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                list="player-suggestions"
                                className="w-full bg-gray-800 border-gray-700 text-white"
                            />
                            <datalist id="player-suggestions">
                                {suggestions.map((player) => (
                                    <option
                                        key={player.name}
                                        value={player.name}
                                    />
                                ))}
                            </datalist>
                        </div>
                        <div className="mt-4">
                            <NeonButton />
                        </div>
                    </form>
                )}

                {/* Loading States */}
                {(isLoading || isGeneratingImage) && (
                    <div className="mt-8 flex flex-col items-center">
                        <LoadingHexagon />
                        <p className="mt-4 text-gray-300">
                            {isGeneratingImage
                                ? "Generating your wrapped..."
                                : "Finding player..."}
                        </p>
                    </div>
                )}

                {/* Wrapped Image Display */}
                {wrappedImage && (
                    <div className="mt-8 w-full max-w-md space-y-6 px-4">
                        <img
                            src={wrappedImage}
                            alt={`${playerData?.name}'s NYCMELEE Wrapped`}
                            className="w-full rounded-lg shadow-2xl"
                        />
                        <SocialShareButtons
                            imageUrl={wrappedImage}
                            playerName={playerData!.name}
                        ></SocialShareButtons>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="mt-8 text-red-500 text-center px-4">
                        Player not found
                    </div>
                )}
            </div>
        </main>
    );
}
