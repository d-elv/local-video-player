"use client";

import React, { createContext, useContext, useState } from "react";

type VideoInfoFromDbWithUrl = {
  id: string;
  user_id: string;
  file_name: string;
  thumbnail: string;
  progress: number;
  duration: number;
  videoUrl: string;
};

type VideoInfoFromDb = Omit<VideoInfoFromDbWithUrl, "videoUrl">;

type FileDetailsContextType = {
  fileDetails: VideoInfoFromDbWithUrl[];
  setFileDetails: React.Dispatch<
    React.SetStateAction<VideoInfoFromDbWithUrl[]>
  >;
};

type FileDetailsProviderProps = { children: React.ReactNode };

const FileDetailsContext = createContext<FileDetailsContextType | undefined>(
  undefined
);

function FileDetailsProvider({ children }: FileDetailsProviderProps) {
  const [fileDetails, setFileDetails] = useState<VideoInfoFromDbWithUrl[]>([]);

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
