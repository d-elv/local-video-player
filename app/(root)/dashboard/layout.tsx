// import { Metadata } from "next";
import SideNav from "../../components/ui/dashboard/Sidenav";

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
    <div className="flex flex-col-reverse flex-grow w-full h-svh md:flex-row md:overflow-hidden">
      <SideNav />
      <div className="h-lvh overflow-x-hidden flex-grow p-6 md:p-12">
        {children}
      </div>
    </div>
  );
}
