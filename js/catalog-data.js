/**
 * catalog-data.js — Catálogo maestro y datos de productos de La Tostada Norteña
 * Todos los precios se expresan en CENTAVOS enteros de MXN (ej. $90.00 = 9000).
 */

export const CATEGORIES = [
  { id: 'tostadas', name: 'Tostadas', desc: 'Receta tradicional con pollo deshebrado, crema y guacamole' },
  { id: 'tacos', name: 'Tacos Siberia', desc: 'En tortilla suave de maíz, receta norteña' },
  { id: 'combos', name: 'Combos completos', desc: 'Incluyen consomé con verduras y bebida' },
  { id: 'caldos', name: 'Caldos y complementos', desc: 'Reconfortantes caldos recién servidos' },
  { id: 'bebidas', name: 'Bebidas', desc: 'Refrescos embotellados fríos' }
];

export const PRODUCTS = [
  // --- TOSTADAS ---
  {
    id: 'tostada-siberia-grande',
    category: 'tostadas',
    name: 'Tostada Siberia Grande (Gigante)',
    priceCents: 9000, // $90.00 MXN
    ingredients: 'Pollo deshebrado de primera, crema espesa y base cremosa de guacamole especial sobre tostada crujiente grande.',
    portionNote: 'Porción grande tradicional',
    isAvailable: true,
    isFeatured: true,
    image: {
      src: 'https://images.pexels.com/photos/12034617/pexels-photo-12034617.jpeg?auto=compress&cs=tinysrgb&w=1200',
      srcset: 'https://images.pexels.com/photos/12034617/pexels-photo-12034617.jpeg?auto=compress&cs=tinysrgb&w=600 600w, https://images.pexels.com/photos/12034617/pexels-photo-12034617.jpeg?auto=compress&cs=tinysrgb&w=1200 1200w',
      alt: 'Tostada mexicana con pollo deshebrado, guacamole y crema',
      isIllustrative: true
    }
  },
  {
    id: 'tostada-siberia-jr',
    category: 'tostadas',
    name: 'Tostada JR Siberia',
    priceCents: 7500, // $75.00 MXN
    ingredients: 'Receta tradicional con pollo deshebrado, guacamole y crema espesa en un tamaño compacto JR.',
    portionNote: 'Porción individual JR',
    isAvailable: true,
    isFeatured: false
  },

  // --- TACOS ---
  {
    id: 'taco-especial-siberia',
    category: 'tacos',
    name: 'Taco Especial Siberia',
    priceCents: 6500, // $65.00 MXN
    ingredients: 'Taco de tamaño grande con abundante pollo deshebrado de primera, crema espesa y guacamole sobre tortilla de maíz suave.',
    portionNote: 'Tortilla suave de maíz',
    isAvailable: true,
    image: {
      src: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Tacos suaves mexicanos estilo tradicional con guarnición',
      isIllustrative: true
    }
  },
  {
    id: 'taco-jr-siberia',
    category: 'tacos',
    name: 'Taco JR Siberia',
    priceCents: 5500, // $55.00 MXN
    ingredients: 'Porción ligera con pollo deshebrado, guacamole cremoso y crema sobre tortilla de maíz suave.',
    portionNote: 'Porción individual JR',
    isAvailable: true
  },

  // --- COMBOS ---
  {
    id: 'combo-tostada-especial',
    category: 'combos',
    name: 'Combo Tostada Especial',
    priceCents: 10500, // $105.00 MXN
    ingredients: '1 Tostada Siberia Grande + 1 consomé caliente con verduras + 1 refresco o agua del día.',
    includesList: ['1 Tostada Grande', 'Consomé con verduras', 'Refresco o agua'],
    isAvailable: true
  },
  {
    id: 'combo-tostada-jr',
    category: 'combos',
    name: 'Combo Tostada JR',
    priceCents: 9000, // $90.00 MXN
    ingredients: '1 Tostada JR Siberia + 1 consomé chico con verduras + 1 refresco o agua del día.',
    includesList: ['1 Tostada JR', 'Consomé chico', 'Refresco o agua'],
    isAvailable: true
  },
  {
    id: 'combo-taco-especial',
    category: 'combos',
    name: 'Combo Taco Especial',
    priceCents: 8500, // $85.00 MXN
    ingredients: '1 Taco Especial Siberia + 1 consomé caliente con verduras + 1 refresco o agua del día.',
    includesList: ['1 Taco Especial', 'Consomé con verduras', 'Refresco o agua'],
    isAvailable: true
  },
  {
    id: 'combo-taco-jr',
    category: 'combos',
    name: 'Combo Taco JR',
    priceCents: 7500, // $75.00 MXN
    ingredients: '1 Taco JR Siberia + 1 consomé chico con verduras + 1 refresco o agua del día.',
    includesList: ['1 Taco JR', 'Consomé chico', 'Refresco o agua'],
    isAvailable: true
  },

  // --- CALDOS Y COMPLEMENTOS ---
  {
    id: 'consome',
    category: 'caldos',
    name: 'Consomé',
    priceCents: 3500, // $35.00 MXN
    ingredients: 'Caldo caliente sazonado con verduras frescas.',
    portionNote: 'Tazón caliente',
    isAvailable: true,
    image: {
      src: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
      alt: 'Tazón caliente de consomé y caldo servido con verduras',
      isIllustrative: true
    }
  },
  {
    id: 'caldo-pollo',
    category: 'caldos',
    name: 'Caldo de Pollo',
    priceCents: 4500, // $45.00 MXN
    ingredients: 'Caldo caliente con porción de pollo deshebrado y verduras.',
    portionNote: 'Tazón con pollo',
    isAvailable: true
  },

  // --- BEBIDAS ---
  {
    id: 'coca-cola-500',
    category: 'bebidas',
    name: 'Coca Cola 500 ml',
    priceCents: 2700, // $27.00 MXN
    ingredients: 'Refresco clásico en botella de 500 ml fría.',
    portionNote: 'Botella pet 500 ml',
    isAvailable: true,
    image: {
      src: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
      alt: 'Botella de refresco de cola frío',
      isIllustrative: true
    }
  }
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
