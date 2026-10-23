# design.md — La Tostada Norteña

Versión 1.0 · 22 de octubre de 2026. Especificación visual y de interacción para el rediseño público. Los valores de color son una propuesta inspirada en el logo aportado, no una extracción colorimétrica oficial.

## 1. Concepto y propósito

**Carta norteña contemporánea.** Una carta de comida cotidiana bien editada: cálida, directa, con títulos expresivos, espacio suficiente y comida reconocible. Formalidad accesible, sin lenguaje visual de restaurante de lujo. La originalidad está en la composición, la tipografía y el ritmo, no en dificultar comprar.

La persona debe poder responder: qué venden, cuánto cuesta, si hay servicio y cómo revisar su pedido. El menú y el pedido son el centro de la experiencia. El rediseño debe sentirse propio de una tostada de pollo, guacamole y crema estilo Siberia en San Luis Potosí.

Tres firmas visuales: títulos de serif robusta que dialoguen con el logo; índices discretos de categorías como en una carta impresa; fotografía cálida a un lado de contenido editorial breve, sin texto superpuesto sobre la comida.

## 2. Referencias, interpretadas

- [Tarannà](https://www.tarannatakeaway.com/): cercanía, verde y comida protagonista. Adaptar su claridad de pedido; reducir la altura inicial.
- [Red Bamboo](https://www.redbamboo-nyc.com/): navegación breve y vínculo directo con el menú. No reproducir su gran portada fotográfica ni el feed social.
- [Mizlala](https://mizlala.com/): ritmo editorial y presentación concisa de comida e información local. No copiar el logo fragmentado, el popup o el widget de accesibilidad.
- [Lucky Folks](https://www.luckyfolks.fr/): personalidad tipográfica y energía de marca en dosis pequeñas. No trasladar video de portada, cursores especiales, texto circular animado ni efectos de scroll.
- [Taquería La Tostada](https://www.taquerialatostada.com/): referencia de categoría para diferenciarse. Evitar portada verde saturada con mascota, rayos decorativos y collage de productos. No copiar su información ni tratarla como una sucursal de este negocio.

## 3. Paleta y roles

| Token | Valor | Aplicación |
|---|---|---|
| `--canvas` | `#FFF9ED` | Fondo crema principal |
| `--surface` | `#F5EDDC` | Áreas de apoyo y resumen |
| `--brand` | `#245333` | Verde principal, títulos, botones |
| `--brand-hover` | `#183D26` | Hover y pressed principal |
| `--ink` | `#242B24` | Texto principal |
| `--muted` | `#596253` | Texto secundario legible |
| `--corn` | `#F2BD38` | Pequeños acentos maíz y etiquetas con texto verde |
| `--chile` | `#A5422B` | Error y énfasis muy puntual, acompañado de texto |
| `--warm` | `#7C5235` | Texto de estado de advertencia |
| `--line` | `#DED6C5` | Separadores decorativos |
| `--control-border` | `#7D8677` | Borde identificable de campos sobre crema |

Base orientativa: 75% crema, 20% verde/tinta, hasta 5% acentos; no forzar porcentajes si perjudica lectura. Botón primario: crema sobre verde; secundario: verde sobre crema con borde verde. Maíz nunca es texto pequeño sobre crema. Evitar amarillo como color general de precios.

Contrastes calculados en colores sólidos: verde/crema 8.48:1; tinta/crema 13.85:1; texto secundario/crema 6.07:1; chile/crema 5.87:1; verde/maíz 5.13:1; warm/crema 6.43:1; borde de control/crema 3.61:1. Estas parejas no certifican toda la interfaz: comprobar hover, foco, disabled, nuevos fondos y transparencias.

## 4. Tipografía y lectura

- Títulos: **Bree Serif**, peso 400; alternativa Georgia, serif. Usar por su cuerpo amable y remates firmes. No intentar recrear el lettering del logo con una fuente cualquiera.
- Interfaz y párrafos: **Source Sans 3**, pesos 400 y 600; alternativa system-ui, sans-serif.
- Máximo dos familias, subconjuntos latinos con Ñ y acentos; WOFF2 con `font-display: swap`. Si no están disponibles, usar los fallbacks; no bloquear la página.
- Cuerpo: 18 px en escritorio, mínimo 16 px en móvil; interlineado 1.5–1.6. Auxiliar: 14 px solo para metadatos breves; nunca precio, ingrediente o acción importante.
- H1: `clamp(2.25rem, 5vw, 4.5rem)`; H2: `clamp(1.75rem, 3vw, 3rem)`; H3: 22–26 px. Títulos con interlineado 1.08–1.2 y sin cortes de palabra forzados.
- Títulos en estilo oración; mayúsculas solo para rótulos pequeños. Precios con cifras tabulares, formato MXN consistente y sin depender de decimales minúsculos.
- Líneas de texto de 45–70 caracteres; un H1 descriptivo por página como convención editorial y encabezados jerárquicos.

## 5. Retícula y forma

- Contenedor máximo: 1240 px; padding lateral 20 px móvil, 32 px tablet, 48 px escritorio.
- Escala de espacio: 4, 8, 12, 16, 24, 32, 48, 64, 96 px. Secciones de 48 px móvil y 72–96 px escritorio, ajustadas al contenido.
- Radio: 4 px campos, 8 px botones, 12 px contenedores y fotografía. Las categorías pueden usar extremos redondeados; no convertir todo en píldoras.
- Borde de 1 px; predominan líneas finas y superficies planas. Sombra solo para panel superpuesto o cabecera cuando haga falta separación.
- Iconos SVG de una misma biblioteca, 20–24 px, trazo consistente. Texto visible en acciones principales. No usar emojis como sistema de iconografía.
- Sin degradados, glassmorphism, tarjetas flotantes repetidas, blobs ni texturas raster adicionales. Los separadores y pequeños índices se dibujan con CSS.

## 6. Composición de inicio

1. Cabecera compacta crema: logo horizontal, enlaces Menú, Cómo pedir, Ubicación y ayuda; acceso al pedido con cantidad. Empresas en segundo plano. Altura orientativa 72–88 px escritorio y 64–72 px móvil, permitiendo crecimiento con zoom.
2. Apertura editorial: rótulo «Estilo Siberia · San Luis Potosí», H1 propuesto «Tostadas estilo Siberia, sabor norteño en SLP», una frase útil y CTA «Ver menú». Fotografía de tostada a la derecha, con proporción aproximada 5:4. Texto y foto en columnas 5/7; en móvil, texto primero y fotografía compacta después.
3. Estado de servicio del servidor cerca del CTA o del menú. Si no se conoce, no mostrar «Abierto». En móvil de 390 × 844, llegar al comienzo del menú sin atravesar una portada de pantalla completa; medirlo sin confundir un aviso obligatorio de privacidad con contenido editorial.
4. Menú completo con categorías y precios, no una selección que obligue a visitar otra página para elegir. Una promoción activa ocupa una franja breve asociada a los productos correspondientes.
5. Franja explicativa de cómo pedir: elegir, revisar entrega, enviar a caja. Describir las reglas reales, sin inventar tiempos.
6. Información local y ayuda, seguida de un pie útil con contacto, horarios, privacidad, preferencias de estadísticas y acceso empresarial.

No añadir historia extensa, reseñas, galería del local, newsletter, premios, franquicias ni eventos sin datos y necesidad real. Si falta la dirección, no fabricar un mapa comercial. Si la información está pendiente, dejar la sección configurable y registrar el pendiente, sin lorem ipsum público.

## 7. Menú: variedad sin caos

Categorías iniciales derivadas del catálogo observado: Tostadas, Tacos, Combos, Caldos y complementos, Bebidas. Ajustarlas al inventario real. Usar navegación por anclas a secciones visibles, con `aria-current` cuando proceda, sin roles de pestañas falsos. En móvil permitir ajuste de línea o scroll accesible con indicio de continuidad; ningún encabezado queda oculto bajo elementos fijos.

La categoría de Tostadas puede abrir con una composición destacada del producto Siberia y texto a su lado; las demás usan filas editoriales de nombre, descripción breve, precio y acción, acompañadas por fotos cuando existen recursos fieles. Los combos pueden usar módulos compactos que expliquen lo incluido. No repetir 11 tarjetas gigantes idénticas. A 320–390 px, una columna ordenada; a 768 px, dos columnas solo si el texto cabe; desde aproximadamente 1100 px, catálogo flexible con resumen de pedido de 320–360 px. Los breakpoints responden al contenido.

Cada producto conserva nombre, precio, ingredientes confirmados, disponibilidad e ID. Distinguir JR y grande mediante texto. No repetir la descripción de un taco gigante en el JR sin verificar tamaño. Acción accesible «Agregar [nombre]». Foto de referencia marcada como ilustrativa cerca del menú; no fingir que prueba la porción servida. Sin imagen fiel, usar una fila sin fotografía antes que mostrar un platillo diferente.

Una sola sugerencia opcional de complemento al revisar el pedido, cuando sea pertinente; nunca un upsell después de cada producto. No crear búsqueda para 11 productos; agregarla solo si el catálogo crece y una prueba demuestra utilidad.

## 8. Pedido, entrega y formularios

En escritorio, resumen junto al menú sin comprimirse por debajo de su ancho legible. En móvil, acceso persistente «Ver pedido · N productos» y subtotal; espacio reservado inferior más `env(safe-area-inset-bottom)`. La barra no cubre botones, consentimientos, foco ni ayuda. Antes de cotizar, mostrar «Subtotal» y «Envío por calcular», nunca un total final falso.

Al agregar: actualizar cantidad, mostrar confirmación local y anunciar una frase corta con `role="status"`/`aria-live="polite"`. No desplazar, abrir el carrito ni robar foco. Los cambios de cantidad incluyen +, − y eliminar con nombres completos. Al borrar el último, mostrar vacío y «Explorar el menú».

Panel móvil como diálogo accesible con título, cierre, foco contenido, Escape y devolución al disparador; sin swipe obligatorio. En zoom o baja altura, controles alcanzables mediante scroll. Un resumen expandible dentro de la página también es válido si ofrece una experiencia más robusta; documentar una sola solución coherente.

La entrega se presenta por grupos comprensibles: contacto, domicilio y ubicación, pago, revisión. Evitar un wizard innecesario que fragmente todo en pantallas. Etiquetas visibles, ayudas vinculadas, campos opcionales identificados, errores junto al campo y resumen enfocable. No borrar datos al corregir. Teclados y autocomplete adecuados. No pedir información antes de necesitarla.

Mapa con instrucciones cortas; explicación técnica de kilómetros en un detalle desplegable. Ubicación del navegador solo tras acción explícita y siempre opcional. Debe existir un camino sin arrastrar ni conceder GPS: dirección y selección accesible de ubicación si el proveedor lo permite. Si el backend exige pin y no permite resolver una dirección con teclado, registrar ese bloqueo y ofrecer únicamente un canal alternativo real confirmado; no anunciar cumplimiento ni aceptar una entrega que el sistema no puede cotizar.

Estado de envío separado: pendiente, calculando, cotizado, fuera de cobertura, requiere revisión, error. Los cambios de dirección, cantidades o promociones invalidan la cotización cuando corresponde. En el resumen distinguir subtotal, descuento confirmado, envío y total. No asumir que enviar a caja equivale a aceptación, pago o entrega.

## 9. Movimiento

Transiciones de color/opacity de 120–180 ms; panel de hasta 220 ms. Hover sutil en controles, sin saltos de layout ni grandes zooms de comida. Las entradas de sección, si existen, no ocultan contenido hasta ejecutar JavaScript. Respetar `prefers-reduced-motion` y evitar scroll automático innecesario.

Sin carrusel automático ni video de portada en V1. Promociones en bloque estático; si hay varias, lista breve o controles manuales accesibles. Nada de scroll secuestrado, parallax, marquesinas infinitas o carga teatral.

## 10. Imágenes y logo

Usar el logo proporcionado sin recolorear, deformar o reconstruir su lettering. La lámina adjunta contiene varias aplicaciones y no es por sí sola un logo listo para cabecera. Preferir archivo oficial SVG/PNG transparente o variante horizontal individual existente. Si solo hay lámina, usar una extracción convencional de la variante adecuada y verificar resolución si la tarea lo autoriza; nunca generar un logo nuevo. Registrar que el vector oficial sigue pendiente. No cargar toda la lámina en la navegación ni fingir transparencia con CSS.

Prohibido generar imágenes. Seleccionar fotografías remotas por URL estable, sin descargar para este prototipo. Priorizar material actual del negocio si es fiel y se permite reutilizar; después, stock con licencia documentada. No tomar imágenes de las referencias o de otros restaurantes por estar disponibles públicamente.

Recurso inicial verificado visualmente el 22/10/2026: fotografía de tostada de pollo, guacamole y crema, de Israel Albornoz:

- Página y autor: https://www.pexels.com/photo/close-up-photo-of-tostada-12034617/
- URL directa: https://images.pexels.com/photos/12034617/pexels-photo-12034617.jpeg?auto=compress&cs=tinysrgb&w=1200
- Uso propuesto: apertura editorial o categoría de tostadas, como fotografía ilustrativa; no prueba de producto real.
- Licencia publicada: https://www.pexels.com/license/ . Revalidar condiciones y carga remota antes de implementar.

Para tacos, caldos, consomé y bebida, elegir fotos que correspondan a esos productos, no reutilizar la tostada para todos. No fotografiar stock como supuesto local o supuesto equipo. Registrar en `assets-manifest.md`: sección, URL directa, página, autor, licencia, fecha de comprobación, alt, dimensiones, recorte y carácter provisional. Si no hay foto apropiada y gratuita, omitirla en esa fila y documentarlo.

Usar `srcset`, `sizes`, dimensiones reservadas y formatos optimizados del proveedor cuando estén disponibles; no descargar originales de varios MB al teléfono. Prioridad alta solo para la imagen LCP; lazy loading bajo el primer viewport; fallback sin salto de layout cuando falle el host. No usar URLs aleatorias, imágenes base64 ni un generador. Las URLs remotas reducen trabajo de creación, pero siguen consumiendo red y tienen disponibilidad y privacidad dependientes del proveedor.

## 11. Accesibilidad como condición de diseño

Objetivo: WCAG 2.2 AA en todo el alcance público. Contraste de texto normal ≥4.5:1; texto grande ≥3:1; controles e indicadores de foco identificables ≥3:1 frente a colores adyacentes donde aplica. Foco visible con anillo de 3 px y separación, adaptado a fondo claro u oscuro, sin quedar oculto por barras.

Objetivo táctil propio de 44 × 44 CSS px como mínimo para acciones; separaciones suficientes. WCAG 2.2 AA establece 24 × 24 CSS px con excepciones para tamaño de objetivo; nuestra meta de diseño es más amplia. No comunicar información solo por color. Sin interacciones exclusivas de hover, arrastre o gesto.

HTML semántico, landmarks, enlace para saltar al contenido, enlaces para navegar y botones para actuar. Logo con nombre accesible; alt descriptivo útil, decoraciones con alt vacío. No duplicar anuncios del carrito en múltiples regiones live.

Verificar teclado, lector de pantalla, zoom 200%, reflujo a 320 CSS px y ampliación equivalente al 400% en viewport de escritorio adecuado. Aceptar crecimiento de textos y traducción, no fijar alturas que recorten. Una puntuación automática o un widget no sustituyen la revisión manual.

## 12. Criterio visual de aceptación

Debe reconocerse la marca por crema, verde, serif robusta, jerarquía editorial y la tostada Siberia. Con fotos desactivadas aún se entiende la oferta y se puede elegir. En móvil se llega rápidamente al menú y se revisa el pedido sin recorrerlo entero. Cada control tiene un estado y propósito claro. Si se puede cambiar el nombre por el de cualquier negocio sin que nada parezca específico, revisar la composición y el contenido antes de darlo por terminado.
