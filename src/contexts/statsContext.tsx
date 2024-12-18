import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { PlayerMapping } from "../types";

// Constants for image generation
const NEON_PINK = "#FF1493";
const NEON_BLUE = "#00FFFF";

interface TextConfig {
    x: number;
    y: number;
    color: string;
    size: number;
    textAlign: CanvasTextAlign;
}

interface StatsContextType {
    playerData: PlayerMapping | null;
    suggestions: PlayerMapping[];
    isLoading: boolean;
    error: Error | null;
    playerName: string;
    wrappedImage: string | null;
    isGeneratingImage: boolean;
    fetchPlayerStats: (name: string) => void;
    searchPlayers: (search: string) => void;
    generateWrappedImage: () => Promise<void>;
    clearWrappedImage: () => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

const loadFont = async () => {
    const font = new FontFace(
        "Library3am",
        `url("/Library3am.otf")`, // Fixed URL format
    );

    try {
        await font.load();
        document.fonts.add(font);
        await document.fonts.ready; // Wait for font to be ready
    } catch (err) {
        console.error("Error loading font:", err);
        throw new Error("Failed to load font"); // Rethrow to handle in generation
    }
};

export function StatsProvider({ children }: { children: ReactNode }) {
    const [playerName, setPlayerName] = useState("");
    const [suggestions, setSuggestions] = useState<PlayerMapping[]>([]);
    const [wrappedImage, setWrappedImage] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        loadFont()
            .then(() => setFontLoaded(true))
            .catch((err) => console.error("Failed to preload font:", err));
    }, []);

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

    useEffect(() => {
        if (playerData && !wrappedImage && !isGeneratingImage) {
            generateWrappedImage();
        }
    }, [playerData]);

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
        setSuggestions([]);
        setWrappedImage(null); // Clear any existing wrapped image
    };

    const generateWrappedImage = async () => {
        if (!playerData) return;

        setIsGeneratingImage(true);
        try {
            // Only try to load font if it hasn't been loaded yet
            if (!fontLoaded) {
                await loadFont();
                setFontLoaded(true);
            }

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not get canvas context");

            canvas.width = 1080;
            canvas.height = 1920;

            // Load and draw template
            const templateImage = new Image();
            templateImage.crossOrigin = "anonymous"; // Add this if needed
            templateImage.src = "/wrapped-template.png";

            await new Promise((resolve, reject) => {
                templateImage.onload = resolve;
                templateImage.onerror = () =>
                    reject(new Error("Failed to load template image"));
            });

            ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);

            // Test font loading
            ctx.font = "56px Library3am";
            const testWidth = ctx.measureText("Test").width;
            if (testWidth === 0) {
                throw new Error("Font not properly loaded");
            }

            // Rest of your text rendering code...
            const addNeonText = (text: string, config: TextConfig) => {
                ctx.textAlign = config.textAlign;
                ctx.textBaseline = "middle";
                ctx.font = `${config.size}px Library3am`;

                // Add a console.log to debug font application
                console.log("Applied font:", ctx.font);

                ctx.shadowBlur = 20;
                ctx.shadowColor = config.color;
                ctx.fillStyle = config.color;

                for (let i = 0; i < 3; i++) {
                    ctx.fillText(text, config.x, config.y);
                }

                ctx.shadowBlur = 0;
                ctx.fillText(text, config.x, config.y);
            };

            const mainStats = playerData.stats.main;

            // Calculate combined stats where needed
            const totalSetsPlayed = mainStats.setsPlayed;
            const totalSetsWon = mainStats.setsWon;
            const winRate =
                totalSetsPlayed > 0
                    ? (totalSetsWon / totalSetsPlayed) * 100
                    : 0;

            const textElements = [
                {
                    text: String(playerData.stats.tournamentsAttended),
                    config: {
                        x: 750,
                        y: 520,
                        color: NEON_PINK,
                        size: 56,
                        textAlign: "left" as CanvasTextAlign,
                    },
                },
                {
                    text: String(playerData.stats.main.setsPlayed),
                    config: {
                        x: 750,
                        y: 750,
                        color: NEON_BLUE,
                        size: 56,
                        textAlign: "left" as CanvasTextAlign,
                    },
                },
                {
                    text: `${winRate.toFixed(1)}%`,
                    config: {
                        x: 750,
                        y: 980,
                        color: NEON_PINK,
                        size: 56,
                        textAlign: "left" as CanvasTextAlign,
                    },
                },
                {
                    text: mainStats.bestPlacement.placement
                        ? `${mainStats.bestPlacement.placement}${getOrdinalSuffix(mainStats.bestPlacement.placement)}`
                        : "N/A",
                    config: {
                        x: 750,
                        y: 1210,
                        color: NEON_BLUE,
                        size: 56,
                        textAlign: "left" as CanvasTextAlign,
                    },
                },
                {
                    text: String(mainStats.timesOutplacedSeed),
                    config: {
                        x: 750,
                        y: 1440,
                        color: NEON_PINK,
                        size: 56,
                        textAlign: "left" as CanvasTextAlign,
                    },
                },
                {
                    text: mainStats.rival?.tag || "None",
                    config: {
                        x: 750,
                        y: 1670,
                        color: NEON_BLUE,
                        size: 56,
                        textAlign: "left" as CanvasTextAlign,
                    },
                },
            ];

            for (const { text, config } of textElements) {
                addNeonText(text, config);
            }

            const imageUrl = canvas.toDataURL("image/png");
            setWrappedImage(imageUrl);
        } catch (err) {
            console.error("Error generating wrapped image:", err);
            // You might want to show an error state to the user here
        } finally {
            setIsGeneratingImage(false);
        }
    };

    // Helper function for ordinal suffixes
    const getOrdinalSuffix = (n: number): string => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };

    const clearWrappedImage = () => {
        setWrappedImage(null);
    };

    const contextValue: StatsContextType = {
        playerData: playerData || null,
        suggestions,
        isLoading,
        error: error as Error | null,
        playerName,
        wrappedImage,
        isGeneratingImage,
        fetchPlayerStats,
        searchPlayers,
        generateWrappedImage,
        clearWrappedImage,
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
