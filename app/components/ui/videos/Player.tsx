import { MutableRefObject } from "react";

type Props = {
  ref: MutableRefObject<HTMLVideoElement> | null;
  currentTime: number;
  videoUrl: string;
};

export default function Player(props: Props) {
  const { ref, currentTime, videoUrl } = props;

  return (
    <main>
      <video style={{ display: "grid", width: "100%" }} ref={ref} controls>
        <source src={videoUrl} type="video/mp4" />
      </video>
    </main>
  );
}
