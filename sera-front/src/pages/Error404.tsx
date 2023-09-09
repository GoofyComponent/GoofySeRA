import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import chokbarimg from "../assets/images/chokbar-404.png";
import Sera from "../assets/images/sera-logo.svg";
import "../assets/styles/chokbar.css";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { setAppError } from "@/helpers/slices/AppSlice";
import { Toaster } from "@/components/ui/toaster";

export const Error404 = () => {
  const [chokbar, setchokbar] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const letters = ["C", "H", "O", "k", "B", "A", "R"];
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAppError(null));
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLetterIndex((prevIndex) => (prevIndex + 1) % letters.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [letters.length, isOpen]);

  function handleDilogOpen() {
    setIsOpen((prev) => !prev);
    setchokbar("");
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setchokbar("");
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [chokbar, isOpen]);

  return (
    <>
      <div className="relative flex h-screen w-screen flex-col items-center justify-center p-2">
        <img
          src={Sera}
          alt="sera-logo"
          className="img-bg absolute top-1/2 my-auto w-full translate-y-[-50%] p-6 opacity-5"
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
            <div className="p-2">
              <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/zPSjX2YiHto?si=Us9Rjd19M3iGLnV7&autoplay=1&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </>
  );
};
