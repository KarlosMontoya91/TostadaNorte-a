# integration-notes.md — La Tostada Norteña

Documentación de arquitectura técnica, contratos de datos, puntos de conexión backend y estado de integración para el rediseño v1.0.

Fecha: 22 de octubre de 2026.

---

## 1. Diagnóstico del entorno actual

- **Sitio en producción inspeccionado:** `https://latostadanortena.com/?i=1`.
- **Infraestructura de hosting actual:** El dominio se encuentra alojado bajo un esquema compartido (posiblemente ByetHost / InfinityFree con protección anti-bot por cookies de sesión `__test` y redirección forzada a `?i=2`), lo que impide el consumo mediante clientes HTTP automatizados no basados en navegador (como cURL sin cookies).
- **Stack actual existente:** PHP tradicional con scripts orientados a caja (`/portal_empresas.php`, login de administración/cajero).
- **Disponibilidad de API REST / GraphQL:** Actualmente no existe un endpoint de API documentado de forma pública o expuesta para clientes móviles/frontend modernos.
- **Autorización del cliente:** El cliente autorizó el rediseño visual y de experiencia pública frontend, manteniendo intacto el backend existente.

---

## 2. Estrategia de arquitectura frontend

Para cumplir con:
1. **HTML 100% indexable y accesible de inmediato** (sin requerir descarga pesada de JavaScript para que Google o personas con lectores de pantalla lean el menú completo).
2. **Cero dependencias innecesarias y rendimiento ultra-rápido** (LCP < 1.5s, JS inicial < 40KB gzip, sin frameworks pesados).
3. **Aislamiento estricto de la lógica de negocio**: Se utiliza un patrón **Adapter** (`BusinessAdapter` / `CatalogService`), separando la interfaz de usuario de las reglas transaccionales de precios, promociones, cotización de envío y envío de pedidos.

### Manejo de dinero en centavos
Siguiendo las mejores prácticas financieras y la especificación del encargo:
- Todos los precios se almacenan y operan en **centavos enteros MXN** (ej. Tostada Siberia = `9000` centavos).
- Las funciones de formateo emplean exclusivamente:
  ```javascript
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100)
  ```
- Nunca se mezcla lógica de cálculo de precios en el marcado o en eventos visuales directos.

---

## 3. Contratos de datos (Esquemas TypeScript / JSDoc)

### `Product`
```typescript
interface Product {
  id: string; // ej. 'tostada-siberia-grande'
  name: string; // 'Tostada Siberia Grande (Gigante)'
  category: 'tostadas' | 'tacos' | 'combos' | 'caldos' | 'bebidas';
  priceCents: number; // 9000
  ingredients: string;
  portionNote?: string;
  isAvailable: boolean;
  image?: {
    src: string;
    srcset?: string;
    alt: string;
    isIllustrative: boolean;
  };
}
```

### `CartItem`
```typescript
interface CartItem {
  productId: string;
  quantity: number; // entero positivo >= 1
  unitPriceCents: number; // obtenido de la autoridad del catálogo, no manipulable por cliente
}
```

### `ServiceStatus`
```typescript
type ServiceStatus = 'ABIERTO' | 'CERRADO' | 'DESCONOCIDO';

interface ServiceInfo {
  status: ServiceStatus;
  message: string;
  scheduleDescription: string;
  lastChecked: string;
}
```

### `DeliveryQuote`
```typescript
type DeliveryQuoteStatus = 'PENDIENTE' | 'CALCULANDO' | 'COTIZADO' | 'FUERA_COBERTURA' | 'REQUIERE_REVISION' | 'ERROR';

interface DeliveryQuote {
  status: DeliveryQuoteStatus;
  distanceKm?: number;
  deliveryFeeCents?: number;
  message: string;
  isExtendedCoverage?: boolean;
}
```

### `OrderSubmission` & `OrderResult`
```typescript
interface OrderSubmission {
  items: Array<{ productId: string; quantity: number }>;
  customerName: string;
  alternativeReceiver?: string;
  phone: string;
  address: string;
  neighborhoodReference: string;
  locationCoordinates?: { lat: number; lng: number };
  paymentMethod: 'efectivo' | 'tpv' | 'transferencia';
  cashAmountProvidedCents?: number;
  notes?: string;
  requestedSchedule?: string;
}

interface OrderResult {
  success: boolean;
  orderId?: string;
  status: 'PENDIENTE_CAJA' | 'RECHAZADO' | 'ERROR_RED';
  message: string;
  subtotalCents: number;
  discountCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}
```

---

## 4. Adaptador de demostración aislado (`DemoBusinessAdapter`)

En ausencia de credenciales de base de datos directa o API de producción del servidor PHP:
1. Se ha implementado un `DemoBusinessAdapter` que aplica rigurosamente las reglas reales documentadas:
   - Aplica la promoción confirmada: **3 Tostadas x $255** ($15 MXN de descuento por cada tercia de Tostadas Grandes).
   - Valida el horario de atención (horario local de San Luis Potosí).
   - Calcula la cotización de entrega con la regla confirmada: **$15 MXN hasta 1.0 km y +$8 MXN por km adicional**, con límite de 4 km y extensión hasta 9 km para pedidos ≥ $1,000 MXN.
2. **Modo de demostración visible y transparente:**
   - En la cabecera y en el panel de confirmación se muestra un distintivo claro: `«Modo Demostración / Vista Previa Activa»`.
   - Al pulsar el botón de revisión y envío a caja, el sistema **NO** emite una confirmación falsa de que el pedido fue cobrado o enviado a la cocina real. En su lugar, presenta un diálogo de validación con el desglose exacto que recibiría la caja, informando que la conexión final al servidor de caja está pendiente de sincronización.
   - **No se sustituye silenciosamente por WhatsApp** ni se finge un pago procesado.

---

## 5. Qué bloquea la publicación en producción (Checklist de integración)

Para conectar este rediseño al entorno de producción final en `latostadanortena.com`, se requiere del equipo de sistemas:
1. **Endpoint de cotización y recepción de pedidos:**
   - Crear un script seguro (ej. `api/crear_pedido.php` o webhook interno) que reciba el JSON de `OrderSubmission`, valide en base de datos precios vigentes e inserte en la tabla de órdenes de la caja.
2. **Endpoint de estado de servicio (`api/estado_servicio.php`):**
   - Retornar si la caja física está abierta o cerrada en tiempo real.
3. **Credenciales de geocodificación y mapas:**
   - Si se desea autocompletado de direcciones en mapa de Google Maps u OpenStreetMap / Leaflet, incorporar la clave de API autorizada para el dominio.
4. **Validación de la variante oficial en vector del logotipo:**
   - Sustituir los archivos PNG de alta resolución por el `.svg` oficial cuando el área de diseño lo suministre.
