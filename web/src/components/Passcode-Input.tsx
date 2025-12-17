import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import type { MsgFormat } from "types";
import { usePasscode } from "@/lib/Passcode";

function Passcode() {
  const { setPasscode } = usePasscode();
  return (
    <div className="flex flex-col items-center justify-center bg-gray-950 h-screen w-screen text-white gap-6">
      <div className="m-4 p-6 bg-black rounded-2xl flex flex-col items-center gap-4 shadow-lg drop-shadow-2xl drop-shadow-gray-900 shadow-amber-900">
        <h1 className="text-2xl">Welcome, please enter your passcode</h1>
        <InputOTP
          maxLength={6}
          onComplete={(e) => {
            fetch("/api/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ passcode: e }),
            })
              .then((res) => res.json())
              .then((data: MsgFormat) => {
                if (data.status === "passed") {
                  setPasscode(e);
                  toast(data.status);
                } else if (data.status === "failed") {
                  toast(data.status);
                }
              });
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </div>
  );
}

export default Passcode;
