import { useEffect, useState } from "react";

const COLUMN_COUNT = 40;
const COLUMN_LENGTH = 52;

function generateColumn() {
  return Array.from({ length: COLUMN_LENGTH }, () =>
    Math.random() > 0.5 ? "1" : "0"
  ).join("\n");
}

export default function BinaryRain() {
  const [columns, setColumns] = useState<string[]>(() =>
    Array.from({ length: COLUMN_COUNT }, generateColumn)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setColumns(Array.from({ length: COLUMN_COUNT }, generateColumn));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden font-mono">
      <style>{`
        @keyframes binaryFall {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(calc(100vh + 100%));
          }
        }
        .binary-column {
          animation: binaryFall linear infinite;
        }
      `}</style>
      <div className="w-full h-full flex text-cyan-400/10 text-[12px] leading-tight">
        {columns.map((col, i) => (
          <div
            key={i}
            className="flex-1 whitespace-pre overflow-hidden select-none binary-column"
            style={{
              textShadow: "0 0 3px rgba(0,255,255,0.08)",
              animationDuration: `${Math.random() * 6 + 12}s`,
              animationDelay: `${-Math.random() * 18}s`,
            }}
          >
            {col}
          </div>
        ))}
      </div>
    </div>
  );
}
