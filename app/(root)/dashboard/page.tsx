"use client";

import { formatDuration } from "@/app/utils/general/formatters";
import Link from "next/link";
import { useFileDetails } from "../../contexts/FileDetailsContext";
import { useEffect, useState } from "react";
import { HandleFolderSelect } from "@/app/components/ui/shared/HandleFolderSelect";
import { createClient } from "@/app/utils/supabase/client";
import { HandleFolderSelectNoDb } from "@/app/components/ui/shared/HandleFolderSelectNoDb";

export default function Dashboard() {
  const { fileDetails, setFileDetails } = useFileDetails();
  const [sessionWithEmail, setSessionWithEmail] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log(error);
      }

      if (data.session?.user.email) {
        setSessionWithEmail(true);
      } else {
        setSessionWithEmail(false);
      }
    }
    checkSession();
  }, []);

  useEffect(() => {
    function iPhoneDetector() {
      if (window.navigator.userAgent.includes("iPhone")) {
        alert("We have detected you are on an iPhone");
        alert("Please expect this app not to function correctly");
      }
    }
    iPhoneDetector();
  }, []);

  return (
    <main>
      {sessionWithEmail ? (
        <HandleFolderSelect setFileDetails={setFileDetails} />
      ) : (
        <HandleFolderSelectNoDb setFileDetails={setFileDetails} />
      )}

      {fileDetails.length > 0 ? (
        <ul>
          {fileDetails.map((file, index) => {
            return (
              <li className="mt-2 bg-sky-300 rounded-lg" key={index}>
                <Link
                  href={{
                    pathname: `/dashboard/videos/${file.file_name}/watch`,
                    query: {
                      videoUrl: file.videoUrl,
                      progress: file.progress,
                    },
                  }}
                  className="h-full flex items-center justify-start hover:bg-sky-400 rounded-lg transition-all"
                >
                  {file.thumbnail ? (
                    <img
                      alt={`Thumbnail of video titled ${file.file_name}`}
                      src={file.thumbnail}
                      className="w-[102px] h-[72px] object-cover rounded-tl-lg rounded-bl-lg"
                    />
                  ) : null}
                  <p className="text-black truncate ml-2 lg:ml-4">
                    {file.file_name}
                  </p>
                  {file.duration ? (
                    <p className="text-black ml-auto mr-2 max-w-full lg:mr-4">
                      {formatDuration(file.duration)}
                    </p>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2">Selected files will appear here</p>
      )}
    </main>
  );
}