import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook } from "lucide-react";

interface SocialShareButtonsProps {
    imageUrl: string;
    playerName: string;
}

type SharePlatform = "twitter" | "facebook" | "reddit";

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
    imageUrl,
    playerName,
}) => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const getImageBlob = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return blob;
        } catch (err) {
            console.error("Error converting image to blob:", err);
            return null;
        }
    };

    const handleMobileShare = async () => {
        if (navigator.share) {
            try {
                const blob = await getImageBlob();
                if (!blob) return;

                const file = new File(
                    [blob],
                    `nightclub-wrapped-${playerName}.png`,
                    { type: "image/png" },
                );

                await navigator.share({
                    title: `${playerName}'s Nightclub Wrapped`,
                    text: "Check out my Nightclub Wrapped stats!",
                    files: [file],
                });
            } catch (err) {
                console.log("Error sharing:", err);
                // Fallback to link sharing if file sharing fails
                try {
                    await navigator.share({
                        title: `${playerName}'s Nightclub Wrapped`,
                        text: "Check out my Nightclub Wrapped stats!",
                        url: window.location.href,
                    });
                } catch (fallbackErr) {
                    console.log("Fallback sharing failed:", fallbackErr);
                }
            }
        }
    };

    const handleShare = async (platform: SharePlatform) => {
        const blob = await getImageBlob();
        if (!blob) return;

        // Create a FormData object for the image upload
        const formData = new FormData();
        formData.append("file", blob, `nightclub-wrapped-${playerName}.png`);

        switch (platform) {
            case "twitter":
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my Nightclub Wrapped stats!`)}&url=${encodeURIComponent(window.location.href)}`,
                    "_blank",
                    "width=600,height=400",
                );
                break;
            case "facebook":
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                    "_blank",
                    "width=600,height=400",
                );
                break;
            case "reddit":
                window.open(
                    `https://reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(`${playerName}'s Nightclub Wrapped`)}`,
                    "_blank",
                    "width=600,height=400",
                );
                break;
        }
    };

    if (isMobile) {
        return (
            <Button
                onClick={handleMobileShare}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
            >
                <Share2 className="mr-2 h-4 w-4" />
                Share
            </Button>
        );
    }

    return (
        <div className="flex gap-3">
            <Button
                onClick={() => handleShare("twitter")}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
            >
                <Twitter className="mr-2 h-4 w-4" />
                Share on X
            </Button>
            <Button
                onClick={() => handleShare("facebook")}
                className="bg-[#4267B2] hover:bg-[#365899] text-white"
            >
                <Facebook className="mr-2 h-4 w-4" />
                Share
            </Button>
            <Button
                onClick={() => handleShare("reddit")}
                className="bg-[#FF4500] hover:bg-[#e03d00] text-white"
            >
                <Share2 className="mr-2 h-4 w-4" />
                Reddit
            </Button>
        </div>
    );
};

export default SocialShareButtons;
