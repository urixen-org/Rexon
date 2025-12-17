import { type MsgFormat } from "@/../types";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface LogViewerProps {
  logs: MsgFormat[];
  onClear: () => void;
}

export function LogViewer({ logs, onClear }: LogViewerProps) {
  return (
    <div className="mt-8">
      <h2 className="text-3xl text-white mb-4 flex items-center gap-4">
        Terminal Logs
        <Button
          variant={"destructive"}
          onClick={() => onClear()}
          disabled={logs.length === 0}
        >
          {" "}
          <Trash2 /> Clear{" "}
        </Button>
      </h2>

      <div className="bg-gray-800 p-4 rounded h-64 overflow-y-auto">
        {logs.map((log, index) => {
          const isStdout = log.status === "STDOUT";

          return (
            <p
              key={index}
              className={
                "text-gray-200 text-sm flex items-center gap-2" +
                (isStdout ? " text-green-400" : " text-red-400")
              }
            >
              {log.payload}
            </p>
          );
        })}
      </div>
    </div>
  );
}
