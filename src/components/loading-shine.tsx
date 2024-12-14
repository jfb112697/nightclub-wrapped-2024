export default function LoadingShine() {
    return (
        <div className="flex justify-center items-center w-32 h-32">
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 blur-xl bg-blue-500/50 animate-pulse" />

                {/* Hexagon */}
                <svg
                    viewBox="0 0 100 100"
                    className="w-32 h-32 animate-spin-slow"
                    style={{ animationDuration: "3s" }}
                >
                    <polygon
                        points="50,10 90,30 90,70 50,90 10,70 10,30"
                        className="fill-transparent stroke-blue-500"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Inner glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full blur-md animate-pulse" />
                </div>
            </div>
        </div>
    );
}
