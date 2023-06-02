import Head from "next/head";
import React, { useState, useEffect } from "react";
import Chronometre from "./Chrono";
import { useRouter } from "next/router";
import { GoSettings } from "react-icons/go";
import { ipcRenderer } from "electron";

export default function Layout({ title, children }) {
  const router = useRouter();
  const { pathname } = router;
  const [showApp, setShowApp] = useState(true);
  const demarrerChronometre = () => {
    if (!enCours) {
      intervalRef.current = setInterval(() => {
        dispatch(incrementByAmount(1));
      }, 1000);
      setEnCours(true);
    }
  };
  const ShowApp = () => {
    setShowApp((prevCount) => !prevCount);
  };

  useEffect(() => {
    ipcRenderer.on("num6", () => {
      ShowApp();
    });
    return () => {
      ipcRenderer.removeAllListeners("num6");
    };
  }, []);

  return showApp ? (
    <>
      <Head>
        <title>{title && title}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col">
        <header className="flex flex-row gap-2 drag">
          <div className="flex bg-black/50 rounded py-1 text-zinc-300 justify-center items-center h-12 w-full">
            <p className="text-xl">{title}</p>
          </div>
          {pathname === "/home" && (
            <div className="flex bg-black/50 rounded py-1 text-zinc-300 justify-center items-center h-12 px-3">
              <p className="text-2xl">
                <GoSettings />
              </p>
            </div>
          )}
        </header>
        <main className="my-3">{children}</main>
        {pathname === "/DisplayBuild" && (
          <Chronometre demarrerChronometre={demarrerChronometre} />
        )}
      </div>
    </>
  ) : (
    <>
      <Head>
        <title>I'm hiding !</title>
      </Head>
    </>
  );
}
