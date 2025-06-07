import { VideoInfo, VideoInfoFromConvex } from "../types";
import { useState } from "react";
import { processFile } from "../utils/videoProcessing";
import { toast } from "sonner";

export function useFilePicker(
  insertToConvex: (details: VideoInfo[]) => Promise<VideoInfoFromConvex[]>,
  setFileDetails: (file: VideoInfoFromConvex[]) => void
) {
  const [fileCountDiscrepancy, setFileCountDiscrepancy] = useState(0);
  const [fileCount, setFileCount] = useState(0);

  async function handleShowPicker() {
    try {
      const handle = await showDirectoryPicker({ startIn: "downloads" });
      const details: VideoInfo[] = [];
      let fileCountLocal = 0;

      async function getFiles(handle: FileSystemDirectoryHandle) {
        setFileDetails([]);
        setFileCount(0);
        setFileCountDiscrepancy(0);
        const filesToProcess = [];
        for await (const entry of handle.values()) {
          if (entry.kind === "file") {
            const file = await entry.getFile();
            if (file.name !== ".DS_Store") {
              fileCountLocal++;
            }
            if (!file.type.startsWith("video/")) continue;
            filesToProcess.push(file);
          }
        }
        return filesToProcess;
      }

      const filesToProcess = await getFiles(handle);
      setFileCount(fileCountLocal);

      await Promise.all(
        filesToProcess.map(async (file) => {
          details.push(await processFile(file));
        })
      );
      const pickedVideos = await insertToConvex(details);
      const filesToList = pickedVideos.length;

      if (filesToList < fileCountLocal) {
        setFileCountDiscrepancy(fileCountLocal - filesToList);
      }

      setFileDetails(pickedVideos);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        toast.error(
          "An unexpected error has occurred. Please raise an issue report with Dan Elvey"
        );
      }
    }
  }

  return { handleShowPicker, fileCount, fileCountDiscrepancy };
}
