import { useEffect } from "react";
import { toast } from "sonner";

export function useDetectMobileDevice() {
  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice =
        window.matchMedia("(max-width: 500px)").matches ||
        window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      if (isMobileDevice) {
        toast.error("We have detected you may be on a mobile device", {
          description: "This app may not work as expected",
          style: { background: "#CA3F2E" },
        });
      }
    };

    checkDevice();
  }, []);
}
