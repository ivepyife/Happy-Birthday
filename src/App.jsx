import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import "./LoveLetter.css";
import "./BookCanvas.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import LoveLetter from "./pages/LoveLetter";
import Test from "./pages/Test";
import OpeningAnimation from "./components/OpeningAnimation";
import happySong from "./assets/Happy-Birthday.mp3";

const App = () => {
  const MyRoute = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="love-Letter" element={<LoveLetter />}></Route>
          <Route path="test" element={<Test />}></Route>
        </Route>
      </Route>,
    ),
  );

  // ------------------Cake loader
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animateOut, setAnimateOut] = useState(false); // New state for animation
  const audioRef = useRef(null);

  // State baru untuk mengecek apakah user sudah klik layar pertama kali
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Setelah animasi selesai, tidak ada auto-transition
    // User harus klik tombol untuk ke Home
    if (document.readyState === "complete") {
      // Page sudah loaded
    } else {
      window.addEventListener("load", () => {
        // Hanya tandai bahwa page sudah loaded, tapi tetap di OpeningAnimation
      });
    }

    return () => window.removeEventListener("load", () => {});
  }, []);

  // Prevent navigating to the love-letter route via browser forward/back
  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.includes("love")) {
        // replace the current history entry to '/' so the user doesn't land on love-letter
        window.history.replaceState(null, "", "/");
      }
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleSkipOpening = () => {
    setAnimateOut(true);
    setTimeout(() => setLoading(false), 600);
    setTimeout(() => setShowContent(true), 600);
  };

  // Fungsi yang dijalankan saat Fibri pertama kali klik layar
  const handleFirstInteraction = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }
    setHasInteracted(true);
  };

  return (
    <>
      {/* Background music (loops) */}
      <audio ref={audioRef} id="bg-music" src={happySong} loop hidden />

      {/* Layar pertama yang mencegat user untuk klik agar audio bisa jalan */}
      {!hasInteracted && (
        <div
          onClick={handleFirstInteraction}
          className="fixed inset-0 bg-[#f8e1e5] z-[9999] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-500"
        >
          <div className="animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-[#d13852] mb-4"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </div>
          <h2 className="text-[#d13852] text-xl font-bold animate-pulse text-center px-4">
            kamu klik bebas dimana aja buat buka yaaaa!
          </h2>
        </div>
      )}

      {/* Konten website baru dimuat setelah user klik layar pertama kali */}
      {hasInteracted && loading && (
        <OpeningAnimation animateOut={animateOut} onSkip={handleSkipOpening} />
      )}

      {hasInteracted && showContent && <RouterProvider router={MyRoute} />}
    </>
  );
};

export default App;
