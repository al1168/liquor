import debounce from 'lodash.debounce'
import type { Product } from '../assets/products'

export type Filters = {
  q?: string
  type?: Product['type']
  region?: string
  grape?: string
  minPrice?: number
  maxPrice?: number
  minAbv?: number
  maxAbv?: number
  sort?: 'best' | 'priceAsc' | 'priceDesc' | 'rating'
}

export function applyFilters(items: Product[], filters: Filters): Product[] {
  let res = items
  if (filters.q) {
    const term = filters.q.toLowerCase()
    res = res.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.grape.toLowerCase().includes(term) ||
      p.region.toLowerCase().includes(term) ||
      p.type.toLowerCase().includes(term)
    )
  }
  if (filters.type) res = res.filter(p => p.type === filters.type)
  if (filters.region) res = res.filter(p => p.region === filters.region)
  if (filters.grape) res = res.filter(p => p.grape === filters.grape)
  if (filters.minPrice != null) res = res.filter(p => p.price_cents >= Math.round(filters.minPrice! * 100))
  if (filters.maxPrice != null) res = res.filter(p => p.price_cents <= Math.round(filters.maxPrice! * 100))
  if (filters.minAbv != null) res = res.filter(p => p.abv >= filters.minAbv!)
  if (filters.maxAbv != null) res = res.filter(p => p.abv <= filters.maxAbv!)

  switch (filters.sort) {
    case 'priceAsc':
      res = [...res].sort((a,b)=> a.price_cents - b.price_cents)
      break
    case 'priceDesc':
      res = [...res].sort((a,b)=> b.price_cents - a.price_cents)
      break
    case 'rating':
      res = [...res].sort((a,b)=> (b.rating ?? 0) - (a.rating ?? 0))
      break
    default:
      break
  }
  return res
}

export const debouncedNavigate = debounce((fn: (url: string)=>void, url: string)=> fn(url), 250)

export function filtersToQuery(filters: Filters): string {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.type) params.set('type', filters.type)
  if (filters.region) params.set('region', filters.region)
  if (filters.grape) params.set('grape', filters.grape)
  if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice))
  if (filters.minAbv != null) params.set('minAbv', String(filters.minAbv))
  if (filters.maxAbv != null) params.set('maxAbv', String(filters.maxAbv))
  if (filters.sort) params.set('sort', filters.sort)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function queryToFilters(search: string): Filters {
  const p = new URLSearchParams(search)
  return {
    q: p.get('q') ?? undefined,
    type: (p.get('type') as any) ?? undefined,
    region: p.get('region') ?? undefined,
    grape: p.get('grape') ?? undefined,
    minPrice: p.get('minPrice') ? Number(p.get('minPrice')) : undefined,
    maxPrice: p.get('maxPrice') ? Number(p.get('maxPrice')) : undefined,
    minAbv: p.get('minAbv') ? Number(p.get('minAbv')) : undefined,
    maxAbv: p.get('maxAbv') ? Number(p.get('maxAbv')) : undefined,
    sort: (p.get('sort') as any) ?? undefined,
  }
}