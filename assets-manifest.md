# assets-manifest.md — La Tostada Norteña

Registro de activos visuales, fotografías remotas y logotipo de marca para el rediseño v1.0.
Fecha de verificación: 22 de octubre de 2026.
Política:
- **No se generan imágenes con IA.**
- Solo se emplean activos provistos por el cliente o fotografía de stock con licencia libre documentada y probada vía HTTP 200.
- Todas las fotografías de stock son estrictamente **ilustrativas y provisionales**, no representan la porción física servida en el local ni instalaciones reales.

---

## 1. Identidad de marca y logotipos

| Activo | Ubicación en proyecto | Origen / Fuente | Licencia | Estado | Descripción y accesibilidad |
|---|---|---|---|---|---|
| **Logotipo variante verde (para fondo crema)** | `assets/logo-tostada-nortena-verde.png` | Archivo oficial provisto en el proyecto (`media_1792719891913.png`) | Propiedad del cliente | Confirmado en fuente | Cactus sonriente con sombrero norteño sosteniendo una tostada, junto al texto tipográfico "LA TOSTADA NORTEÑA" en verde profundo (`#245333`). Fondo transparente. Alt: `La Tostada Norteña - Estilo Siberia en San Luis Potosí`. |
| **Logotipo variante crema (para fondo oscuro/verde)** | `assets/logo-tostada-nortena-crema.png` | Archivo oficial provisto en el proyecto (`media_1792719887871.png`) | Propiedad del cliente | Confirmado en fuente | Idéntica composición con rotulado en tono crema claro (`#FFF9ED`), optimizado para el pie de página o fondos de contraste invertido. Fondo transparente. |
| **Vector oficial SVG** | Pendiente | Solicitado al equipo de diseño del cliente | Propiedad del cliente | Pendiente de entrega | Se utiliza PNG de alta resolución transparente mientras se entrega el vector maestro `.svg`. |

---

## 2. Fotografía remota (curada y verificada)

| Sección / Producto | URL directa verificada | Página de origen y autor | Licencia comprobada | Fecha prueba | Alt accesible | Dimensiones y recorte | Carácter |
|---|---|---|---|---|---|---|---|
| **Apertura editorial & Tostada Siberia** | `https://images.pexels.com/photos/12034617/pexels-photo-12034617.jpeg?auto=compress&cs=tinysrgb&w=1200` | [Pexels / Israel Albornoz](https://www.pexels.com/photo/close-up-photo-of-tostada-12034617/) | [Licencia Pexels](https://www.pexels.com/license/) (Libre para uso comercial y personal) | 22/10/2026 (HTTP 200 OK) | `Tostada tradicional mexicana con guacamole cremoso, pollo deshebrado y crema` | 1200×960 px (proporción 5:4 aproximada), `object-fit: cover` | Ilustrativa de referencia |
| **Tacos Siberia** | `https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=800` | [Pexels / Tai's Captures](https://www.pexels.com/photo/2092507/) | [Licencia Pexels](https://www.pexels.com/license/) (Libre) | 22/10/2026 (HTTP 200 OK) | `Tacos suaves de tortilla de maíz servidos al estilo tradicional con guarnición` | 800×600 px (4:3), `object-fit: cover` | Ilustrativa de referencia |
| **Caldos y Consomé** | `https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80` | [Unsplash / Mae Mu](https://unsplash.com/photos/soup-in-ceramic-bowl-1547592166) | [Licencia Unsplash](https://unsplash.com/license) (Gratuita para uso comercial) | 22/10/2026 (HTTP 200 OK) | `Tazón de caldo caliente sazonado de pollo servido con vegetales frescos` | 800×600 px (4:3), `object-fit: cover` | Ilustrativa de referencia |
| **Bebidas (Refresco)** | `https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80` | [Unsplash / Bruno Kelzer](https://unsplash.com/photos/coca-cola-glass-bottle-1622483767028) | [Licencia Unsplash](https://unsplash.com/license) (Gratuita para uso comercial) | 22/10/2026 (HTTP 200 OK) | `Botella fría de refresco de cola para acompañar el menú` | 800×600 px (4:3), `object-fit: cover` | Ilustrativa de referencia |

### Notas de carga y tolerancia a fallos
- **Optimización móvil:** Se implementan atributos `srcset` y `sizes` en la imagen de apertura para no sobrecargar el ancho de banda en dispositivos celulares.
- **LCP:** La imagen del hero se sirve con `loading="eager"` y `fetchpriority="high"`, garantizando un Largest Contentful Paint óptimo.
- **Imágenes secundarias:** Se sirven con `loading="lazy"` y `decoding="async"`.
- **Fallback sin salto de layout:** Si el host remoto llegase a fallar o el usuario desactiva imágenes, los contenedores mantienen sus dimensiones de reserva (`aspect-ratio: 5/4` y `4/3`), mostrando una superficie neutra estilizada con tipografía legible sin provocar Cumulative Layout Shift (CLS).
