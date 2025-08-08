import { PRODUCTS, FEATURED_IDS } from './data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const state = {
  cartCount: Number(localStorage.getItem('cartCount') || '0'),
};

const formatPrice = cents => `$${(cents / 100).toFixed(2)}`;

function getHashRoute() {
  const hash = location.hash || '#/';
  const [path, query] = hash.replace(/^#/, '').split('?');
  return { path, params: new URLSearchParams(query || '') };
}

function setHashRoute(path, params) {
  const qs = params && [...params.entries()].length ? `?${params.toString()}` : '';
  const newHash = `#${path}${qs}`;
  if (location.hash !== newHash) location.hash = newHash;
}

function upsertParams(updates) {
  const { path, params } = getHashRoute();
  for (const [k, v] of Object.entries(updates)) {
    if (v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) {
      params.delete(k);
    } else if (Array.isArray(v)) {
      params.set(k, v.join(','));
    } else {
      params.set(k, String(v));
    }
  }
  setHashRoute(path, params);
}

function initHeader() {
  const cartBtn = $('#cart-button');
  const cartCountEl = $('.cart-count');
  cartCountEl.textContent = String(state.cartCount);

  function announce(msg) {
    const live = document.createElement('div');
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    live.className = 'sr-only';
    live.textContent = msg;
    document.body.appendChild(live);
    setTimeout(() => live.remove(), 500);
  }

  window.addEventListener('add-to-cart', (e) => {
    state.cartCount += e.detail?.qty || 1;
    localStorage.setItem('cartCount', String(state.cartCount));
    cartCountEl.textContent = String(state.cartCount);
    announce('Added to cart');
  });

  // Header search
  const form = $('#header-search');
  const input = $('#hdr-search');
  const debouncedNavigate = debounce((q) => {
    const { path, params } = getHashRoute();
    if (path !== '/'){
      const next = new URLSearchParams(params.toString());
      if (q) next.set('q', q); else next.delete('q');
      setHashRoute('/', next);
      return;
    }
    if (q) params.set('q', q); else params.delete('q');
    setHashRoute('/', params);
  }, 300);
  form.addEventListener('submit', (e) => { e.preventDefault(); const q = input.value.trim(); debouncedNavigate.cancel?.(); const { params } = getHashRoute(); if (q) { params.set('q', q); } else { params.delete('q'); } setHashRoute('/', params); });
  input.addEventListener('input', (e) => { debouncedNavigate(e.target.value.trim()); });

  // Mobile sticky
  $('#mobile-filters-toggle')?.addEventListener('click', () => document.body.classList.toggle('show-filters'));
  $('#mobile-sort-toggle')?.addEventListener('click', () => {
    const select = $('#sort');
    select?.focus();
  });
  $('#mobile-search-toggle')?.addEventListener('click', () => input?.focus());
}

function debounce(fn, ms) {
  let t;
  const wrapped = (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  wrapped.cancel = () => clearTimeout(t);
  return wrapped;
}

function render() {
  const root = $('#app');
  const { path } = getHashRoute();
  if (path.startsWith('/product/')) {
    const id = path.split('/')[2];
    renderProductDetail(root, id);
  } else if (path === '/about') {
    root.innerHTML = `<section class="hero"><h1>About</h1><p>We are your neighborhood shop for great bottles at fair prices.</p></section>`;
  } else if (path === '/contact') {
    root.innerHTML = `<section class="hero"><h1>Contact</h1><p>Email us at hello@example.com or visit the shop during open hours.</p></section>`;
  } else {
    renderHome(root);
  }
  $('#year').textContent = String(new Date().getFullYear());
}

function renderHome(root) {
  const { params } = getHashRoute();
  const category = params.get('category') || 'wine';
  const type = (params.get('type') || '').split(',').filter(Boolean);
  const region = (params.get('region') || '').split(',').filter(Boolean);
  const grape = (params.get('grape') || '').split(',').filter(Boolean);
  const q = (params.get('q') || '').toLowerCase();
  const sort = params.get('sort') || 'best';
  const [pmin, pmax] = (params.get('price') || '0-200').split('-').map(n => Number(n));
  const [amin, amax] = (params.get('abv') || '0-100').split('-').map(n => Number(n));

  const hero = `
    <section class="hero">
      <h1>Great bottles. Fair prices.</h1>
      <p>Curated wines, trusted favorites, and new discoveries—delivered or ready for pickup.</p>
      <div class="banner" aria-hidden="true">
        <img src="https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=1600&auto=format&fit=crop" width="1600" height="800" alt="" loading="eager" />
      </div>
      <div class="hero-cta">
        <a class="btn-primary" href="#/?category=wine">Shop Wines</a>
        <div class="category-pills" role="group" aria-label="Wine types">
          ${['Red','White','Rosé','Sparkling','Dessert'].map(t => `<button class="pill" aria-pressed="${type.includes(t)}" data-type-pill="${t}">${t}</button>`).join('')}
        </div>
      </div>
    </section>
  `;

  const all = PRODUCTS.slice();
  const visible = all.filter(p => {
    if (category && p.category !== category) return false;
    if (type.length && !type.includes(p.type)) return false;
    if (region.length && !region.includes(p.region)) return false;
    if (grape.length && (!p.grape || !grape.includes(p.grape))) return false;
    if (p.price_cents < pmin * 100 || p.price_cents > pmax * 100) return false;
    if (p.abv < amin || p.abv > amax) return false;
    if (q) {
      const hay = `${p.name} ${p.grape||''} ${p.region} ${p.type} ${p.country}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const sorters = {
    'best': (a,b) => (b.rating||0) - (a.rating||0),
    'price_asc': (a,b) => a.price_cents - b.price_cents,
    'price_desc': (a,b) => b.price_cents - a.price_cents,
    'rating': (a,b) => (b.rating||0) - (a.rating||0),
  };
  visible.sort(sorters[sort] || sorters.best);

  const allRegions = [...new Set(PRODUCTS.filter(p => p.category === category && p.region).map(p => p.region))].sort();
  const allGrapes = [...new Set(PRODUCTS.filter(p => p.category === 'wine' && p.grape).map(p => p.grape))].sort();

  const sidebar = `
    <aside class="sidebar filters" aria-label="Filters">
      <div class="filter-group">
        <h3>Price range ($)</h3>
        <div class="range">
          <label class="sr-only" for="price-min">Min price</label>
          <input id="price-min" type="number" min="0" max="1000" step="1" value="${pmin}" />
          <label class="sr-only" for="price-max">Max price</label>
          <input id="price-max" type="number" min="0" max="1000" step="1" value="${pmax}" />
        </div>
        <div id="price-slider" class="slider" aria-label="Price range slider"></div>
      </div>
      <div class="filter-group">
        <h3>ABV (%)</h3>
        <div class="range">
          <label class="sr-only" for="abv-min">Min ABV</label>
          <input id="abv-min" type="number" min="0" max="100" step=".5" value="${amin}" />
          <label class="sr-only" for="abv-max">Max ABV</label>
          <input id="abv-max" type="number" min="0" max="100" step=".5" value="${amax}" />
        </div>
        <div id="abv-slider" class="slider" aria-label="ABV range slider"></div>
      </div>
      <details>
        <summary><span>Type</span><span class="caret">▾</span></summary>
        <div class="section-body">
          ${['Red','White','Rosé','Sparkling','Dessert'].map(t => `
            <label><input type="checkbox" name="type" value="${t}" ${type.includes(t)?'checked':''}/> ${t}</label>
          `).join('')}
        </div>
      </details>
      <details>
        <summary><span>Region</span><span class="caret">▾</span></summary>
        <div class="section-body options">
          ${allRegions.map(r => `
            <label><input type="checkbox" name="region" value="${r}" ${region.includes(r)?'checked':''}/> ${r}</label>
          `).join('')}
        </div>
      </details>
      ${category==='wine' ? `
      <details>
        <summary><span>Grape/Varietal</span><span class="caret">▾</span></summary>
        <div class="section-body options">
          ${allGrapes.map(g => `
            <label><input type="checkbox" name="grape" value="${g}" ${grape.includes(g)?'checked':''}/> ${g}</label>
          `).join('')}
        </div>
      </details>` : ''}
      <button id="apply-filters" class="btn-primary" style="width:100%">Apply Filters</button>
    </aside>
  `;

  const resultsBar = `
    <div class="results-bar">
      <div>${visible.length} result${visible.length===1?'':'s'}</div>
      <div class="sort">
        <label for="sort">Sort</label>
        <select id="sort" name="sort">
          <option value="best" ${sort==='best'?'selected':''}>Best Selling</option>
          <option value="price_asc" ${sort==='price_asc'?'selected':''}>Price ↑</option>
          <option value="price_desc" ${sort==='price_desc'?'selected':''}>Price ↓</option>
          <option value="rating" ${sort==='rating'?'selected':''}>Rating</option>
        </select>
      </div>
    </div>
  `;

  const PAGE = Number(params.get('page') || '1');
  const PAGE_SIZE = 12;
  const pageSlice = visible.slice(0, PAGE * PAGE_SIZE);

  const cards = pageSlice.map(cardTemplate).join('');
  const loadMore = visible.length > pageSlice.length ? `<div class="pagination"><button id="load-more" class="pill">Load more</button></div>` : '';

  root.innerHTML = `
    ${hero}
    <div class="layout">
      ${sidebar}
      <section>
        ${resultsBar}
        <div class="grid" id="products-grid">
          ${cards || emptyStateTemplate(q)}
        </div>
        ${loadMore}
      </section>
    </div>
  `;

  // Interactions
  $$('.pill[data-type-pill]').forEach(btn => btn.addEventListener('click', () => {
    const t = btn.getAttribute('data-type-pill');
    const next = new URLSearchParams(params.toString());
    next.set('category','wine');
    next.set('type', t);
    setHashRoute('/', next);
  }));

  $('#sort')?.addEventListener('change', (e) => upsertParams({ sort: e.target.value }));
  $('#load-more')?.addEventListener('click', () => upsertParams({ page: PAGE + 1 }));
  $('#apply-filters')?.addEventListener('click', () => {
    const types = $$('input[name="type"]:checked').map(i => i.value);
    const regions = $$('input[name="region"]:checked').map(i => i.value);
    const grapes = $$('input[name="grape"]:checked').map(i => i.value);
    const pmin = Number($('#price-min').value || 0);
    const pmax = Number($('#price-max').value || 1000);
    const amin = Number($('#abv-min').value || 0);
    const amax = Number($('#abv-max').value || 100);
    upsertParams({ type: types, region: regions, grape: grapes, price: `${pmin}-${pmax}`, abv: `${amin}-${amax}`, page: 1 });
    document.body.classList.remove('show-filters');
  });

  // Sliders (noUiSlider)
  const priceMin = $('#price-min');
  const priceMax = $('#price-max');
  const abvMin = $('#abv-min');
  const abvMax = $('#abv-max');

  const priceSlider = $('#price-slider');
  const abvSlider = $('#abv-slider');

  if (priceSlider && window.noUiSlider) {
    window.noUiSlider.create(priceSlider, {
      start: [Number(priceMin.value||0), Number(priceMax.value||1000)],
      connect: true,
      step: 1,
      range: { min: 0, max: 1000 },
      tooltips: [
        {
          to: (v) => `$${Math.round(v)}`,
          from: (v) => Number(String(v).replace(/[^\d.]/g, ''))
        },
        {
          to: (v) => `$${Math.round(v)}`,
          from: (v) => Number(String(v).replace(/[^\d.]/g, ''))
        }
      ]
    });
    priceSlider.noUiSlider.on('update', (values) => {
      const [vmin, vmax] = values.map(v => Math.round(Number(v)));
      priceMin.value = String(vmin);
      priceMax.value = String(vmax);
    });
    const syncPriceFromInputs = () => {
      let vmin = Math.min(Number(priceMin.value||0), Number(priceMax.value||0));
      let vmax = Math.max(Number(priceMin.value||0), Number(priceMax.value||0));
      priceSlider.noUiSlider.set([vmin, vmax]);
    };
    priceMin?.addEventListener('change', syncPriceFromInputs);
    priceMax?.addEventListener('change', syncPriceFromInputs);
  }

  if (abvSlider && window.noUiSlider) {
    window.noUiSlider.create(abvSlider, {
      start: [Number(abvMin.value||0), Number(abvMax.value||100)],
      connect: true,
      step: 0.5,
      range: { min: 0, max: 100 },
      tooltips: [
        {
          to: (v) => `${Number(v).toFixed(1)}%`,
          from: (v) => Number(String(v).replace(/[^\d.]/g, ''))
        },
        {
          to: (v) => `${Number(v).toFixed(1)}%`,
          from: (v) => Number(String(v).replace(/[^\d.]/g, ''))
        }
      ]
    });
    abvSlider.noUiSlider.on('update', (values) => {
      const [vmin, vmax] = values.map(v => Number(v));
      abvMin.value = String(vmin);
      abvMax.value = String(vmax);
    });
    const syncAbvFromInputs = () => {
      let vmin = Math.min(Number(abvMin.value||0), Number(abvMax.value||0));
      let vmax = Math.max(Number(abvMin.value||0), Number(abvMax.value||0));
      abvSlider.noUiSlider.set([vmin, vmax]);
    };
    abvMin?.addEventListener('change', syncAbvFromInputs);
    abvMax?.addEventListener('change', syncAbvFromInputs);
  }
}

function emptyStateTemplate(q) {
  return `<div style="grid-column: 1 / -1; background: #fff; border:1px solid var(--border); border-radius: 12px; padding: 24px; text-align:center;">
    <h2>No matches yet.</h2>
    <p>Try a different grape, region, or a lower price${q?` for “${escapeHtml(q)}”`:''}.</p>
  </div>`;
}

function cardTemplate(p) {
  const badge = (p.badges && p.badges[0]) ? `<span class="badge">${p.badges[0]}</span>` : '';
  return `
  <article class="card" aria-labelledby="tt-${p.id}">
    <div class="card-media">
      ${badge}
      <a href="#/product/${p.id}" aria-label="View ${escapeHtml(p.name)}">
        <img src="${p.image_url}" width="800" height="1066" alt="${escapeHtml(p.name)}" loading="lazy" />
      </a>
      <div class="quick-actions">
        <button data-quick="${p.id}" aria-label="Quick view ${escapeHtml(p.name)}">Quick View</button>
        <button class="secondary" data-add="${p.id}" aria-label="Add ${escapeHtml(p.name)} to cart">Add to Cart</button>
      </div>
    </div>
    <div class="card-body">
      <a class="card-title" id="tt-${p.id}" href="#/product/${p.id}">${escapeHtml(p.name)}</a>
      <div class="meta">${p.type}${p.grape?` · ${escapeHtml(p.grape)}`:''} · ${escapeHtml(p.region)}</div>
      <div class="meta" aria-label="Rating">⭐ ${p.rating?.toFixed(1) ?? '–'}</div>
      <div class="price">${formatPrice(p.price_cents)}</div>
    </div>
  </article>`;
}

function renderProductDetail(root, id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) { root.innerHTML = `<p>Not found.</p>`; return; }

  document.title = `${p.name} — Neighborhood Wine & Spirits`;
  injectProductSchema(p);

  const crumbs = `
    <nav aria-label="Breadcrumb" style="margin: 16px 0;">
      <ol style="display:flex; gap:8px; list-style:none; padding:0; margin:0; color: var(--muted);">
        <li><a href="#/">Home</a></li>
        <li aria-hidden="true">›</li>
        <li><a href="#/?category=${encodeURIComponent(p.category)}">${capitalize(p.category)}</a></li>
        ${p.region ? `<li aria-hidden="true">›</li><li><a href="#/?category=${encodeURIComponent(p.category)}&region=${encodeURIComponent(p.region)}">${escapeHtml(p.region)}</a></li>` : ''}
        <li aria-hidden="true">›</li>
        <li aria-current="page">${escapeHtml(p.name)}</li>
      </ol>
    </nav>`;

  root.innerHTML = `
    ${crumbs}
    <section class="detail">
      <div class="gallery">
        <div class="image">
          <img src="${p.image_url}" alt="${escapeHtml(p.name)}" width="1000" height="1333" />
        </div>
      </div>
      <div class="facts">
        <h1 style="font-family: 'Playfair Display', Georgia, serif; margin-top:0;">${escapeHtml(p.name)}</h1>
        <div class="meta">${p.vintage ? `${p.vintage} · ` : ''}${escapeHtml(p.region)}${p.country?`, ${escapeHtml(p.country)}`:''}</div>
        <div class="price" style="font-size: 22px; margin-top: 8px;">${formatPrice(p.price_cents)}</div>
        ${p.inventory < 10 ? `<div class="low-stock" style="margin-top:6px;">Low stock: ${p.inventory} left</div>` : ''}
        <div class="cta-row">
          <div class="qty">
            <label class="sr-only" for="qty">Quantity</label>
            <input id="qty" type="number" min="1" max="${Math.max(1, p.inventory)}" step="1" value="1" />
          </div>
          <button id="add-to-cart" class="btn-primary">Add to Cart</button>
        </div>
        <div class="kv" style="margin-top: 12px;">
          <div><strong>Type</strong><br/>${p.type}</div>
          ${p.grape?`<div><strong>Grape</strong><br/>${escapeHtml(p.grape)}</div>`:''}
          <div><strong>Region</strong><br/>${escapeHtml(p.region)}</div>
          <div><strong>Country</strong><br/>${escapeHtml(p.country)}</div>
          <div><strong>ABV</strong><br/>${p.abv}%</div>
          <div><strong>Volume</strong><br/>${p.volume_ml} ml</div>
        </div>
        <div style="margin-top: 12px;">
          <h2>Tasting Notes</h2>
          <p>${(p.flavor_notes||[]).map(x=>`<span class="pill" style="margin-right:6px;">${escapeHtml(x)}</span>`).join('')}</p>
          <h2>Food Pairings</h2>
          <p>${(p.pairings||[]).map(x=>`<span class="pill" style="margin-right:6px;">${escapeHtml(x)}</span>`).join('')}</p>
        </div>
      </div>
    </section>
    <section style="margin-top: 24px;">
      <h2 style="font-family:'Playfair Display', Georgia, serif;">Related Wines</h2>
      <div class="carousel" id="related" tabindex="0" aria-label="Related wines carousel">
        ${relatedProducts(p).map(cardTemplate).join('')}
      </div>
    </section>
  `;

  $('#add-to-cart')?.addEventListener('click', () => {
    const qty = Number($('#qty').value || 1);
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: { qty } }));
  });

  bindCardButtons();
}

function relatedProducts(p) {
  const candidates = PRODUCTS.filter(x => x.category==='wine' && x.id !== p.id);
  const byGrape = candidates.filter(x => x.grape && p.grape && x.grape === p.grape);
  const byRegion = candidates.filter(x => x.region === p.region);
  const byPrice = candidates.filter(x => Math.abs(x.price_cents - p.price_cents) <= 1000);
  const combined = [...new Set([...byGrape, ...byRegion, ...byPrice])];
  return combined.slice(0, 8);
}

function bindCardButtons() {
  // Quick view
  $$('button[data-quick]').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = btn.getAttribute('data-quick');
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    openModal(p);
  }));
  // Add to cart
  $$('button[data-add]').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: { qty: 1 } }));
  }));
}

function openModal(p) {
  const root = document.createElement('div');
  root.className = 'modal-backdrop';
  root.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
      <header>
        <h3 id="m-title" style="margin:0;">${escapeHtml(p.name)}</h3>
        <button class="close" aria-label="Close">×</button>
      </header>
      <div class="content">
        <div class="grid" style="grid-template-columns: 120px 1fr; align-items: start;">
          <img src="${p.image_url}" alt="${escapeHtml(p.name)}" width="120" height="160" />
          <div>
            <div>${p.type}${p.grape?` · ${escapeHtml(p.grape)}`:''} · ${escapeHtml(p.region)}</div>
            <div style="margin-top:6px;" class="price">${formatPrice(p.price_cents)}</div>
            <div class="cta-row" style="margin-top:10px;">
              <button class="btn-primary" data-add="${p.id}">Add to Cart</button>
              <a class="pill" href="#/product/${p.id}">View details</a>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  $('#modal-root').appendChild(root);
  const close = () => root.remove();
  root.addEventListener('click', (e) => { if (e.target === root) close(); });
  $('.close', root).addEventListener('click', close);
  bindCardButtons();
}

function injectProductSchema(p) {
  // Remove existing
  $$('script[type="application/ld+json"]').forEach(s => s.remove());
  const data = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: p.name,
    image: [p.image_url],
    brand: 'Neighborhood Wine & Spirits',
    sku: p.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: (p.price_cents/100).toFixed(2),
      availability: p.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    },
    aggregateRating: p.rating ? {
      '@type': 'AggregateRating',
      ratingValue: p.rating,
      reviewCount: Math.max(5, Math.round(p.rating * 10))
    } : undefined
  };
  const el = document.createElement('script');
  el.type = 'application/ld+json';
  el.textContent = JSON.stringify(data);
  document.head.appendChild(el);
}

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }

window.addEventListener('hashchange', () => { render(); setTimeout(bindCardButtons, 0); });
window.addEventListener('DOMContentLoaded', () => { initHeader(); render(); setTimeout(bindCardButtons, 0); });


