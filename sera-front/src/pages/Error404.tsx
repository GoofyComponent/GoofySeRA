import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import chokbarimg from "../assets/images/chokbar-404.png";
import Sera from "../assets/images/sera-logo.svg";
import "../assets/styles/chokbar.css";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export const Error404 = () => {
  //detect when the user press the key "c,h,o,c,k,b,a,r" in this order
  const [chokbar, setchokbar] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      setchokbar((prev) => prev + e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (chokbar === "chokbar") {
      setIsOpen(true);
    }
  }, [chokbar]);

  const letters = ["C", "H", "O", "C", "B", "A", "R"];
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLetterIndex((prevIndex) => (prevIndex + 1) % letters.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [letters.length]);

  function handleDilogOpen() {
    setIsOpen((prev) => !prev);
    setchokbar("");
  }

  return (
    <>
      <div className="relative flex h-screen w-screen flex-col items-center justify-center">
        <img
          src={Sera}
          alt="sera-logo"
          className="img-bg absolute top-1/2 my-auto w-full translate-y-[-50%] opacity-5"
        />
        <img src={chokbarimg} alt="chokbar" className="w-1/5" />
        <h2 className="text-center text-4xl font-semibold italic text-sera-periwinkle">
          404 - chokbar not found
        </h2>
        <Link to={"/dashboard"}>
          <button className="mt-4 rounded bg-sera-periwinkle px-4 py-2 font-bold text-sera-jet duration-100 ease-in hover:scale-105 ">
            Go back to dashboard
          </button>
        </Link>
        {letters.map((letter, index) => (
          <span
            key={index}
            className={`letter ${
              index === currentLetterIndex ? "visible" : ""
            }`}
          >
            {letter}
          </span>
        ))}
        <Dialog onOpenChange={handleDilogOpen} open={isOpen}>
          <DialogContent>
            <p>LA VIDEO GNGNGN</p>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
