import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center">
      <p className="text-red-600 font-bold text-xl">
        Sorry, something went wrong
      </p>
      <Link href="/dashboard">
        <h1 className="bg-secondary text-3xl rounded-lg pt-2 pb-2 pl-6 pr-6 m-4">
          Click here to head back to the Dashboard
        </h1>
      </Link>
      <h2>
        Which will send you to the login page if you aren't already logged in.
      </h2>
    </div>
  );
}
