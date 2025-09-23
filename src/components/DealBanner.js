"use client";
import Image from "next/image";

export default function DealBanner({ title, subtitle, color = "yellow" }) {
  const bg = color === "yellow" ? "bg-yellow-300" : color === "purple" ? "bg-brandPurple" : "bg-green-500";
  return (
    <div className={`${bg} p-6 rounded-lg text-white flex items-center justify-between`}>
      <div>
        <div className="text-xs font-semibold">BIG DEAL</div>
        <h4 className="text-lg font-bold mt-2">{title}</h4>
        <p className="mt-2 font-semibold">{subtitle}</p>
      </div>
      <Image 
  src="/images/banner-sample.png" 
  alt="Banner" 
  width={200} 
  height={96} 
  className="h-24 object-contain hidden md:block" 
/>
    </div>
  );
}
