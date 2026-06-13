import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-canvas-deep border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-bold text-primary-700">Travel Buddy Finder</p>
            <p className="mt-2 text-sm text-stone-500">
              A free community helping elderly parents travel safely between India and the US.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/trips" className="text-stone-600 hover:text-primary-700 transition">
              Browse Trips
            </Link>
            <Link href="/contact" className="text-stone-600 hover:text-primary-700 transition">
              Contact
            </Link>
            <Link href="/privacy" className="text-stone-600 hover:text-primary-700 transition">
              Privacy
            </Link>
            <Link href="/terms" className="text-stone-600 hover:text-primary-700 transition">
              Terms
            </Link>
          </nav>
        </div>

        <p className="mt-8 text-xs text-stone-400">
          © {year} Travel Buddy Finder. Free and community-driven.
        </p>
      </div>
    </footer>
  )
}
