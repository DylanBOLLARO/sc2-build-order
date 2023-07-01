import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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

  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(`${query.racePlayed + "v" + query.raceOpponent}`);
    (async () => {
      // try {
      //   const newData = await ipcRenderer.invoke(
      //     "db-query",
      //     `SELECT build_order.* FROM build_order JOIN categories ON build_order.category_id = categories.id WHERE categories.title = '${
      //       query.racePlayed + "v" + query.raceOpponent
      //     }';`
      //   );
      //   console.log("data from database : " + JSON.stringify(newData));
      //   console.log("data INCORPORATION : " + JSON.stringify(data));
      //   setData(newData);
      // } catch (error) {
      //   console.error(error);
      // }
    })();
  }, [selectedBuild]);

  // useEffect(() => {
  //   ipcRenderer.on("num7", () => {
  //     decCounter();
  //   });

  //   // ipcRenderer.on("num8", async () => {
  //   //   const newData = await ipcRenderer.invoke(
  //   //     "db-query",
  //   //     `SELECT build_order.* FROM build_order JOIN categories ON build_order.category_id = categories.id WHERE categories.title = '${
  //   //       query.racePlayed + "v" + query.raceOpponent
  //   //     }';`
  //   //   );

  //     console.log("newData[selectedBuild].id : " + newData[selectedBuild].id);

  //     router.push({
  //       pathname: "/DisplayBuild",
  //       query: {
  //         racePlayed: query.racePlayed,
  //         raceOpponent: query.raceOpponent,

  //         build: newData[selectedBuild].id,
  //       },
  //     });
  //   });

  //   ipcRenderer.on("num9", () => {
  //     incCounter();
  //   });

  //   ipcRenderer.on("Ctrl+Shift+A", async () => {
  //     router.push({
  //       pathname: "/OpponentRace",
  //       query: { racePlayed: query.racePlayed },
  //     });
  //   });

  //   return () => {
  //     ipcRenderer.removeAllListeners("num7");
  //     ipcRenderer.removeAllListeners("num8");
  //     ipcRenderer.removeAllListeners("num9");
  //     ipcRenderer.removeAllListeners("Ctrl+Shift+A");
  //   };
  // }, [selectedBuild]);

  return (
    <Layout title={`Select your build order`}>
      <div className="flex flex-col justify-between gap-2 overflow-hidden">
        {data &&
          data.map((race, index) => (
            <div
              key={race.name}
              className="flex w-full flex-row items-center justify-between bg-black/50 px-3 py-1 text-zinc-300"
            >
              <p className={`text-lg`}>{race.title}</p>

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
