# content-inventory.md — La Tostada Norteña

Fecha de corte: 22 de octubre de 2026.
Responsable: Responsable de producto, UX/UI, accesibilidad y frontend.
Fuentes consultadas:
1. `Auditoria_La_Tostada_Nortena_.pdf` (15/10/2026, Karlos Montoya).
2. Grabación y evidencias de UI compartidas (15/10/2026).
3. Inspección directa de `https://latostadanortena.com/?i=1` y `revision-y-hallazgos.md` (22/10/2026).

---

## 1. Rutas, enlaces y navegación pública

| Ruta / Destino | Propósito / Sección | Fuente y fecha | Estado | Notas técnicas / UX |
|---|---|---|---|---|
| `/` | Portada y experiencia pública integrada | Sitio y auditoría, 22/10/2026 | Confirmado en fuente | Carga inicial completa con contenido indexable sin requerir JS |
| `#menu` | Catálogo completo organizado por categorías | Auditoría y revisión, 22/10/2026 | Confirmado en fuente | Enlace de salto y navegación directa desde cabecera y hero |
| `#como-pedir` | Guía en 3 pasos: elegir, revisar entrega y enviar a caja | Propuesta editorial según UI, 22/10/2026 | Propuesta editorial | Explica las reglas reales sin inventar tiempos |
| `#ubicacion-horarios` | Información local, mapa referencial, horarios y contacto | Sitio y auditoría, 22/10/2026 | Confirmado en fuente | Sin inventar dirección exacta no confirmada; formulario accesible |
| `#ayuda` | Preguntas frecuentes sobre pedidos, pagos y cobertura | Auditoría, 22/10/2026 | Propuesta editorial | Reemplaza widget flotante invasivo por sección clara y enfocable |
| `#pedido` | Resumen de compra, edición de piezas y checkout accesible | Auditoría, 22/10/2026 | Confirmado en fuente | Lateral en desktop (≥1100px), diálogo accesible en móvil |
| `/portal_empresas.php` | Acceso a portal de empresas preferentes | Sitio observado, 22/10/2026 | Confirmado en fuente | Conservado en enlace secundario en cabecera y pie |
| `/privacidad` o `#privacidad` | Política de privacidad y tratamiento de datos | Sitio observado, 22/10/2026 | Pendiente de validación legal | Borrador fuera de texto legal definitivo; editable |
| `#preferencias-cookies` | Ajuste de cookies y estadísticas | Sitio observado, 22/10/2026 | Confirmado en fuente | Aceptar/Rechazar tan fácil uno como el otro |

---

## 2. Catálogo completo de productos

Valores expresados en centavos MXN para evitar errores de redondeo flotante, y formateados con `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`.

| ID | Categoría | Nombre visible | Precio (MXN) | Precio (Centavos) | Ingredientes e información confirmada | Fuente / Estado |
|---|---|---|---|---:|---|---|
| `tostada-siberia-grande` | Tostadas | Tostada Siberia Grande (Gigante) | $90.00 | 9000 | Pollo deshebrado de primera, crema espesa y base cremosa de guacamole especial sobre tostada crujiente grande | Confirmado en fuente (22/10/2026) |
| `tostada-siberia-jr` | Tostadas | Tostada JR Siberia | $75.00 | 7500 | Receta tradicional con pollo deshebrado, guacamole y crema, en porción compacta JR | Confirmado en fuente (22/10/2026) |
| `taco-especial-siberia` | Tacos | Taco Especial Siberia | $65.00 | 6500 | Taco de tamaño grande con pollo deshebrado, crema espesa y base de guacamole sobre tortilla de maíz suave | Confirmado en fuente (22/10/2026) |
| `taco-jr-siberia` | Tacos | Taco JR Siberia | $55.00 | 5500 | Porción ligera con pollo deshebrado, guacamole y crema. (En UI original decía erróneamente 'gigante'; corregido en texto) | Confirmado con corrección editorial |
| `combo-tostada-especial` | Combos | Combo Tostada Especial | $105.00 | 10500 | 1 Tostada Siberia Grande + 1 consomé caliente con verduras + 1 bebida (refresco o agua del día) | Confirmado en fuente (22/10/2026) |
| `combo-tostada-jr` | Combos | Combo Tostada JR | $90.00 | 9000 | 1 Tostada JR Siberia + 1 consomé chico con verduras + 1 bebida (refresco o agua del día) | Confirmado en fuente (22/10/2026) |
| `combo-taco-especial` | Combos | Combo Taco Especial | $85.00 | 8500 | 1 Taco Especial Siberia + 1 consomé caliente con verduras + 1 bebida (refresco o agua del día) | Confirmado en fuente (22/10/2026) |
| `combo-taco-jr` | Combos | Combo Taco JR | $75.00 | 7500 | 1 Taco JR Siberia + 1 consomé chico con verduras + 1 bebida (refresco o agua del día) | Confirmado en fuente (22/10/2026) |
| `consome` | Caldos y complementos | Consomé | $35.00 | 3500 | Caldo caliente sazonado de pollo con verduras | Confirmado en fuente (22/10/2026) |
| `caldo-pollo` | Caldos y complementos | Caldo de Pollo | $45.00 | 4500 | Caldo caliente con porción de pollo deshebrado y verduras | Confirmado en fuente (22/10/2026) |
| `coca-cola-500` | Bebidas | Coca Cola 500 ml | $27.00 | 2700 | Botella pet de 500 ml fría | Confirmado en fuente (22/10/2026) |

---

## 3. Promociones y condiciones comerciales

| Promoción | Regla observada | Descuento | Condiciones y casos límite | Estado |
|---|---|---|---|---|
| **3 Tostadas x $255** | Por cada 3 piezas de Tostada Siberia Grande ($90 c/u = $270), se descuentan $15. | $15.00 MXN por tercia | Aplica a múltiplos de 3 (ej. 3 piezas = $255; 6 piezas = $510). Requiere validación por servidor. | Confirmado en UI; conciliado en adapter |
| **Entrega programada** | En compras iguales o mayores a $1,000.00 MXN se puede solicitar horario de entrega anticipado. | N/A (Beneficio operativo) | La solicitud queda sujeta a confirmación y disponibilidad de caja; no se promete entrega inmediata garantizada. | Confirmado en UI; reflejado en formulario |

---

## 4. Servicio, cobertura y cotización de envío

| Parámetro | Regla observada | Implementación frontend |
|---|---|---|
| **Estado del servicio** | Abierto / Cerrado según backend | Estado en vivo (`ABIERTO`, `CERRADO`, `DESCONOCIDO`). Si está cerrado, permite explorar el menú pero bloquea el envío de pedido. |
| **Costo base de envío** | $15.00 MXN hasta 1.0 km | Se marca como **«Envío pendiente de cotizar»** mientras no haya ubicación validada. Nunca mostrar $0.00 como envío gratis. |
| **Kilómetro adicional** | +$8.00 MXN por cada km adicional | Calculado sobre distancia real validada por servidor/adaptador. |
| **Radio de cobertura base** | Hasta 4.0 km desde la sucursal | Si excede 4 km y subtotal < $1,000 MXN, muestra advertencia de fuera de cobertura estándar. |
| **Extensión de cobertura** | Hasta 9.0 km para pedidos ≥ $1,000 MXN | Sujeto a confirmación de ruta por caja. |
| **Ubicación accesible** | Dirección escrita + geolocalización opcional + ajuste | No forzar GPS ni arrastre exclusivo de mapa. Permitir ingreso por teclado de dirección y referencias. |

---

## 5. Métodos de pago y campos de entrega

| Método | Datos solicitados | Validaciones y comportamiento |
|---|---|---|
| **Efectivo al repartidor** | ¿Con cuánto pagarás? (Monto para cambio) | Opcional pero recomendado para cambio exacto. Validar que si se especifica sea mayor o igual al total. |
| **TPV al repartidor** | Tarjeta física (Débito/Crédito) al entregar | **No crear formulario de tarjeta web**. Solo indicar al cliente que tenga su tarjeta lista. |
| **Transferencia electrónica** | Comprobante tras confirmación de caja | Indicar que los datos CLABE se proporcionarán una vez que caja confirme el pedido. |

Campos del pedido:
1. **Nombre de quien recibe** (obligatorio, label asociado explícito).
2. **Destinatario alternativo** (opcional, desplegable).
3. **Teléfono de contacto** (obligatorio, tipo `tel`, 10 dígitos).
4. **Dirección / Calle y número** (obligatorio).
5. **Colonia / Referencias de entrega** (obligatorio para facilitar ubicación).
6. **Ubicación en mapa / GPS** (opcional con feedback y alternativa accesible de texto).
7. **Notas especiales de preparación** (opcional).

---

## 6. Textos legales y ayuda

- **Horarios:** Lunes a Domingo de 11:00 a 20:00 hrs (sujeto a disponibilidad de cocina en San Luis Potosí).
- **Contacto:** Teléfono y WhatsApp oficiales de atención en SLP (configurables en adapter; registrados como pendientes de confirmación final de número comercial).
- **Aviso de privacidad:** Tratamiento limitado a la gestión de pedidos a domicilio y estadísticas de navegación agregadas si el usuario lo consiente. Borrador editable preparado en `/privacidad`.
