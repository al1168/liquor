import type { Product } from '../assets/products'
import { formatPrice } from '../assets/products'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden group" aria-labelledby={`prod-${product.id}`}>      
      <a href={`/product/${product.id}`} className="block aspect-[2/3] bg-gray-900/5 overflow-hidden">
        <img src={product.image_url} alt={`${product.name} bottle`} className="size-full object-cover transition group-hover:scale-105" loading="lazy" />
      </a>
      <div className="p-4">
        <a id={`prod-${product.id}`} href={`/product/${product.id}`} className="block font-medium line-clamp-2">{product.name}</a>
        <div className="mt-1 text-sm text-gray-600">{product.grape} • {product.region}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-semibold">{formatPrice(product.price_cents)}</div>
          {product.badges?.[0] && (
            <span className="text-xs rounded bg-amber-300/40 text-gray-900 px-2 py-1">{product.badges[0]}</span>
          )}
        </div>
        <div className="mt-3 hidden md:flex gap-2">
          <button className="rounded-lg px-4 py-2 hover:bg-gray-100" aria-label={`Quick view ${product.name}`}>Quick View</button>
          <button className="rounded-lg bg-amber-600 text-gray-900 font-semibold px-4 py-2 hover:bg-amber-500" aria-label={`Add ${product.name} to cart`}>Add to Cart</button>
        </div>
      </div>
    </article>
  )
}