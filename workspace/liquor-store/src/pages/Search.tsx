import { useEffect, useMemo } from 'react'
import { products } from '../assets/products'
import { applyFilters, filtersToQuery, queryToFilters, type Filters } from '../lib/search'

export default function Search() {
  useEffect(()=> { document.title = 'Search | Elm & Vine' }, [])
  const params = typeof window !== 'undefined' ? window.location.search : ''
  const filters = useMemo<Filters>(() => queryToFilters(params), [params])
  const results = useMemo(() => applyFilters(products, filters), [filters])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-serif">Search</h1>

      <div className="mt-6 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block">
          <FilterSidebar filters={filters} />
        </aside>
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden"><FilterDrawer filters={filters} /></div>
            <p className="text-sm text-gray-600">{results.length} results</p>
            <SortSelect filters={filters} />
          </div>
          {results.length === 0 ? (
            <div className="mt-10 text-gray-600">No matches yet. Try a different grape, region, or a lower price.</div>
          ) : (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
              {results.map(p => (
                <a key={p.id} href={`/product/${p.id}`} className="rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
                  <div className="aspect-[2/3] bg-gray-900/5">
                    <img src={p.image_url} alt={`${p.name} bottle`} className="size-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-600">${(p.price_cents/100).toFixed(2)}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 grid grid-cols-3 gap-3 text-sm">
          <a href="#" className="rounded-lg px-3 py-2 text-center hover:bg-gray-100">Filters</a>
          <a href="#" className="rounded-lg px-3 py-2 text-center hover:bg-gray-100">Sort</a>
          <a href="/search" className="rounded-lg px-3 py-2 text-center bg-amber-600 text-gray-900 font-semibold hover:bg-amber-500">Search</a>
        </div>
      </div>
    </div>
  )
}

function navigateWith(next: Filters) {
  const url = `/search${filtersToQuery(next)}`
  window.history.replaceState(null, '', url)
}

function FilterSidebar({ filters }: { filters: Filters }) {
  const minPrice = Number(filters.minPrice ?? 0)
  const maxPrice = Number(filters.maxPrice ?? 100)

  return (
    <form className="space-y-6" onChange={(e) => {
      const form = e.currentTarget as HTMLFormElement
      const data = new FormData(form)
      navigateWith({
        ...filters,
        type: (data.get('type') as any) || undefined,
        region: (data.get('region') as string) || undefined,
        grape: (data.get('grape') as string) || undefined,
        minPrice: data.get('minPrice') ? Number(data.get('minPrice')) : undefined,
        maxPrice: data.get('maxPrice') ? Number(data.get('maxPrice')) : undefined,
        minAbv: data.get('minAbv') ? Number(data.get('minAbv')) : undefined,
        maxAbv: data.get('maxAbv') ? Number(data.get('maxAbv')) : undefined,
      })
    }}>
      <fieldset>
        <legend className="font-semibold">Type</legend>
        <select name="type" defaultValue={filters.type} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2">
          <option value="">All</option>
          {['Red','White','Rosé','Sparkling','Dessert'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </fieldset>
      <fieldset>
        <legend className="font-semibold">Region</legend>
        <input name="region" defaultValue={filters.region} placeholder="e.g., Napa Valley" className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" />
      </fieldset>
      <fieldset>
        <legend className="font-semibold">Grape / Varietal</legend>
        <input name="grape" defaultValue={filters.grape} placeholder="e.g., Cabernet" className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" />
      </fieldset>
      <fieldset>
        <legend className="font-semibold">Price range ($0–$100)</legend>
        <div className="mt-2 space-y-3">
          <label className="block text-sm text-gray-600">Min: ${minPrice}</label>
          <input type="range" name="minPrice" min={0} max={100} defaultValue={minPrice} className="w-full" />
          <label className="block text-sm text-gray-600">Max: ${maxPrice}</label>
          <input type="range" name="maxPrice" min={0} max={100} defaultValue={maxPrice} className="w-full" />
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-semibold">ABV (%)</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600" htmlFor="minAbv">Min</label>
            <input id="minAbv" name="minAbv" type="number" min={0} max={20} step={0.5} defaultValue={filters.minAbv} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600" htmlFor="maxAbv">Max</label>
            <input id="maxAbv" name="maxAbv" type="number" min={0} max={20} step={0.5} defaultValue={filters.maxAbv} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2" />
          </div>
        </div>
      </fieldset>
    </form>
  )
}

function FilterDrawer({ filters }: { filters: Filters }) {
  return (
    <details className="lg:hidden">
      <summary className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/60 px-4 py-2 text-sm hover:bg-white shadow-sm cursor-pointer">Filters</summary>
      <div className="mt-4 p-4 rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        <FilterSidebar filters={filters} />
      </div>
    </details>
  )
}

function SortSelect({ filters }: { filters: Filters }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">Sort</span>
      <select defaultValue={filters.sort} onChange={(e)=> navigateWith({ ...filters, sort: (e.target.value as any) })} className="rounded-lg border border-gray-300 bg-white px-3 py-2">
        <option value="best">Best Selling</option>
        <option value="priceAsc">Price ↑</option>
        <option value="priceDesc">Price ↓</option>
        <option value="rating">Rating</option>
      </select>
    </label>
  )
}