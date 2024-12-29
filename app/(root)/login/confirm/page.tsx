import Link from "next/link";

export default function confirmPage() {
  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center text-nowrap flex-nowrap">
      <h3 className="text-xl md:text-3xl rounded-md bg-slate-400 p-2 pl-4 pr-4">
        Go to your email and click the link from Supabase!
      </h3>
      <button className="p-2 pl-4 pr-4 rounded-lg bg-chart-2 mt-4">
        <Link href="/dashboard" className="text-lg">
          Here by accident? Click here
        </Link>
      </button>
    </div>
  );
}
