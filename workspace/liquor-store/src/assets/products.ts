export type Product = {
  id: string
  name: string
  category: 'wine' | 'liquor' | 'spirits'
  type: 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Dessert'
  grape: string
  region: string
  country: string
  vintage?: number
  abv: number
  volume_ml: number
  price_cents: number
  rating?: number
  badges?: string[]
  inventory: number
  flavor_notes: string[]
  pairings: string[]
  image_url: string
}

export const products: Product[] = [
  {
    id: 'cab-demo-2021',
    name: 'Château Demo Cabernet Sauvignon 2021',
    category: 'wine',
    type: 'Red',
    grape: 'Cabernet Sauvignon',
    region: 'Napa Valley',
    country: 'USA',
    vintage: 2021,
    abv: 14.5,
    volume_ml: 750,
    price_cents: 3499,
    rating: 4.6,
    badges: ['Staff Pick'],
    inventory: 8,
    flavor_notes: ['blackcurrant', 'cedar', 'dark chocolate'],
    pairings: ['ribeye', 'mushroom risotto'],
    image_url: '/images/wines/sample-1.svg',
  },
  {
    id: 'pinot-northcoast-2022',
    name: 'North Coast Pinot Noir 2022',
    category: 'wine',
    type: 'Red',
    grape: 'Pinot Noir',
    region: 'North Coast',
    country: 'USA',
    vintage: 2022,
    abv: 13.5,
    volume_ml: 750,
    price_cents: 2599,
    rating: 4.4,
    badges: ['Best Value'],
    inventory: 24,
    flavor_notes: ['cherry', 'raspberry', 'spice'],
    pairings: ['salmon', 'pork tenderloin'],
    image_url: '/images/wines/sample-2.svg',
  },
  {
    id: 'albarino-rias-2023',
    name: 'Rías Baixas Albariño 2023',
    category: 'wine',
    type: 'White',
    grape: 'Albariño',
    region: 'Rías Baixas',
    country: 'Spain',
    vintage: 2023,
    abv: 12.5,
    volume_ml: 750,
    price_cents: 1899,
    rating: 4.3,
    badges: ['New'],
    inventory: 42,
    flavor_notes: ['citrus', 'peach', 'saline'],
    pairings: ['oysters', 'ceviche'],
    image_url: '/images/wines/sample-3.svg',
  },
  {
    id: 'prosecco-brut',
    name: 'Prosecco Brut NV',
    category: 'wine',
    type: 'Sparkling',
    grape: 'Glera',
    region: 'Veneto',
    country: 'Italy',
    abv: 11,
    volume_ml: 750,
    price_cents: 1599,
    rating: 4.2,
    badges: ['Bubbly'],
    inventory: 30,
    flavor_notes: ['pear', 'apple', 'almond'],
    pairings: ['brunch', 'fried chicken'],
    image_url: '/images/wines/sample-4.svg',
  },
  {
    id: 'rose-prov-2023',
    name: 'Provence Rosé 2023',
    category: 'wine',
    type: 'Rosé',
    grape: 'Grenache',
    region: 'Provence',
    country: 'France',
    vintage: 2023,
    abv: 12.5,
    volume_ml: 750,
    price_cents: 2099,
    rating: 4.1,
    badges: ['Staff Pick'],
    inventory: 15,
    flavor_notes: ['strawberry', 'melon', 'rose petal'],
    pairings: ['niçoise salad', 'grilled shrimp'],
    image_url: '/images/wines/sample-5.svg',
  },
  {
    id: 'sauternes-dessert',
    name: "Sauternes 'Les Demoiselles' 2018",
    category: 'wine',
    type: 'Dessert',
    grape: 'Sémillon',
    region: 'Bordeaux',
    country: 'France',
    vintage: 2018,
    abv: 13,
    volume_ml: 375,
    price_cents: 2999,
    rating: 4.7,
    badges: ['Small Format'],
    inventory: 6,
    flavor_notes: ['apricot', 'honey', 'saffron'],
    pairings: ['blue cheese', 'crème brûlée'],
    image_url: '/images/wines/sample-6.svg',
  },
]

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}