"use client";

import React, { createContext, useContext, useState } from "react";

type VideoInfo = {
  name: string;
  thumbnail: string | null;
  duration: number | null;
  videoUrl: string;
};

type FileDetailsContextType = {
  fileDetails: VideoInfo[];
  setFileDetails: React.Dispatch<React.SetStateAction<VideoInfo[]>>;
};

type FileDetailsProviderProps = { children: React.ReactNode };

const FileDetailsContext = createContext<FileDetailsContextType | undefined>(
  undefined
);

function FileDetailsProvider({ children }: FileDetailsProviderProps) {
  const [fileDetails, setFileDetails] = useState<VideoInfo[]>([]);

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
