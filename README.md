# Rediseño de La Tostada Norteña (V1.0)

> **Implementación funcional y ejecutable del rediseño público de experiencia, accesibilidad y producto para *La Tostada Norteña* (San Luis Potosí).**

---

## 1. Instrucciones de ejecución local

El proyecto está construido sobre una arquitectura web moderna, ligera y de **cero dependencias externas**. No requiere compilar ni instalar paquetes npm pesados para funcionar.

### Opción A (Recomendada en Windows PowerShell):
Ejecuta el servidor web nativo incluido:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 3000
```
Abre en tu navegador: **[http://localhost:3000/](http://localhost:3000/)**

### Opción B (Con cualquier servidor HTTP estático):
Si dispones de Python, PHP o Node.js:
- **Python:** `python -m http.server 3000`
- **PHP:** `php -S localhost:3000`
- **Node / npx:** `npx serve . -p 3000`

---

## 2. Entregables y Documentación Técnica

| Documento | Propósito y Contenido |
|---|---|
| [**`design.md`**](file:///c:/Users/karlo/Documents/KarlosConK/proyectos/proyecto_laTostadaNorteña/web_tostadaNorteña_antigravity/design.md) | Contrato visual maestro, paleta de colores (`--canvas`, `--brand`, `--corn`, etc.), tipografía (Bree Serif, Source Sans 3), escalas, radios y accesibilidad WCAG 2.2 AA. |
| [**`content-inventory.md`**](file:///c:/Users/karlo/Documents/KarlosConK/proyectos/proyecto_laTostadaNorteña/web_tostadaNorteña_antigravity/content-inventory.md) | Inventario de las 11 opciones del catálogo real observado el 22/10/2026, ingredientes confirmados, reglas de promoción, tarifas de envío y enlaces operativos. |
| [**`assets-manifest.md`**](file:///c:/Users/karlo/Documents/KarlosConK/proyectos/proyecto_laTostadaNorteña/web_tostadaNorteña_antigravity/assets-manifest.md) | Registro de logotipo oficial de marca (fondos crema y oscuro) y fotografías de stock con licencias comerciales libres verificadas y probadas (Pexels / Unsplash). |
| [**`integration-notes.md`**](file:///c:/Users/karlo/Documents/KarlosConK/proyectos/proyecto_laTostadaNorteña/web_tostadaNorteña_antigravity/integration-notes.md) | Contratos de datos (TypeScript/JSDoc), arquitectura del `BusinessAdapter`, estado de demostración transparente y puntos de conexión pendientes para producción. |
| [**`qa-report.md`**](file:///c:/Users/karlo/Documents/KarlosConK/proyectos/proyecto_laTostadaNorteña/web_tostadaNorteña_antigravity/qa-report.md) | Informe de pruebas funcionales, auditoría de contraste WCAG 2.2 AAA/AA, viewports comprobados (1440, 1024, 768, 390 y 320 px) y validación de teclado/lectores de pantalla. |

---

## 3. Decisiones clave de diseño y producto

1. **Jerarquía Visual y Marca:**
   - La identidad parte del imagotipo del cactus con sombrero y tostada siberia. Se usan los colores de marca: crema cálido (`#FFF9ED`), verde norteño profundo (`#245333`), y acentos discretos de maíz (`#F2BD38`) y chile (`#A5422B`).
   - Títulos en **Bree Serif** que aportan cercanía, tradición y personalidad; cuerpo en **Source Sans 3** con interlineado holgado para máxima legibilidad.

2. **Recorrido de Compra sin Fricción:**
   - **El hero no es una promoción invasiva**: La apertura editorial presenta el producto con una frase clara (*«Tostadas estilo Siberia, sabor norteño en SLP»*), estado de servicio en vivo y un botón directo a *Elegir mi pedido*.
   - **Catálogo organizado por categorías**: Tostadas, Tacos Siberia, Combos completos, Caldos y complementos, y Bebidas.
   - **Micro-feedback visual no intrusivo**: Al presionar *«Agregar»*, aparece un indicador local sin robar el foco del usuario ni forzar saltos de scroll.

3. **Manejo Riguroso del Dinero y Cotización:**
   - Todo el dinero se opera en **centavos enteros MXN** para evitar inconsistencias de coma flotante, formateado mediante `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`.
   - **Envío transparente**: Se muestra como *«Por calcular»* antes de confirmar distancia; nunca se comunica engañosamente un costo de $0.00 como si fuera envío gratis.
   - **Promoción validada**: Descuento de $15.00 MXN automático por cada 3 Tostadas Grandes ($255.00 total por tercia).

4. **Accesibilidad e Inclusión (WCAG 2.2 AA):**
   - Diálogos móviles y de confirmación construidos con el elemento estándar HTML5 `<dialog>` con trampa de foco y cierre accesible por `Escape`.
   - Barra persistente móvil con `env(safe-area-inset-bottom)` para no solaparse con gestos del sistema.
   - Alternativa de entrega 100% operable por teclado sin necesidad obligatoria de GPS ni arrastre de mapas.
   - Región en vivo accesible (`role="status" aria-live="polite"`) para avisos a personas con lectores de pantalla.
   - Anillos de foco de alto contraste (`3px solid var(--brand)` con separación de `2px`).

5. **Privacidad Estricta:**
   - El almacenamiento local (`localStorage`) almacena **únicamente IDs de productos y cantidades**.
   - No se persiste nombre, teléfono, domicilio ni coordenadas del cliente.
   - Banner de cookies con mecanismos de **Aceptar** y **Rechazar** en igualdad de condiciones.
