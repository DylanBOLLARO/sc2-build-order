import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import buildOrder from "../buildOrder.json";
import { ipcRenderer } from "electron";
import colorName from "../constants/colors";
import Image from "next/image";

export default function ProductScreen() {
  const { query } = useRouter();
  const router = useRouter();

  useEffect(() => {
    ipcRenderer.on("num7", () => {
      router.push({
        pathname: "/ChoseBuild",
        query: { racePlayed: query.racePlayed, raceOpponent: "terran" },
      });
    });

    ipcRenderer.on("num8", () => {
      router.push({
        pathname: "/ChoseBuild",
        query: { racePlayed: query.racePlayed, raceOpponent: "zerg" },
      });
    });

    ipcRenderer.on("num9", () => {
      router.push({
        pathname: "/ChoseBuild",
        query: { racePlayed: query.racePlayed, raceOpponent: "protoss" },
      });
    });

    ipcRenderer.on("num5", () => {
      router.push("/home");
    });

    return () => {
      ipcRenderer.removeAllListeners("num7");
      ipcRenderer.removeAllListeners("num8");
      ipcRenderer.removeAllListeners("num9");
      ipcRenderer.removeAllListeners("num5");
    };
  }, []);

  return (
    <Layout
      title={`Dear ${
        query.racePlayed.charAt().toUpperCase() + query.racePlayed.slice(1)
      }, select the opposing race !`}
    >
      <div className="row flex justify-between gap-2 overflow-hidden">
        {buildOrder.race &&
          buildOrder.race.map((race, index) => (
            <div
              className="flew-row relative flex w-full cursor-default items-center justify-around rounded-lg bg-black/50 p-3"
              key={race.name}
            >
              <p className={`text-lg ${colorName[index]}`}>{race.name}</p>
              <Image
                src={`/images/${race.name}Logo.png`}
                width={32}
                height={32}
              />
              <div className="absolute -z-10 opacity-25 blur-lg">
                <Image
                  src={`/images/${race.name}Logo.png`}
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
