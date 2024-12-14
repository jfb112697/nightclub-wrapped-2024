import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStats } from "../contexts/statsContext";
import LoadingHexagon from "./loading-shine";

export default function Landing() {
    const [tag, setTag] = useState("");
    const { playerData, isLoading, error, fetchPlayerStats } = useStats();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchPlayerStats(tag);
        console.log(JSON.stringify(playerData));
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
                <h1 className="mb-8 text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Nightclub Wrapped
                </h1>

                <div className="relative mb-12">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75 animate-pulse" />
                    <div className="relative px-6 py-4 bg-black rounded-lg leading-none flex items-center space-x-4">
                        <span className="text-gray-100">
                            Enter your tag to see your Nightclub journey
                        </span>
                    </div>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="flex flex-col items-center space-y-4"
                >
                    <Input
                        type="text"
                        placeholder="Enter your tag"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="w-full max-w-xs bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading}
                    >
                        Generate Your Wrapped
                    </Button>
                </form>

                {isLoading && (
                    <div className="mt-8 flex justify-center">
                        <LoadingHexagon />
                    </div>
                )}

                {playerData && (
                    <>
                        <div className="mt-4 text-center text-green-500">
                            Found player: {playerData.name}
                        </div>
                        <textarea
                            className="text-black"
                            defaultValue={JSON.stringify(playerData)}
                        ></textarea>
                    </>
                )}

                {error && (
                    <div className="mt-4 text-red-500 text-center">
                        Player not found
                    </div>
                )}
            </div>
        </main>
    );
}
