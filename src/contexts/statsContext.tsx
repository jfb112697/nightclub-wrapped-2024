// src/contexts/StatsContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { PlayerMapping } from "../types"; // Removed unused PlayerStats import

interface StatsContextType {
    playerData: PlayerMapping | null; // Changed from PlayerMapping | undefined
    isLoading: boolean;
    error: Error | null;
    playerName: string;
    fetchPlayerStats: (name: string) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
    const [playerName, setPlayerName] = useState("");

    const {
        data: playerData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["playerStats", playerName],
        queryFn: async (): Promise<PlayerMapping | null> => {
            if (!playerName) return null;

            const { data, error } = await supabase
                .from("player_mappings")
                .select("name, stats")
                .eq("name", playerName)
                .single();

            if (error) {
                if (error.code === "PGRST116") {
                    // No rows returned
                    return null;
                }
                throw error;
            }
            return data;
        },
        enabled: !!playerName,
    });

    const fetchPlayerStats = (name: string) => {
        setPlayerName(name);
    };

    const contextValue: StatsContextType = {
        playerData: playerData || null, // Ensure null instead of undefined
        isLoading,
        error: error as Error | null,
        playerName,
        fetchPlayerStats,
    };

    return (
        <StatsContext.Provider value={contextValue}>
            {children}
        </StatsContext.Provider>
    );
}

export const useStats = () => {
    const context = useContext(StatsContext);
    if (!context) {
        throw new Error("useStats must be used within a StatsProvider");
    }
    return context;
};
