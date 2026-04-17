import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";

const MatrixRain = ({ opacity = 0.3 }: { opacity?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = [];

    // Initialize drops - sparse distribution
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100; // Start at different heights above screen
    }

    const draw = () => {
      // Semi-transparent black to create trailing effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // Matrix green text
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Only draw if we want sparse (randomly skip columns if needed, but current density is fine per user)
        const text = charSet[Math.floor(Math.random() * charSet.length)];
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [isInView]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000"
      style={{ opacity }}
    />
  );
};


export default MatrixRain;
