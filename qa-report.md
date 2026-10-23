# qa-report.md — Informe de Control de Calidad y Pruebas Técnicas

Fecha de evaluación: 22 de octubre de 2026.
Entorno de pruebas:
- **Sistema Operativo:** Windows 11 Home (x64).
- **Servidor local:** `powershell.exe -ExecutionPolicy Bypass -File .\server.ps1 -Port 3000` (HTTP/1.1 200 OK verificado).
- **Herramientas de inspección:** cURL HTTP tests, Google Chrome Headless DOM Dump (versión 140+), análisis de contraste WCAG y validación estática de código.
- **Viewports auditados:**
  - 1440 × 900 px (Escritorio grande)
  - 1024 × 768 px (Escritorio / Laptop estándar)
  - 768 × 1024 px (Tablet vertical)
  - 390 × 844 px (Móvil estándar moderno - iPhone 14/15 / Android)
  - 320 × 640 px (Móvil estrecho - Reflujo WCAG 2.2 criterio 1.4.10)

---

## 1. Matriz de Criterios de Aceptación

| Criterio / Prueba | Pasos de prueba ejecutados | Resultado observado | Estado |
|---|---|---|---|
| **Catálogo y precios** | Inspección de `index.html` y `catalog-data.js` contra `content-inventory.md`. | 11 productos exactos. Precios expresados en centavos enteros MXN. Ninguna hamburguesa, ensalada ni platillo inventado. | **APROBADO** |
| **Navegación móvil** | Inspección en 390×844 y 320×640 px. | Barra fija "Ver pedido" (`.mobile-cart-bar`) anclada con `padding-bottom: calc(12px + env(safe-area-inset-bottom))`. No cubre contenido ni oculta botones. Sin scroll horizontal. | **APROBADO** |
| **Agregar y editar cantidad** | Click en botón "Agregar al pedido" en Tostada Siberia Grande. | Dispara toast local `.added-feedback-toast` ("✓ Agregado") sin robar foco ni desplazar scroll. Incrementa contador de cabecera a 1. Stepper `+` y `−` y botón "Eliminar" completamente funcionales. | **APROBADO** |
| **Persistencia segura (Privacidad)** | Verificar claves guardadas en `localStorage`. | Únicamente se almacena `ltn_cart_v1` con un array de `{ productId, quantity }`. Nombre, teléfono, dirección y coordenadas **NUNCA** se persisten en storage. | **APROBADO** |
| **Reconciliación de carrito** | Carga inicial del store simulando producto inexistente o alterado. | La función `loadFromStorage()` filtra contra el catálogo maestro y descarta ítems no disponibles sin romper la aplicación. | **APROBADO** |
| **Envío pendiente vs Gratuito** | Añadir producto con carrito recién iniciado sin seleccionar distancia. | Muestra explícitamente: Subtotal: `$90.00`, Envío: `Por calcular`, Total: `$90.00 + envío`. En ningún momento se afirma erróneamente `$0.00` como costo de envío. | **APROBADO** |
| **Regla de Cotización de Envío** | Selección de distancia: 1 km ($15), 2 km ($23), 3 km ($31), 4 km ($39), y 6 km (extensión). | Cálculo matemático exacto: $15 base (primer km) + $8 por km adicional. Extensión a 6 km advierte que requiere pedido ≥ $1,000 MXN si el subtotal es menor. | **APROBADO** |
| **Regla de Promoción (3 x $255)** | Añadir 3 Tostadas Siberia Grandes ($90 c/u = $270). | Se detecta la tercia y se calcula un descuento validado de -$15.00 MXN. Subtotal: $270.00, Descuento: -$15.00, Total comida: $255.00. | **APROBADO** |
| **Estado de servicio (Abierto/Cerrado)** | Pulsar botón "Probar estado servicio" en la barra de aviso. | Cambia indicador a "Servicio cerrado" con punto rojo (`.status-dot.is-closed`). En el pedido, el botón de envío se inhabilita con el texto "Servicio cerrado actualmente". Permite seguir explorando la carta. | **APROBADO** |
| **Entrega accesible (Sin GPS obligatorio)** | Llenado de pedido sin conceder permiso de ubicación. | El usuario selecciona su botón de distancia por teclado o clic (o escribe su domicilio). No se fuerza arrastrar un pin de mapa ni se bloquea por falta de GPS. | **APROBADO** |
| **Formulario y validaciones accesibles** | Envío de formulario con campos vacíos o teléfono incorrecto. | Inputs reciben `aria-invalid="true"`, foco programático en el primer campo inválido y mensaje descriptivo vinculado (`.form-error-msg`). No se borran los datos escritos. | **APROBADO** |
| **Prevención de doble activación** | Doble click rápido en "Revisar y enviar pedido a caja". | La bandera `isSubmitting` bloquea la segunda ejecución, deshabilita el botón y cambia el texto a "Enviando a caja...". | **APROBADO** |
| **Modal nativo `<dialog>`** | Apertura de carrito móvil y confirmación de orden. | Emplea el elemento HTML5 nativo `<dialog>` con `showModal()`, fondo atenuado (`::backdrop`), trampa de foco, cierre con tecla `Escape` y retorno de foco al botón disparador. | **APROBADO** |
| **Lector de pantalla (A11y)** | Región `#live-cart-announcer` con `role="status"` y `aria-live="polite"`. | Anuncia frases naturales en español: *"Tostada Siberia Grande agregada. Tienes 1 producto en el pedido."* y *"Cantidad actualizada a 2 piezas."*. | **APROBADO** |
| **Modo Demostración Transparente** | Envío satisfactorio de pedido simulado. | Despliega modal con ticket estructurado (folio `DEMO-XXXXXX`, cliente, dirección, desglose financiero), aclarando expresamente que es una vista previa de integración. | **APROBADO** |
| **Preferencia de movimiento** | Consulta de `@media (prefers-reduced-motion: reduce)`. | Anula animaciones y transiciones de panel a 0.01ms y desactiva `scroll-behavior: smooth`. | **APROBADO** |
| **SEO Técnico y Metadatos** | Inspección de etiquetas `<head>` y marcado JSON-LD. | `lang="es-MX"`, canonical absoluto `https://latostadanortena.com/`, meta description descriptiva, H1 descriptivo único y esquema `Restaurant` con datos reales. | **APROBADO** |

---

## 2. Auditoría de Contraste Cromático (WCAG 2.2 AA)

Todos los pares de color implementados en la interfaz fueron validados matemáticamente sobre el fondo `--canvas` (`#FFF9ED`):

| Elemento / Rol | Color Texto | Color Fondo | Ratio de Contraste | Requisito WCAG AA | Diagnóstico |
|---|---|---|---:|---|---|
| Títulos y botones primarios | `--brand` (`#245333`) | `--canvas` (`#FFF9ED`) | **8.48 : 1** | ≥ 4.5:1 (Normal), ≥ 3:1 (Grande) | **Supera ampliamente (Nivel AAA)** |
| Texto de botones primarios | `#FFF9ED` (Crema) | `--brand` (`#245333`) | **8.48 : 1** | ≥ 4.5:1 | **Supera ampliamente (Nivel AAA)** |
| Texto de párrafos principal | `--ink` (`#242B24`) | `--canvas` (`#FFF9ED`) | **13.85 : 1** | ≥ 4.5:1 | **Supera ampliamente (Nivel AAA)** |
| Texto secundario y etiquetas | `--muted` (`#596253`) | `--canvas` (`#FFF9ED`) | **6.07 : 1** | ≥ 4.5:1 | **Aprobado Nivel AA** |
| Errores y alertas puntuales | `--chile` (`#A5422B`) | `--canvas` (`#FFF9ED`) | **5.87 : 1** | ≥ 4.5:1 | **Aprobado Nivel AA** |
| Texto de advertencia de servicio | `--warm` (`#7C5235`) | `--canvas` (`#FFF9ED`) | **6.43 : 1** | ≥ 4.5:1 | **Aprobado Nivel AA** |
| Bordes de campos interactivos | `--control-border` (`#7D8677`)| `--canvas` (`#FFF9ED`) | **3.61 : 1** | ≥ 3.0:1 (Componentes no-texto) | **Aprobado Nivel AA** |
| Etiquetas maíz con texto | `--brand` (`#245333`) | `--corn` (`#F2BD38`) | **5.13 : 1** | ≥ 4.5:1 | **Aprobado Nivel AA** |

---

## 3. Límites conocidos y siguientes pasos de producción

1. **Conexión a Caja:** La recepción de órdenes se encuentra aislada en `businessAdapter.js` y entrega el payload estructurado `OrderSubmission`. Falta conectar el endpoint HTTP definitivo del backend de caja del restaurante.
2. **Vector SVG Maestro del Logo:** Se implementaron los archivos PNG de alta definición con fondo transparente (`logo-tostada-nortena-verde.png` y `logo-tostada-nortena-crema.png`). El vector maestro `.svg` queda pendiente de entrega por el equipo de diseño gráfico.
3. **Geocodificación Automática:** La selección actual permite 5 niveles de distancia accesibles y geolocalización nativa mediante `navigator.geolocation`. La integración con Google Maps Places Autocomplete queda sujeta a credenciales de API autorizadas para el dominio.
