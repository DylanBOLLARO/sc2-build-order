import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import buildOrder from "../buildOrder.json";
import { ipcRenderer } from "electron";
import Layout from "../components/Layout";
import colorName from "../constants/colors";
import { TbSquareRounded, TbSquareRoundedFilled } from "react-icons/tb";

export default function ProductScreen() {
  const { query } = useRouter();
  const router = useRouter();

  const [selectedBuild, setSelectedBuild] = useState(0);

  const incCounter = () => {
    setSelectedBuild((prevCounter) => prevCounter + 1);
  };

  const decCounter = () => {
    setSelectedBuild((prevCounter) => prevCounter - 1);
  };

  const matchup = buildOrder.matchup.find(
    (x) => x.slugmatchup === query.racePlayed + "vs" + query.raceOpponent
  );

  if (matchup && matchup.build) {
    path = matchup.build;
  }

  let path;

  if (
    buildOrder.matchup.find(
      (x) => x.slugmatchup === query.racePlayed + "vs" + query.raceOpponent
    ).build
  ) {
    path = buildOrder.matchup.find(
      (x) => x.slugmatchup === query.racePlayed + "vs" + query.raceOpponent
    ).build;
  }

  useEffect(() => {
    if (query.build) {
      setSelectedBuild(parseInt(query.build));
    }

    if (path) {
      if (selectedBuild > path.length - 1) {
        setSelectedBuild(0);
      } else if (selectedBuild < 0) {
        setSelectedBuild(path.length - 1);
      }
    }
  }, [selectedBuild]);

  useEffect(() => {
    ipcRenderer.on("num7", () => {
      decCounter();
    });

    ipcRenderer.on("num8", () => {
      router.push({
        pathname: "/DisplayBuild",
        query: {
          racePlayed: query.racePlayed,
          raceOpponent: query.raceOpponent,
          build: selectedBuild,
        },
      });
    });

    ipcRenderer.on("num9", () => {
      incCounter();
    });

    ipcRenderer.on("num5", () => {
      router.push({
        pathname: "/OpponentRace",
        query: { racePlayed: query.racePlayed },
      });
    });

    return () => {
      ipcRenderer.removeAllListeners("num7");
      ipcRenderer.removeAllListeners("num8");
      ipcRenderer.removeAllListeners("num9");
      ipcRenderer.removeAllListeners("num5");
    };
  }, [selectedBuild]);

  return (
    <Layout title={`Select your build order`}>
      <div className="flex flex-col justify-between gap-2 overflow-hidden">
        {path &&
          path.map((race, index) => (
            <div
              key={race.name}
              className="flex w-full flex-row items-center justify-between bg-black/50 px-3 py-1 text-zinc-300"
            >
              <p className={`text-lg`}>{race.name}</p>

              {index === selectedBuild ? (
                <p className={`text-lg text-zinc-500`}>
                  <div className="relative">
                    <TbSquareRounded size={32} />
                    <div className="absolute -translate-y-6 translate-x-2 text-[#98c379]">
                      <TbSquareRoundedFilled size={16} />
                    </div>
                  </div>
                </p>
              ) : (
                <p className={`text-lg text-zinc-500`}>
                  <TbSquareRounded size={32} />
                </p>
              )}
            </div>
          ))}
      </div>
    </Layout>
  );
  4;
}
