"use client";

import { useFileDetails } from "../../contexts/FileDetailsContext";
import { HandleFileSelect } from "@/app/components/dashboard/HandleFileSelect";
import { VideoList } from "@/app/components/dashboard/VideoList";
import { useDetectMobileDevice } from "@/app/hooks/useDetectMobileDevice";
import { Toaster } from "@/app/components/ui/sonner";

export default function Dashboard() {
  const { fileDetails, setFileDetails } = useFileDetails();
  useDetectMobileDevice();

  return (
    <main>
      <HandleFileSelect
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
      />

      <VideoList files={fileDetails} />
      <Toaster />
    </main>
  );
}
