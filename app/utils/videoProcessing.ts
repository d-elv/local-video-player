import { VideoInfo } from "../types";

export async function processFile(file: File): Promise<VideoInfo> {
  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      // Captures thumbnail
      if (video.duration > 120) {
        video.currentTime = 60;
      } else {
        video.currentTime = 1;
      }
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth * 0.1;
      canvas.height = video.videoHeight * 0.1;

      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      let thumbnail = canvas.toDataURL("image/png", 0.1);

      resolve({
        name: file.name,
        thumbnail,
        duration: video.duration,
        videoUrl: video.src,
      });
    };
    video.addEventListener("error", function (event) {
      alert(
        `An error has occurred on file ${file.name.substring(
          0,
          -4
        )}... - Please check the console for details`
      );
      console.log(event.error);
    });
  });
}
