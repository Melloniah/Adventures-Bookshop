"use client"
import { useEffect, useState } from 'react';
import Image from "next/image";

const PromoSection = () => {
    const [timeLeft, setTimeLeft] = useState(Date.now() + 1000 * 60 * 60 * 41);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1000);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return (
        <div className="w-1/3 min-w-[300px] space-y-5">
            <div className="bg-white p-5 rounded-lg shadow-md relative text-center">
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md">Sale</div>
                <div className="bg-gray-100 p-2 rounded-md mb-3">
                    <span className="text-sm">Hurry Up</span>
                    <span className="block text-sm">Offer Ends Soon</span>
                    <div id="countdown" className="text-2xl font-bold text-red-600 mt-1">
                        <span>41</span>:
                        <span>{String(hours).padStart(2, '0')}</span>:
                        <span>{String(minutes).padStart(2, '0')}</span>:
                        <span>{String(seconds).padStart(2, '0')}</span>
                    </div>
                </div>
                <Image src="/product-img.jpg" alt="Featured Product" className="w-full h-auto max-h-52 object-contain mb-3" />
                <div>
                    <p className="text-xs text-gray-500">TEXTBOOKS</p>
                    <h3 className="text-lg font-semibold my-1">SUPER MINDS AGRICULTURE GRADE 5</h3>
                    <div className="flex justify-center items-center mt-2">
                        <span className="text-xl font-bold text-red-600">KSh 465.00</span>
                        <span className="text-sm text-gray-500 line-through ml-3">KSh 516.67</span>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-400 p-8 rounded-lg shadow-md text-center">
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-bold">SPECIAL OFFER</h3>
                    <h2 className="text-3xl font-bold leading-tight my-1">Biggest Offer Sale</h2>
                    <h2 className="text-3xl font-bold leading-tight my-1">Office Stationery</h2>
                    <p className="text-lg font-bold mt-2">SAVE BIG!</p>
                </div>
                <img src="/stationery-promo.jpg" alt="Stationery Promotion" className="w-full h-auto mt-4 object-contain" />
            </div>
        </div>
    );
};

export default PromoSection;