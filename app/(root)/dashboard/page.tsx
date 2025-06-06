"use client";

import { useFileDetails } from "../../contexts/FileDetailsContext";
import { HandleFolderSelect } from "@/app/components/ui/shared/HandleFolderSelect";
import useDetectiPhone from "@/app/hooks/useDetectiPhone";
import { VideoList } from "@/app/components/dashboard/VideoList";

export default function Dashboard() {
  const { fileDetails, setFileDetails } = useFileDetails();
  useDetectiPhone();

  return (
    <main>
      <HandleFolderSelect
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
      />

      <VideoList files={fileDetails} />
    </main>
  );
}
