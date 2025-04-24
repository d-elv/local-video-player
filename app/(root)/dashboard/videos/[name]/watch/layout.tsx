import { Metadata } from "next";

type Props = {
  params: Promise<{ name: string }> | { name: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
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
