import { Button } from "@nextui-org/react";
import { ipcRenderer } from "electron";

const LayoutSettings = ({ children }) => {
  return (
    <>
      <div className="bg-zinc-900">
        <p className="mx-auto py-2 pl-10 text-left font-mono text-2xl font-bold text-white">
          Settings
        </p>
      </div>

      <main>{children}</main>
    </>
  );
};

export default LayoutSettings;
