import { Suspense } from 'react'
import { BrowserRouter, Route, Routes, useNavigate, useParams, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Product from './pages/Product'
import Search from './pages/Search'
import debounce from 'lodash.debounce'

function Header() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const currentQ = new URLSearchParams(search).get('q') || ''
  const debounced = debounce((value: string)=> {
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search')
  }, 250)
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const q = String(data.get('q') || '')
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }
  return (
    <header className="sticky top-0 z-40 bg-white/90 border-b border-gray-200 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-6 py-4">
        <a href="/" className="font-serif text-2xl tracking-tight">Elm &amp; Vine</a>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <a className="hover:underline" href="/search?type=Red">Wines</a>
          <a className="hover:underline" href="/search?category=spirits">Spirits</a>
          <a className="hover:underline" href="/search?category=liquor">Liquor</a>
          <a className="hover:underline" href="#about">About</a>
          <a className="hover:underline" href="#contact">Contact</a>
        </nav>
        <form onSubmit={onSubmit} className="ms-auto flex items-center gap-3 w-full max-w-md">
          <label htmlFor="q" className="sr-only">Search</label>
          <input id="q" name="q" defaultValue={currentQ} onChange={(e)=> debounced(e.target.value)} aria-label="Search" placeholder="Search wines, grapes, regions..." className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600/60" />
          <button className="rounded-lg px-3 py-2 hover:bg-gray-100" aria-label="Submit search">Search</button>
          <button type="button" className="rounded-lg px-3 py-2 hover:bg-gray-100" aria-label="Cart"><span aria-hidden>🛒</span></button>
        </form>
      </div>
    </header>
  )
}

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/product/:id" element={<ProductRoute/>} />
          <Route path="/search" element={<Search/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 py-10 text-sm">
          <div>
            <div className="font-serif text-xl">Elm &amp; Vine</div>
            <p className="mt-2 text-gray-600">Great bottles. Fair prices.</p>
            <p className="mt-4">123 Oak Street, Springfield</p>
            <p>Mon–Sat 10–9, Sun 12–6</p>
            <p>(555) 123-4567</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Follow</div>
            <div className="flex gap-3">
              <a className="hover:underline" href="#">Instagram</a>
              <a className="hover:underline" href="#">Facebook</a>
              <a className="hover:underline" href="#">X</a>
            </div>
          </div>
          <form className="md:justify-self-end">
            <label className="block font-semibold" htmlFor="nl">Newsletter</label>
            <div className="mt-2 flex gap-2">
              <input id="nl" type="email" placeholder="you@example.com" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600/60" />
              <button className="rounded-lg bg-amber-600 text-gray-900 font-semibold px-4 py-2 hover:bg-amber-500">Sign up</button>
            </div>
          </form>
        </div>
      </footer>
    </div>
  )
}

function ProductRoute() {
  const { id = '' } = useParams()
  return <Product id={id} />
}

function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-3xl font-serif">Page not found</h1>
      <a href="/" className="inline-flex mt-6 px-5 py-3 rounded-lg bg-amber-600 text-gray-900 font-semibold hover:bg-amber-500">Back home</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">Loading…</div>}>
        <AppShell />
      </Suspense>
    </BrowserRouter>
  )
}
