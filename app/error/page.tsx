import Link from "next/link";

export default function ErrorPage() {
  return (
    <>
      <p>Sorry, something went wrong</p>
      <Link href="/dashboard">
        <h1>Head back to the Dashboard</h1>
      </Link>
    </>
  );
}
