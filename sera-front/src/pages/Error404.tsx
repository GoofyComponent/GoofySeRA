import { useEffect, useState } from "react";
import Chockbar from "../assets/images/chockbar-404.png";
import "../assets/styles/chockbar.css"
export const Error404 = () => {
  //detect when the user press the key "c,h,o,c,k,b,a,r" in this order
  const [chockbar, setChockbar] = useState("");
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      setChockbar((prev) => prev + e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (chockbar === "chockbar") {
      window.location.href = "https://www.youtube.com/watch?v=V5BruGgWfS4";
    }
  }, [chockbar]);


  const letters = ["C", "H", "O", "C", "K", "B", "A", "R"]
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLetterIndex((prevIndex) => (prevIndex + 1) % letters.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [letters.length]);


  return (
    <>
      <div className="flex flex-col items-center w-screen justify-center h-screen">
        <img src={Chockbar} alt="chockbar" className="w-1/5" />
        <h2 className="text-4xl font-semibold text-sera-periwinkle italic ">
          404 - Chockbar not found
        </h2>
        {letters.map((letter, index) => (
        <span
          key={index}
          className={`letter ${index === currentLetterIndex ? 'visible' : ''}`}
        >
          {letter}
        </span>
      ))}
      </div>
    </>
  );
};
