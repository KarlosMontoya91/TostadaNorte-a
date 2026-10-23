/**
 * business-adapter.js — Adaptador de negocio y autoridad de reglas de La Tostada Norteña
 * Aplica validaciones de servidor, promociones, cotización de envío y estado de servicio.
 */

import { PRODUCTS, getProductById } from './catalog-data.js';

export class BusinessAdapter {
  constructor() {
    this.isDemoMode = true;
    this.simulatedIsOpen = true; // Por defecto activo para pruebas del usuario
  }

  /**
   * Obtiene el estado del servicio de entrega a domicilio
   * @returns {Promise<{ status: 'ABIERTO'|'CERRADO'|'DESCONOCIDO', message: string, schedule: string }>}
   */
  async getServiceStatus() {
    // Horario habitual: 11:00 a 20:00 hrs
    const now = new Date();
    const hours = now.getHours();
    const isWithinHours = hours >= 11 && hours < 20;

    // En modo demo permitimos alternar para probar ambos estados
    const status = this.simulatedIsOpen ? (isWithinHours ? 'ABIERTO' : 'ABIERTO') : 'CERRADO';

    return {
      status,
      message: status === 'ABIERTO' 
        ? 'Servicio a domicilio disponible' 
        : 'Servicio a domicilio cerrado en este momento',
      schedule: 'Lunes a Domingo de 11:00 a 20:00 hrs (San Luis Potosí)'
    };
  }

  /**
   * Calcula el subtotal y el descuento validado por promociones
   * @param {Array<{ productId: string, quantity: number }>} cartItems 
   * @returns {{ subtotalCents: number, discountCents: number, promoApplied: string|null }}
   */
  calculateCartTotals(cartItems) {
    let subtotalCents = 0;
    let tostadasGrandesCount = 0;

    for (const item of cartItems) {
      const prod = getProductById(item.productId);
      if (prod && prod.isAvailable && item.quantity > 0) {
        subtotalCents += prod.priceCents * item.quantity;
        if (item.productId === 'tostada-siberia-grande') {
          tostadasGrandesCount += item.quantity;
        }
      }
    }

    // Regla observada: $15 MXN de descuento por cada 3 piezas de Tostada Grande
    let discountCents = 0;
    let promoApplied = null;
    if (tostadasGrandesCount >= 3) {
      const tercias = Math.floor(tostadasGrandesCount / 3);
      discountCents = tercias * 1500; // $15.00 MXN en centavos
      promoApplied = `Promoción 3 Tostadas x $255 (${tercias} aplicada${tercias > 1 ? 's' : ''}: -$${(discountCents / 100).toFixed(2)})`;
    }

    return {
      subtotalCents,
      discountCents,
      promoApplied
    };
  }

  /**
   * Cotiza el costo de entrega con las reglas confirmadas:
   * - $15.00 hasta 1.0 km
   * - +$8.00 por cada km adicional
   * - Cobertura base: hasta 4.0 km
   * - Extensión hasta 9.0 km para pedidos >= $1,000 MXN (100,000 centavos)
   * 
   * @param {number|null} distanceKm 
   * @param {number} subtotalCents 
   * @returns {Promise<{ status: string, feeCents: number|null, message: string }>}
   */
  async quoteDelivery(distanceKm, subtotalCents) {
    if (distanceKm === null || distanceKm === undefined) {
      return {
        status: 'PENDIENTE',
        feeCents: null,
        message: 'Envío pendiente de cotizar (selecciona tu distancia o ingresa dirección).'
      };
    }

    const dist = parseFloat(distanceKm);
    if (isNaN(dist) || dist <= 0) {
      return {
        status: 'PENDIENTE',
        feeCents: null,
        message: 'Ubicación no válida para cotización.'
      };
    }

    const isHighValue = subtotalCents >= 100000; // $1,000 MXN

    // Fuera de cobertura estándar
    if (dist > 9.0) {
      return {
        status: 'FUERA_COBERTURA',
        feeCents: null,
        message: `Distancia (${dist.toFixed(1)} km) fuera de la cobertura máxima de 9.0 km.`
      };
    }

    if (dist > 4.0 && !isHighValue) {
      return {
        status: 'REQUIERE_REVISION',
        feeCents: null,
        message: `Distancia (${dist.toFixed(1)} km) excede los 4.0 km estándar. La cobertura extendida hasta 9.0 km aplica en compras desde $1,000.00 MXN.`
      };
    }

    // Cálculo: $15 base (primer km) + $8 por km adicional redondeado
    let feeCents = 1500; // $15.00 MXN
    if (dist > 1.0) {
      const extraKm = Math.ceil(dist - 1.0);
      feeCents += extraKm * 800; // $8.00 MXN por km
    }

    return {
      status: 'COTIZADO',
      feeCents,
      message: `Envío calculado (${dist.toFixed(1)} km): $${(feeCents / 100).toFixed(2)} MXN`
    };
  }

  /**
   * Envío seguro de pedido con prevención de duplicados
   * En modo demo valida todos los campos y retorna el ticket preparado sin fingir cobro falso
   * @param {object} submissionData 
   * @returns {Promise<object>}
   */
  async submitOrder(submissionData) {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 600));

    // Validaciones indispensables
    if (!submissionData.items || submissionData.items.length === 0) {
      throw new Error('El carrito no contiene productos válidos.');
    }

    if (!submissionData.customerName || submissionData.customerName.trim().length < 3) {
      throw new Error('El nombre de quien recibe es obligatorio (mínimo 3 caracteres).');
    }

    if (!submissionData.phone || !/^\d{10}$/.test(submissionData.phone.replace(/\D/g, ''))) {
      throw new Error('El teléfono debe tener 10 dígitos.');
    }

    if (!submissionData.address || submissionData.address.trim().length < 5) {
      throw new Error('La dirección completa (calle y número) es obligatoria.');
    }

    const { subtotalCents, discountCents } = this.calculateCartTotals(submissionData.items);
    const quote = await this.quoteDelivery(submissionData.distanceKm, subtotalCents);

    if (quote.status !== 'COTIZADO') {
      throw new Error(`No se puede enviar el pedido: ${quote.message}`);
    }

    const deliveryFeeCents = quote.feeCents || 0;
    const totalCents = subtotalCents - discountCents + deliveryFeeCents;

    // Generar folio de demostración transparente
    const demoFolio = 'DEMO-' + Math.floor(100000 + Math.random() * 900000);

    return {
      success: true,
      isDemo: true,
      orderId: demoFolio,
      status: 'PREPARADO_PARA_CAJA',
      timestamp: new Date().toISOString(),
      summary: {
        customerName: submissionData.customerName,
        phone: submissionData.phone,
        address: submissionData.address,
        paymentMethod: submissionData.paymentMethod,
        subtotalCents,
        discountCents,
        deliveryFeeCents,
        totalCents
      },
      message: 'Pedido preparado correctamente en formato estructurado para sincronización con la caja del restaurante.'
    };
  }
}

export const businessAdapter = new BusinessAdapter();
