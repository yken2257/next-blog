import Link from "next/link"
import Search from "./Search"

export default function Header() {
  return (
    <header className="mb-4">
      <nav className="rounded bg-sky-200 p-3 flex justify-between">
        <div className="text-white text-xl">
          <Link className="text-white text-xl" href="/">Shiro space</Link>
        </div>
        {/* <div className="flex space-x-5">
          <Link href="/" className="text-white text-lg hover:underline">Home</Link>
          <Link href="/blog" className="text-white text-lg hover:underline">Blog</Link>
        </div> */}
        <div className="flex space-x-5">
          <Search />
        </div>
      </nav>
    </header>
  )
}