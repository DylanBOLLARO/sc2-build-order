import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import buildOrder from "../buildOrder.json";
import Layout from "../components/Layout";
import { ipcRenderer } from "electron";
import Image from "next/image";
import colorName from "../constants/colors";

function Home() {
  const router = useRouter();

  useEffect(() => {
    ipcRenderer.on("num7", () => {
      router.push({
        pathname: "/OpponentRace",
        query: { racePlayed: "terran" },
      });
    });

    ipcRenderer.on("num8", () => {
      router.push({
        pathname: "/OpponentRace",
        query: { racePlayed: "zerg" },
      });
    });

    ipcRenderer.on("num9", () => {
      router.push({
        pathname: "/OpponentRace",
        query: { racePlayed: "protoss" },
      });
    });

    ipcRenderer.on("num5", () => {
      // ipcRenderer.send("create-new-window");
      ipcRenderer.send("show-sample");
    });

    return () => {
      ipcRenderer.removeAllListeners("num7");
      ipcRenderer.removeAllListeners("num8");
      ipcRenderer.removeAllListeners("num9");
      ipcRenderer.removeAllListeners("num5");
    };
  }, []);

  return (
    <Layout title={"Sir, choose your race !"}>
      <div className="flex justify-between gap-2 overflow-hidden">
        {buildOrder.race.map((category, index) => (
          <div
            className="flew-row relative flex w-full cursor-default items-center justify-around rounded-lg bg-black/50 p-3"
            key={category.name}
          >
            <p className={`text-lg ${colorName[index]}`}>{category.name}</p>
            <Image
              src={`/images/${category.name}Logo.png`}
              width={32}
              height={32}
            />
            <div className="absolute -z-10 opacity-25 blur-lg">
              <Image
                src={`/images/${category.name}Logo.png`}
                width={128}
                height={128}
              />
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Home;
