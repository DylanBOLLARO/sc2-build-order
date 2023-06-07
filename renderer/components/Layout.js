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
        <header className="drag flex flex-row gap-2">
          <div className="flex h-12 w-full items-center justify-center rounded bg-black/50 py-1 text-zinc-300">
            <p className="text-xl">{title}</p>
          </div>
          {pathname === "/home" && (
            <div className="flex h-12 items-center justify-center rounded bg-black/50 px-3 py-1 text-zinc-300">
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
