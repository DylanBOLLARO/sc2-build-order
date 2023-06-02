import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import buildOrder from "../buildOrder.json";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { ipcRenderer } from "electron";

function DisplayBuild() {
  const router = useRouter();
  const { query } = useRouter();
  const count = useSelector((state) => state.counter.value);

  const [switchColor, setSwitchColor] = useState(false);

  const path = buildOrder.matchup.find(
    (x) => x.slugmatchup == query.racePlayed + "vs" + query.raceOpponent
  ).build[query.build];

  useEffect(() => {
    ipcRenderer.on("num5", () => {
      router.push({
        pathname: "/ChoseBuild",
        query: {
          racePlayed: query.racePlayed,
          raceOpponent: query.raceOpponent,
          build: query.selectedBuild,
        },
      });
    });

    return () => {
      ipcRenderer.removeAllListeners("num5");
    };
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(
        path.recette.filter((x) => count == x.timer)[0] &&
          path.recette.filter((x) => count == x.timer)[0].timer == count
      )
    ) {
      setSwitchColor(true);
    } else {
      setSwitchColor(false);
    }
  }, [count]);

  const formatTemps = (temps) => {
    const minutes = Math.floor(temps / 60);
    const secondes = temps % 60;
    return `${minutes.toString().padStart(2)}:${secondes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Layout title={path.name}>
      <div className={`flex flex-col gap-1`}>
        {path.recette
          .slice(
            Math.max(path.recette.filter((x) => count > x.timer).length - 2, 0),
            Math.min(
              path.recette.filter((x) => count > x.timer).length + 6,
              path.recette.length
            )
          )
          .map((u, index) => (
            <div className="bg-black/50 rounded">
              {u.details && (
                <div className="flex flex-row text-[#a878dd] py-1 px-3 w-full">
                  <p className=" text-center w-full ">{u.details}</p>
                </div>
              )}
              <div className="flex flex-row text-lg gap-1">
                <div
                  className={`flex flex-row py-1 justify-between items-center w-3/12`}
                >
                  <p className="w-1/2 text-center text-[#61afe4]">
                    {u.population}
                  </p>
                  <p className="w-1/2 text-center text-[#e06c75]">
                    {formatTemps(u.timer)}
                  </p>
                </div>
                <div
                  className={`flex w-9/12  px-3 justify-between items-center`}
                >
                  <p
                    className={`text-left text-[#98c379] ${
                      index ==
                        path.recette
                          .slice(
                            Math.max(
                              path.recette.filter((x) => count > x.timer)
                                .length - 2,
                              0
                            ),
                            Math.min(
                              path.recette.filter((x) => count > x.timer)
                                .length + 6,
                              path.recette.length
                            )
                          )
                          .filter((x) => count > x.timer).length &&
                      "text-[#e5c07b]"
                    }`}
                  >
                    {u.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Layout>
  );
}

export default DisplayBuild;
