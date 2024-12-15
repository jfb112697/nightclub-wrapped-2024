import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { PlayerMapping } from "../types";

interface StatsContextType {
  playerData: PlayerMapping | null;
  suggestions: PlayerMapping[];
  isLoading: boolean;
  error: Error | null;
  playerName: string;
  fetchPlayerStats: (name: string) => void;
  searchPlayers: (search: string) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [playerName, setPlayerName] = useState("");
  const [suggestions, setSuggestions] = useState<PlayerMapping[]>([]);

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
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return data;
    },
    enabled: !!playerName,
  });

  const searchPlayers = async (search: string) => {
    if (search.length < 2) {
      setSuggestions([]);
      return;
    }

    const { data, error } = await supabase
      .from("player_mappings")
      .select("name, stats")
      .ilike("name", `%${search}%`)
      .limit(4);

    if (error) {
      console.error("Error fetching suggestions:", error);
      return;
    }

    setSuggestions(data || []);
  };

  const fetchPlayerStats = (name: string) => {
    setPlayerName(name);
    setSuggestions([]); // Clear suggestions after selection
  };

  const contextValue: StatsContextType = {
    playerData: playerData || null,
    suggestions,
    isLoading,
    error: error as Error | null,
    playerName,
    fetchPlayerStats,
    searchPlayers,
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
