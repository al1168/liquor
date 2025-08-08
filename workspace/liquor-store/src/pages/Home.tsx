import { useEffect, useMemo, useState } from 'react'
import { products } from '../assets/products'
import { ProductCard } from '../components/ProductCard'

export default function Home() {
  useEffect(()=> { document.title = 'Elm & Vine | Great bottles. Fair prices.' }, [])
  const [sort, setSort] = useState<'best'|'priceAsc'|'priceDesc'|'rating'>('best')
  const featured = useMemo(()=> {
    const arr = products.slice(0, 12)
    switch (sort) {
      case 'priceAsc': return [...arr].sort((a,b)=> a.price_cents - b.price_cents)
      case 'priceDesc': return [...arr].sort((a,b)=> b.price_cents - a.price_cents)
      case 'rating': return [...arr].sort((a,b)=> (b.rating ?? 0) - (a.rating ?? 0))
      default: return arr
    }
  }, [sort])
  return (
    <>
      <section className="bg-[url('/images/hero-wine.svg')] bg-cover bg-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <p className="uppercase tracking-wide text-gray-600 text-xs">Discover your next favorite bottle</p>
          <h1 className="mt-2 text-4xl md:text-6xl font-serif">Great bottles. Fair prices.</h1>
          <p className="mt-4 max-w-xl text-gray-700">Curated wines, trusted favorites, and new discoveries—delivered or ready for pickup.</p>
          <div className="mt-6 flex flex-wrap gap-3" role="list" aria-label="Wine categories">
            {['Red','White','Rosé','Sparkling','Dessert'].map(c => (
              <a role="listitem" key={c} href={`/search?type=${encodeURIComponent(c)}`} className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/70 px-4 py-2 text-sm hover:bg-white shadow-sm" aria-label={`Filter by ${c}`}>{c}</a>
            ))}
          </div>
          <div className="mt-8">
            <a href="#wines" className="inline-flex items-center gap-2 rounded-lg bg-amber-600 text-gray-900 font-semibold px-5 py-3 shadow-sm hover:bg-amber-500">Shop Wines</a>
          </div>
        </div>
      </section>
      <section id="wines" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-serif">Featured Wines</h2>
          <div className="flex items-center gap-3">
            <label className="sr-only" htmlFor="sort">Sort</label>
            <select id="sort" value={sort} onChange={(e)=> setSort(e.target.value as any)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600/60">
              <option value="best">Best Selling</option>
              <option value="priceAsc">Price ↑</option>
              <option value="priceDesc">Price ↓</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  )
}