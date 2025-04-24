import { Metadata } from "next";

type Props = {
  params: { name: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const videoName = decodeURI(
    resolvedParams.name.substring(0, resolvedParams.name.length - 4) || ""
  );

  return {
    title: `Watching ${videoName}`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
