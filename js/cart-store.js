/**
 * cart-store.js — Gestor de estado del carrito, reconciliación y persistencia segura
 * 
 * Regla de privacidad estricta:
 * Solo se almacenan IDs de producto y cantidades en localStorage ('ltn_cart_v1').
 * NUNCA se persiste nombre, teléfono, dirección, coordenadas ni datos personales.
 */

import { getProductById } from './catalog-data.js';

const STORAGE_KEY = 'ltn_cart_v1';

class CartStore {
  constructor() {
    this.items = [];
    this.listeners = [];
    this.loadFromStorage();
  }

  /**
   * Carga y reconcilia el carrito desde localStorage
   */
  loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Reconciliación: verificar que cada ID exista y esté disponible en el catálogo actual
          this.items = parsed
            .filter(item => {
              const product = getProductById(item.productId);
              return product && product.isAvailable && typeof item.quantity === 'number' && item.quantity > 0;
            })
            .map(item => ({
              productId: item.productId,
              quantity: Math.min(Math.max(1, Math.floor(item.quantity)), 99)
            }));
        }
      }
    } catch (e) {
      console.warn('Almacenamiento local no disponible, operando en memoria:', e);
      this.items = [];
    }
  }

  /**
   * Guarda únicamente IDs y cantidades en el almacenamiento
   */
  saveToStorage() {
    try {
      const payload = this.items.map(i => ({ productId: i.productId, quantity: i.quantity }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('No se pudo guardar en almacenamiento local:', e);
    }
  }

  /**
   * Suscribe una función para recibir actualizaciones cuando cambie el carrito
   */
  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getItems(), this.getTotalCount());
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    const items = this.getItems();
    const count = this.getTotalCount();
    this.listeners.forEach(cb => cb(items, count));
    this.saveToStorage();
  }

  getItems() {
    return [...this.items];
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Agrega un producto al carrito
   * @param {string} productId 
   * @param {number} qty 
   * @returns {string} Mensaje para anuncio accesible
   */
  addItem(productId, qty = 1) {
    const product = getProductById(productId);
    if (!product || !product.isAvailable) return null;

    const existing = this.items.find(i => i.productId === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.items.push({ productId, quantity: qty });
    }

    this.notify();
    const count = this.getTotalCount();
    const announcement = `${product.name} agregada. Tienes ${count} producto${count > 1 ? 's' : ''} en el pedido.`;
    this.announceLive(announcement);
    return announcement;
  }

  /**
   * Modifica la cantidad de un ítem existente (+1 o -1)
   */
  updateQuantity(productId, delta) {
    const existingIndex = this.items.findIndex(i => i.productId === productId);
    if (existingIndex === -1) return;

    const product = getProductById(productId);
    const newQty = this.items[existingIndex].quantity + delta;

    if (newQty <= 0) {
      this.removeItem(productId);
    } else {
      this.items[existingIndex].quantity = Math.min(newQty, 99);
      this.notify();
      this.announceLive(`Cantidad de ${product ? product.name : 'producto'} actualizada a ${newQty}.`);
    }
  }

  /**
   * Elimina un producto por completo del carrito
   */
  removeItem(productId) {
    const product = getProductById(productId);
    this.items = this.items.filter(i => i.productId !== productId);
    this.notify();
    this.announceLive(`${product ? product.name : 'Producto'} eliminado del pedido.`);
  }

  /**
   * Vacía el carrito
   */
  clear() {
    this.items = [];
    this.notify();
    this.announceLive('El pedido se ha vaciado.');
  }

  /**
   * Comunica cambios al lector de pantalla mediante live region
   */
  announceLive(message) {
    const announcer = document.getElementById('live-cart-announcer');
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }
  }
}

export const cartStore = new CartStore();
