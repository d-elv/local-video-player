// import { Metadata } from "next";
import SideNav from "../ui/dashboard/Sidenav";

// export const metadata: Metadata = {
//   title: {
//     template: "%s | Acme Dashboard",
//     default: "Acme Dashboard",
//   },
//   description: "The official Next.js Learn Dashboard built with App Router.",
//   metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
// };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col-reverse w-full h-screen md:flex-row md:overflow-hidden">
      <SideNav />
      <div className="flex-grow h-lvh p-6 md:p-12">{children}</div>
    </div>
  );
}
