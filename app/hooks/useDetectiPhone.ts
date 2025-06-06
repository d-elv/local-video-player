import { useEffect } from "react";

export default function useDetectiPhone() {
  useEffect(() => {
    if (window.navigator.userAgent.includes("iPhone")) {
      alert("We have detected you may be on an iPhone");
      alert("Please expect this app not to function correctly");
    }
  }, []);
}
