import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementByAmount, reset } from "../features/counter/counterSlice";
import { ipcRenderer } from "electron";

function Chronometre() {
  const count = useSelector((state) => state.counter.value);

  const [enCours, setEnCours] = useState(false);
  const intervalRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on("num7", () => {
      if (!enCours) {
        demarrerChronometre();
      } else {
        arreterChronometre();
      }
    });

    ipcRenderer.on("num8", () => {
      reinitialiserChronometre();
    });

    return () => {
      ipcRenderer.removeAllListeners("num7");
      ipcRenderer.removeAllListeners("num8");
    };
  }, [enCours]);

  const demarrerChronometre = () => {
    if (!enCours) {
      intervalRef.current = setInterval(() => {
        dispatch(incrementByAmount(1));
      }, 1000);
      setEnCours(true);
    }
  };

  const arreterChronometre = () => {
    if (enCours) {
      clearInterval(intervalRef.current);
      setEnCours(false);
    }
  };

  const reinitialiserChronometre = () => {
    clearInterval(intervalRef.current);
    dispatch(reset());
    setEnCours(false);
  };

  const formatTemps = (temps) => {
    const minutes = Math.floor(temps / 60);
    const secondes = temps % 60;
    return `${minutes.toString().padStart(2, "0")}:${secondes
      .toString()
      .padStart(2, "0")}`;
  };

  const Bouton = ({ text, data }) => {
    return (
      <button
        className="text-teal-500 font-semibold border-2 border-black/20 rounded-xl hover:border-teal-500/30 px-3 py-1"
        onClick={data}
      >
        {text}
      </button>
    );
  };

  return (
    <div className="flex bg-black/50 rounded py-1 text-zinc-300 justify-center items-center h-12 w-3/12">
      <p className="text-4xl">{formatTemps(count)}</p>
    </div>
  );
}

export default Chronometre;
