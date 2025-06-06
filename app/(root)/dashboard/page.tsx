"use client";

import { useFileDetails } from "../../contexts/FileDetailsContext";
import { HandleFolderSelect } from "@/app/components/ui/shared/HandleFolderSelect";
import { VideoList } from "@/app/components/dashboard/VideoList";
import { useDetectMobileDevice } from "@/app/hooks/useDetectMobileDevice";
import { Toaster } from "@/app/components/ui/sonner";

export default function Dashboard() {
  const { fileDetails, setFileDetails } = useFileDetails();
  useDetectMobileDevice();

  return (
    <main>
      <HandleFolderSelect
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
      />

      <VideoList files={fileDetails} />
      <Toaster />
    </main>
  );
}
