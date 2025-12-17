/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

type PasscodeContextType = {
  passcode: string;
  setPasscode: (val: string) => void;
};

const PasscodeContext = createContext<PasscodeContextType | undefined>(
  undefined
);

export function PasscodeProvider({ children }: { children: ReactNode }) {
  const [passcode, setPasscode] = useState("");
  return (
    <PasscodeContext.Provider value={{ passcode, setPasscode }}>
      {children}
    </PasscodeContext.Provider>
  );
}

export function usePasscode() {
  const context = useContext(PasscodeContext);
  if (!context)
    throw new Error("usePasscode must be used inside PasscodeProvider");
  return context;
}
