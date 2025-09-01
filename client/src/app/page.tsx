"use client";
import Image from "next/image";
import Aurora from "@/blocks/Backgrounds/Aurora/Aurora";

export default function Home() {
  return (
    <div className="min-h-screen relative flex items-center justify-center font-[family-name:var(--font-playfair-display)]">
      {/* Aurora Background */}
      <div className="fixed inset-0 -z-10">
        <Aurora 
          colorStops={["#22C55E", "#10B981", "#22C55E"]}
          amplitude={1.5}
          blend={0.8}
          speed={1.2}
        />
      </div>
      


    </div>
  );
}
