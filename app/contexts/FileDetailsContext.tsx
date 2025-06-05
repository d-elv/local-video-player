"use client";

import React, { createContext, useContext, useState } from "react";
import { VideoInfoFromConvex } from "@/app/types";

type FileDetailsContextType = {
  fileDetails: VideoInfoFromConvex[];
  setFileDetails: React.Dispatch<React.SetStateAction<VideoInfoFromConvex[]>>;
};

type FileDetailsProviderProps = { children: React.ReactNode };

const FileDetailsContext = createContext<FileDetailsContextType | undefined>(
  undefined
);

function FileDetailsProvider({ children }: FileDetailsProviderProps) {
  const [fileDetails, setFileDetails] = useState<VideoInfoFromConvex[]>([]);

  return (
    <FileDetailsContext.Provider value={{ fileDetails, setFileDetails }}>
      {children}
    </FileDetailsContext.Provider>
  );
}

function useFileDetails() {
  const context = useContext(FileDetailsContext);

  if (!context) {
    throw new Error("useFileDetails must be used within a FileDetailsProvider");
  }
  return context;
}

export { FileDetailsProvider, useFileDetails };
