import { useEffect, useRef, useState } from "react";
import { type MsgFormat } from "../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getSuggestions } from "@/lib/command";
import { usePasscode } from "@/lib/Passcode";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Check, ChevronRight, CircleStop } from "lucide-react";
import { LogViewer } from "@/components/terminal";

function App() {
  const [stat, setStat] = useState<MsgFormat>();
  const ws = useRef<WebSocket | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<MsgFormat[]>([]);
  const [cmd, setCmd] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { passcode } = usePasscode();

  const handleWsMessage = (event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data) as MsgFormat;
      if (msg.type != "log") {
        toast(msg.status + ": " + msg.payload);
      } else {
        setLogs((prev) => [...prev, msg]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch("/api/ping")
      .then((res) => res.json())
      .then((data: MsgFormat) => {
        setStat(data);
        toast(data.status);
      })
      .catch(() => {
        toast("error fetching status");
      });

    fetch("/api/status", {
      method: "POST",
      body: JSON.stringify({ passcode: passcode }),
    })
      .then((res) => res.json())
      .then((data: { running: boolean; sessionID: string }) => {
        setIsRunning(data.running);
      })
      .catch(() => {
        toast("error fetching status");
      });

    if (isRunning) {
      ws.current = new WebSocket("ws://localhost:8080/api/ws");
      ws.current.onopen = () => {
        toast("WebSocket connected");
        // @ts-expect-error what did you meant by possibly null?
        ws.current.send(JSON.stringify({ passcode: passcode }));
      };
      ws.current.onmessage = handleWsMessage;
      ws.current.onclose = () => console.log("WebSocket closed");
      ws.current.onerror = (error) => console.error(error);
    }

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [isRunning]);

  const startService = () => {
    fetch("/api/start", {
      method: "POST",
      body: JSON.stringify({ passcode: passcode }),
    })
      .then((res) => res.json())
      .then((data: MsgFormat) => {
        setStat(data);
        setIsRunning(true);
        toast(data.status);
      })
      .catch(() => toast("error starting service"));
  };

  const stopService = () => {
    fetch("/api/stop", {
      method: "POST",
      body: JSON.stringify({ passcode: passcode }),
    })
      .then((res) => res.json())
      .then((data: MsgFormat) => {
        setStat(data);
        setIsRunning(false);
        toast(data.status);
        setCmd("");
      })
      .catch(() => toast("error stopping service"));
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-950 p-4">
      <SidebarToggle />
      {stat ? (
        <div className="flex">
          <p
            className={`rounded-2xl p-1 m-2 text-white ${
              stat.status === "running" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {stat.payload}
          </p>
        </div>
      ) : (
        <div className="flex">
          <p className="text-3xl text-white">Fetching status...</p>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <Button
          type="button"
          variant={"secondary"}
          onClick={startService}
          disabled={isRunning}
        >
          <Check />
          Start
        </Button>
        <Button
          type="button"
          variant={"destructive"}
          onClick={stopService}
          disabled={!isRunning}
        >
          <CircleStop />
          Stop
        </Button>
      </div>

      <div className="mt-8">
        <LogViewer logs={logs} onClear={() => setLogs([])} />

        {suggestions.length > 0 && cmd.trim() !== "" && (
          <div className="bg-gray-700 rounded p-2 mt-1 max-h-40 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <p
                key={idx}
                className="text-white cursor-pointer hover:bg-gray-600 p-1 rounded"
                onClick={() => {
                  const tokens = cmd.trim().split(/\s+/);
                  tokens[tokens.length - 1] = s;
                  setCmd(tokens.join(" ") + " ");
                  setSuggestions([]);
                }}
              >
                {s}
              </p>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-1">
          <Input
            type="text"
            placeholder="Enter command"
            disabled={!isRunning}
            value={cmd}
            onChange={(e) => {
              const value = e.target.value;
              setCmd(value);
              const trimmed = value.trim();
              if (trimmed === "") {
                setSuggestions([]);
                return;
              }
              const tokens = trimmed.split(/\s+/);
              const lastToken = tokens.pop() || "";
              const nextSuggestions = getSuggestions(tokens).filter((s) =>
                s.startsWith(lastToken)
              );
              setSuggestions(nextSuggestions);
            }}
            className="text-white"
          />
          <Button
            type="button"
            variant={"secondary"}
            disabled={cmd === ""}
            onClick={() => {
              ws.current?.send(JSON.stringify({ command: cmd }));
              setCmd("");
            }}
          >
            Send <ChevronRight />
          </Button>
        </div>
        <span className="text-sm text-gray-700">
          Commands suggested here are from{" "}
          <a
            target="_blank"
            href="https://github.com/PrismarineJS/minecraft-data/blob/master/data/pc/1.15.2/commands.json"
          >
            mc data
          </a>
        </span>
      </div>
    </div>
  );
}

export default App;
