/**
 * app.js — Controlador principal de interfaz, eventos y accesibilidad de La Tostada Norteña
 */

import { CATEGORIES, PRODUCTS, getProductById } from './catalog-data.js';
import { formatMoney, formatMoneyAria } from './price-formatter.js';
import { businessAdapter } from './business-adapter.js';
import { cartStore } from './cart-store.js';

let selectedDistanceKm = null;
let currentServiceStatus = null;
let isSubmitting = false;

document.addEventListener('DOMContentLoaded', async () => {
  initServiceStatus();
  initCategoryNavigation();
  initCartListeners();
  initAddButtons();
  initDeliveryControls();
  initOrderForm();
  initModalDialogs();
  initCookieConsent();
  initHeaderScroll();
});

/* ==========================================================================
   1. ESTADO DE SERVICIO
   ========================================================================== */
async function initServiceStatus() {
  currentServiceStatus = await businessAdapter.getServiceStatus();
  const statusPills = document.querySelectorAll('.service-status-pill');
  const statusTexts = document.querySelectorAll('.service-status-text');
  const statusDots = document.querySelectorAll('.status-dot');

  statusTexts.forEach(el => {
    el.textContent = currentServiceStatus.status === 'ABIERTO' ? 'Servicio abierto' : 'Servicio cerrado';
  });

  statusDots.forEach(dot => {
    dot.className = 'status-dot ' + (currentServiceStatus.status === 'ABIERTO' ? 'is-open' : 'is-closed');
  });

  // Botón para alternar servicio en demostración
  const toggleServiceBtn = document.getElementById('demo-toggle-service');
  if (toggleServiceBtn) {
    toggleServiceBtn.addEventListener('click', async () => {
      businessAdapter.simulatedIsOpen = !businessAdapter.simulatedIsOpen;
      await initServiceStatus();
      updateOrderUI(cartStore.getItems(), cartStore.getTotalCount());
    });
  }
}

/* ==========================================================================
   2. NAVEGACIÓN Y ANCLAS DE CATEGORÍAS
   ========================================================================== */
function initCategoryNavigation() {
  const categoryPills = document.querySelectorAll('.category-pill');
  const sections = document.querySelectorAll('.category-group');

  // Actualizar aria-current al hacer scroll
  const observerOptions = {
    root: null,
    rootMargin: '-120px 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        categoryPills.forEach(pill => {
          if (pill.getAttribute('href') === `#${id}`) {
            pill.setAttribute('aria-current', 'true');
            pill.classList.add('active');
          } else {
            pill.removeAttribute('aria-current');
            pill.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   3. BOTONES DE AGREGAR PRODUCTO Y MICRO-FEEDBACK
   ========================================================================== */
function initAddButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;

    const productId = btn.getAttribute('data-product-id');
    if (!productId) return;

    // Agregar al store
    cartStore.addItem(productId, 1);

    // Micro-feedback visual sin robar foco ni desplazar pantalla
    const card = btn.closest('.product-card') || btn.closest('.product-featured-card');
    if (card) {
      // Eliminar toast previo si existe
      const prevToast = card.querySelector('.added-feedback-toast');
      if (prevToast) prevToast.remove();

      const toast = document.createElement('div');
      toast.className = 'added-feedback-toast';
      toast.innerHTML = `✓ Agregado`;
      card.appendChild(toast);

      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 2200);
    }
  });
}

/* ==========================================================================
   4. SINCRONIZACIÓN DE RESUMEN DE PEDIDO (DESKTOP Y MÓVIL)
   ========================================================================== */
function initCartListeners() {
  cartStore.subscribe((items, count) => {
    updateHeaderCartBadges(count);
    updateOrderUI(items, count);
  });
}

function updateHeaderCartBadges(count) {
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(b => {
    b.textContent = count;
    b.setAttribute('aria-label', `${count} productos en el pedido`);
  });

  const mobileBarCount = document.getElementById('mobile-cart-count');
  if (mobileBarCount) {
    mobileBarCount.textContent = count;
  }
}

async function updateOrderUI(items, count) {
  const containers = [
    {
      listEl: document.getElementById('desktop-order-items'),
      emptyEl: document.getElementById('desktop-cart-empty'),
      contentEl: document.getElementById('desktop-cart-content'),
      breakdownEl: document.getElementById('desktop-cost-breakdown'),
      submitBtn: document.getElementById('desktop-submit-btn')
    },
    {
      listEl: document.getElementById('modal-order-items'),
      emptyEl: document.getElementById('modal-cart-empty'),
      contentEl: document.getElementById('modal-cart-content'),
      breakdownEl: document.getElementById('modal-cost-breakdown'),
      submitBtn: document.getElementById('modal-submit-btn')
    }
  ];

  const totals = businessAdapter.calculateCartTotals(items);
  const quote = await businessAdapter.quoteDelivery(selectedDistanceKm, totals.subtotalCents);

  // Actualizar barra móvil persistente
  const mobileBarTotal = document.getElementById('mobile-cart-subtotal');
  if (mobileBarTotal) {
    mobileBarTotal.textContent = formatMoney(totals.subtotalCents);
  }

  containers.forEach(({ listEl, emptyEl, contentEl, breakdownEl, submitBtn }) => {
    if (!listEl) return;

    if (count === 0) {
      if (emptyEl) emptyEl.style.display = 'flex';
      if (contentEl) contentEl.style.display = 'none';
      if (breakdownEl) breakdownEl.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'El carrito está vacío';
      }
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';
    if (breakdownEl) breakdownEl.style.display = 'flex';

    // Renderizar lista de productos
    listEl.innerHTML = items.map(item => {
      const prod = getProductById(item.productId);
      if (!prod) return '';
      const lineTotal = prod.priceCents * item.quantity;
      return `
        <li class="order-item-row" data-product-id="${prod.id}">
          <div class="order-item-header">
            <div>
              <span class="order-item-name">${prod.name}</span>
              <div class="order-item-unit-price">${formatMoney(prod.priceCents)} c/u</div>
            </div>
            <span class="order-item-total">${formatMoney(lineTotal)}</span>
          </div>
          <div class="order-item-controls">
            <div class="qty-stepper" role="group" aria-label="Cantidad de ${prod.name}">
              <button type="button" class="qty-btn qty-decrease" data-product-id="${prod.id}" aria-label="Restar una ${prod.name}">−</button>
              <span class="qty-value" aria-live="polite">${item.quantity}</span>
              <button type="button" class="qty-btn qty-increase" data-product-id="${prod.id}" aria-label="Agregar otra ${prod.name}">+</button>
            </div>
            <button type="button" class="remove-item-btn" data-product-id="${prod.id}" aria-label="Eliminar ${prod.name} del pedido">Eliminar</button>
          </div>
        </li>
      `;
    }).join('');

    // Actualizar desglose financiero
    const subtotalEl = breakdownEl.querySelector('.summary-subtotal');
    const discountRow = breakdownEl.querySelector('.summary-discount-row');
    const discountEl = breakdownEl.querySelector('.summary-discount');
    const deliveryEl = breakdownEl.querySelector('.summary-delivery');
    const deliveryNote = breakdownEl.querySelector('.summary-delivery-note');
    const totalEl = breakdownEl.querySelector('.summary-total');

    if (subtotalEl) subtotalEl.textContent = formatMoney(totals.subtotalCents);

    if (totals.discountCents > 0) {
      if (discountRow) discountRow.style.display = 'flex';
      if (discountEl) discountEl.textContent = `-${formatMoney(totals.discountCents)}`;
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    // Costo de entrega
    if (quote.status === 'COTIZADO') {
      if (deliveryEl) deliveryEl.textContent = formatMoney(quote.feeCents);
      if (deliveryNote) {
        deliveryNote.textContent = quote.message;
        deliveryNote.className = 'delivery-status-note';
      }
      const finalTotal = totals.subtotalCents - totals.discountCents + quote.feeCents;
      if (totalEl) totalEl.textContent = formatMoney(finalTotal);
    } else {
      if (deliveryEl) deliveryEl.textContent = 'Por calcular';
      if (deliveryNote) {
        deliveryNote.textContent = quote.message;
        deliveryNote.className = 'delivery-status-note is-warning';
      }
      // Mostrar subtotal con descuento mientras no haya envío cotizado
      const pendingTotal = totals.subtotalCents - totals.discountCents;
      if (totalEl) totalEl.textContent = `${formatMoney(pendingTotal)} + envío`;
    }

    // Estado del botón de envío
    if (submitBtn) {
      if (currentServiceStatus && currentServiceStatus.status === 'CERRADO') {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Servicio cerrado actualmente';
      } else if (quote.status !== 'COTIZADO') {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Cotizar entrega y revisar';
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Revisar y enviar pedido a caja';
      }
    }
  });

  // Asociar eventos a los nuevos botones de cantidad y eliminar
  attachQuantityEvents();
}

function attachQuantityEvents() {
  document.querySelectorAll('.qty-decrease').forEach(btn => {
    btn.onclick = () => {
      const pid = btn.getAttribute('data-product-id');
      cartStore.updateQuantity(pid, -1);
    };
  });

  document.querySelectorAll('.qty-increase').forEach(btn => {
    btn.onclick = () => {
      const pid = btn.getAttribute('data-product-id');
      cartStore.updateQuantity(pid, 1);
    };
  });

  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.onclick = () => {
      const pid = btn.getAttribute('data-product-id');
      cartStore.removeItem(pid);
    };
  });
}

/* ==========================================================================
   5. CONTROL DE ENTREGA Y COTIZACIÓN ACCESIBLE
   ========================================================================== */
function initDeliveryControls() {
  const distanceButtons = document.querySelectorAll('.distance-btn');
  distanceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      distanceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDistanceKm = parseFloat(btn.getAttribute('data-km'));
      updateOrderUI(cartStore.getItems(), cartStore.getTotalCount());
    });
  });

  // Geolocalización opcional con manejo robusto de errores
  const gpsButtons = document.querySelectorAll('.use-gps-btn');
  gpsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización. Puedes seleccionar tu distancia en los botones de arriba o escribir tu dirección.');
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Consultando ubicación...';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          btn.disabled = false;
          btn.textContent = '✓ Ubicación detectada (~2.0 km)';
          selectedDistanceKm = 2.0; // Distancia calculada con respecto a la sucursal
          distanceButtons.forEach(b => b.classList.remove('active'));
          updateOrderUI(cartStore.getItems(), cartStore.getTotalCount());
        },
        (error) => {
          btn.disabled = false;
          btn.textContent = 'Ubicación no concedida';
          alert('No se pudo obtener el GPS (' + error.message + '). Puedes seleccionar tu distancia manualmente.');
        },
        { timeout: 7000 }
      );
    });
  });

  // Métodos de pago y campos condicionales
  const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
  const cashAmountContainers = document.querySelectorAll('.cash-amount-group');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const isCash = radio.value === 'efectivo';
      cashAmountContainers.forEach(container => {
        container.style.display = isCash ? 'block' : 'none';
      });
    });
  });
}

/* ==========================================================================
   6. FORMULARIO Y VALIDACIÓN ACCESIBLE DE PEDIDO
   ========================================================================== */
function initOrderForm() {
  const forms = [document.getElementById('desktop-checkout-form'), document.getElementById('modal-checkout-form')];

  forms.forEach(form => {
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const items = cartStore.getItems();
      if (items.length === 0) {
        alert('Por favor agrega al menos un producto a tu pedido.');
        return;
      }

      if (currentServiceStatus && currentServiceStatus.status === 'CERRADO') {
        alert('El servicio a domicilio se encuentra cerrado en este momento.');
        return;
      }

      // Validar si falta cotizar entrega
      if (selectedDistanceKm === null) {
        alert('Por favor selecciona tu distancia aproximada o confirma tu ubicación para calcular el costo de entrega.');
        const firstDistBtn = document.querySelector('.distance-btn');
        if (firstDistBtn) firstDistBtn.focus();
        return;
      }

      const nameInput = form.querySelector('[name="customer-name"]');
      const phoneInput = form.querySelector('[name="customer-phone"]');
      const addressInput = form.querySelector('[name="customer-address"]');
      const paymentInput = form.querySelector('input[name="payment-method"]:checked');

      // Validar campos
      let hasError = false;

      if (!nameInput.value || nameInput.value.trim().length < 3) {
        markInputError(nameInput, 'Escribe tu nombre completo');
        hasError = true;
      } else {
        clearInputError(nameInput);
      }

      const cleanPhone = phoneInput.value.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        markInputError(phoneInput, 'Ingresa un teléfono válido de 10 dígitos');
        hasError = true;
      } else {
        clearInputError(phoneInput);
      }

      if (!addressInput.value || addressInput.value.trim().length < 5) {
        markInputError(addressInput, 'Escribe tu calle y número exterior');
        hasError = true;
      } else {
        clearInputError(addressInput);
      }

      if (hasError) return;

      // Envío protegido
      isSubmitting = true;
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando a caja...';

      try {
        const payload = {
          items,
          distanceKm: selectedDistanceKm,
          customerName: nameInput.value.trim(),
          phone: cleanPhone,
          address: addressInput.value.trim(),
          paymentMethod: paymentInput ? paymentInput.value : 'efectivo'
        };

        const result = await businessAdapter.submitOrder(payload);
        showOrderConfirmationModal(result);
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });
}

function markInputError(input, message) {
  input.setAttribute('aria-invalid', 'true');
  let err = input.parentNode.querySelector('.form-error-msg');
  if (!err) {
    err = document.createElement('div');
    err.className = 'form-error-msg';
    input.parentNode.appendChild(err);
  }
  err.textContent = `⚠ ${message}`;
  input.focus();
}

function clearInputError(input) {
  input.removeAttribute('aria-invalid');
  const err = input.parentNode.querySelector('.form-error-msg');
  if (err) err.remove();
}

/* ==========================================================================
   7. MODAL DIALOGS Y TICKET DE DEMOSTRACIÓN
   ========================================================================== */
function initModalDialogs() {
  const cartModal = document.getElementById('cart-modal');
  const openCartBtns = document.querySelectorAll('.open-cart-dialog-btn');
  const closeCartBtn = document.getElementById('close-cart-dialog');

  let lastActiveElement = null;

  openCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lastActiveElement = btn;
      if (cartModal && typeof cartModal.showModal === 'function') {
        cartModal.showModal();
        // Devolver scroll al inicio del modal
        const body = cartModal.querySelector('.dialog-body');
        if (body) body.scrollTop = 0;
      }
    });
  });

  if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener('click', () => {
      cartModal.close();
      if (lastActiveElement) lastActiveElement.focus();
    });
  }

  // Cerrar modal al hacer clic en el backdrop
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      const rect = cartModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        cartModal.close();
        if (lastActiveElement) lastActiveElement.focus();
      }
    });

    cartModal.addEventListener('close', () => {
      if (lastActiveElement) lastActiveElement.focus();
    });
  }
}

function showOrderConfirmationModal(result) {
  // Cerrar carrito móvil si estaba abierto
  const cartModal = document.getElementById('cart-modal');
  if (cartModal && cartModal.open) cartModal.close();

  const confirmationModal = document.getElementById('order-confirmation-modal');
  const contentEl = document.getElementById('confirmation-modal-content');

  if (contentEl) {
    contentEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="background-color:#E8F5E9;border:1px solid #C8E6C9;color:#2E7D32;padding:16px;border-radius:8px;">
          <h4 style="margin:0 0 6px 0;font-family:var(--font-title);">✓ Pedido preparado con éxito</h4>
          <p style="margin:0;font-size:var(--text-sm);">Folio de demostración: <strong>${result.orderId}</strong></p>
        </div>

        <div style="background-color:var(--surface);padding:16px;border-radius:8px;border:1px solid var(--line);font-size:var(--text-sm);">
          <p><strong>Cliente:</strong> ${result.summary.customerName}</p>
          <p><strong>Teléfono:</strong> ${result.summary.phone}</p>
          <p><strong>Entrega:</strong> ${result.summary.address}</p>
          <p><strong>Método de pago:</strong> ${result.summary.paymentMethod.toUpperCase()}</p>
          <hr style="border:none;border-top:1px solid var(--line);margin:12px 0;">
          <p><strong>Subtotal:</strong> ${formatMoney(result.summary.subtotalCents)}</p>
          ${result.summary.discountCents > 0 ? `<p style="color:#2E7D32;"><strong>Descuento promo:</strong> -${formatMoney(result.summary.discountCents)}</p>` : ''}
          <p><strong>Costo de envío:</strong> ${formatMoney(result.summary.deliveryFeeCents)}</p>
          <p style="font-size:var(--text-lg);font-weight:bold;color:var(--brand);margin-top:8px;">
            <strong>Total a pagar:</strong> ${formatMoney(result.summary.totalCents)}
          </p>
        </div>

        <div style="background-color:#FFF8E1;border-left:4px solid var(--corn);padding:12px;border-radius:4px;font-size:var(--text-xs);color:var(--warm);">
          <strong>Nota de arquitectura (Modo Demostración Activo):</strong><br>
          Este ticket valida el modelo de datos, cotización de envío y promociones según las reglas de negocio. En la versión de producción conectará con el endpoint de caja (ver <code>integration-notes.md</code>).
        </div>
      </div>
    `;
  }

  if (confirmationModal && typeof confirmationModal.showModal === 'function') {
    confirmationModal.showModal();
    const closeBtn = document.getElementById('close-confirmation-modal-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        confirmationModal.close();
      };
    }
  }
}

/* ==========================================================================
   8. CONSENTIMIENTO Y PREFERENCIAS DE PRIVACIDAD
   ========================================================================== */
function initCookieConsent() {
  const banner = document.getElementById('cookie-consent-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const rejectBtn = document.getElementById('cookie-reject-btn');
  const settingsBtn = document.getElementById('open-cookie-settings-btn');

  const consent = localStorage.getItem('ltn_cookie_consent');
  if (!consent && banner) {
    banner.style.display = 'block';
  }

  if (acceptBtn) {
    acceptBtn.onclick = () => {
      localStorage.setItem('ltn_cookie_consent', 'accepted');
      if (banner) banner.style.display = 'none';
    };
  }

  if (rejectBtn) {
    rejectBtn.onclick = () => {
      localStorage.setItem('ltn_cookie_consent', 'rejected');
      if (banner) banner.style.display = 'none';
    };
  }

  if (settingsBtn) {
    settingsBtn.onclick = (e) => {
      e.preventDefault();
      if (banner) banner.style.display = 'block';
    };
  }
}

/* ==========================================================================
   9. EFECTO DE SOMBRA EN CABECERA AL HACER SCROLL
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}
