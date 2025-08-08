import { useMemo } from 'react'
import { products, formatPrice } from '../assets/products'

export default function ProductPage({ id }: { id: string }) { /* eslint-disable-line react-refresh/only-export-components */
  const product = useMemo(() => products.find(p => p.id === id) ?? products[0], [id])
  const lowStock = product.inventory < 10
  // Set title
  if (typeof document !== 'undefined') document.title = `${product.name} | Elm & Vine`
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-600" aria-label="Breadcrumbs">
        Home &gt; Wines &gt; {product.region} &gt; <span className="text-gray-900">{product.name}</span>
      </nav>
      <div className="mt-6 grid lg:grid-cols-2 gap-10">
        <div className="aspect-[2/3] bg-gray-900/5 rounded-xl overflow-hidden">
          <img src={product.image_url} alt={`${product.name} bottle`} className="size-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-serif">{product.name}</h1>
          <div className="mt-2 text-gray-600">{product.region}, {product.country} • {product.abv}% ABV • {product.volume_ml}ml</div>
          <div className="mt-4 text-3xl font-semibold">{formatPrice(product.price_cents)}</div>
          {lowStock && <div className="mt-2 text-sm text-red-700">Low stock: {product.inventory} left</div>}
          <div className="mt-4 flex items-center gap-3">
            <label htmlFor="qty" className="sr-only">Quantity</label>
            <input id="qty" type="number" min={1} defaultValue={1} className="w-20 rounded-lg border border-gray-300 px-3 py-2" />
            <button className="rounded-lg bg-amber-600 text-gray-900 font-semibold px-4 py-2 hover:bg-amber-500">Add to Cart</button>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-gray-600">Grape</dt><dd>{product.grape}</dd></div>
            <div><dt className="text-gray-600">Region</dt><dd>{product.region}</dd></div>
            <div><dt className="text-gray-600">Country</dt><dd>{product.country}</dd></div>
            <div><dt className="text-gray-600">ABV</dt><dd>{product.abv}%</dd></div>
            <div><dt className="text-gray-600">Volume</dt><dd>{product.volume_ml}ml</dd></div>
          </dl>
          <div className="mt-6">
            <div className="font-semibold">Flavor profile</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.flavor_notes.map(t => <span key={t} className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/70 px-4 py-2 text-sm hover:bg-white shadow-sm">{t}</span>)}
            </div>
          </div>
          <section className="mt-8 prose prose-slate max-w-none">
            <h2 className="font-serif">Tasting Notes</h2>
            <p>Balanced and expressive. A harmonious wine that over-delivers for the price.</p>
            <h3 className="font-serif">Food Pairings</h3>
            <ul>
              {product.pairings.map(p => <li key={p}>{p}</li>)}
            </ul>
          </section>
        </div>
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-serif">Related Wines</h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.filter(p => p.type === product.type && p.id !== product.id).slice(0,4).map(p => (
            <a key={p.id} href={`/product/${p.id}`} className="rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
              <div className="aspect-[2/3] bg-gray-900/5">
                <img src={p.image_url} alt={`${p.name} bottle`} className="size-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">{formatPrice(p.price_cents)}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        image: [product.image_url],
        brand: 'Elm & Vine',
        offers: {
          '@type': 'Offer', priceCurrency: 'USD', price: (product.price_cents/100).toFixed(2), availability: product.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        },
        aggregateRating: product.rating ? { '@type': 'AggregateRating', ratingValue: product.rating.toFixed(1), reviewCount: '128' } : undefined
      })}} />
    </div>
  )
}