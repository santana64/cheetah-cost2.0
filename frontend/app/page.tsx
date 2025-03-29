"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-green-900">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">CheetahCost</h1>
            <button
                className="mt-6 px-6 py-3 bg-white text-green-900 font-semibold text-lg rounded-lg shadow-md hover:bg-gray-200 transition transform hover:scale-105"
                onClick={() => router.push("/auth")}
            >
                Bienvenue
            </button>
        </div>
    );
}
