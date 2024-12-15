import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function NeonButton({ className, ...props }: NeonButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const rippleControls = useAnimation();

  useEffect(() => {
    if (isPressed) {
      rippleControls.start("animate");
    } else {
      rippleControls.start("initial");
    }
  }, [isPressed, rippleControls]);

  return (
    <Button
      asChild
      className={cn(
        "relative px-8 py-4 text-xl font-bold text-white bg-transparent border-2 border-transparent rounded-full overflow-hidden",
        className,
      )}
      style={{
        boxShadow:
          "0 0 20px rgba(255, 0, 255, 0.7), 0 0 30px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)",
      }}
      {...props}
    >
      <motion.button
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="press"
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        variants={{
          initial: { scale: 1 },
          animate: { scale: 1 },
          hover: { scale: 1.05 },
          press: { scale: 0.95 },
        }}
        className="w-full h-full"
      >
        <motion.span
          className="absolute inset-0 z-0"
          variants={{
            initial: {
              background:
                "linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff, #00ffff)",
              backgroundSize: "400% 400%",
              backgroundPosition: "0% 0%",
            },
            animate: {
              backgroundPosition: ["0% 0%", "100% 100%"],
            },
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
        <motion.span
          className="relative z-10 block"
          style={{
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.3)",
          }}
          animate={{
            textShadow: [
              "0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 0, 255, 0.5), 0 0 30px rgba(255, 0, 255, 0.3)",
              "0 0 15px rgba(255, 255, 255, 0.9), 0 0 25px rgba(0, 255, 255, 0.7), 0 0 35px rgba(0, 255, 255, 0.5)",
              "0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 0, 255, 0.5), 0 0 30px rgba(255, 0, 255, 0.3)",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          Generate Your Wrapped
        </motion.span>
        <motion.div
          className="absolute inset-0 z-20"
          variants={{
            initial: { opacity: 0 },
            hover: {
              opacity: 0.5,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,0,255,0.3) 50%, rgba(0,255,255,0.3) 100%)",
            },
            press: {
              opacity: 0.7,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,0,255,0.5) 50%, rgba(0,255,255,0.5) 100%)",
            },
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 z-30"
          initial="initial"
          animate={rippleControls}
          variants={{
            initial: {
              boxShadow: "0 0 0 0 rgba(255, 255, 255, 0)",
            },
            animate: {
              boxShadow: [
                "0 0 0 0 rgba(255, 255, 255, 0.7)",
                "0 0 0 20px rgba(255, 255, 255, 0)",
              ],
            },
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        />
      </motion.button>
    </Button>
  );
}
