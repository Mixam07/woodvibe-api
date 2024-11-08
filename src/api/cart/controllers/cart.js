'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cart.cart', ({ strapi }) => ({
  async addToCart(ctx) {
    const userId = ctx.state.user?.id;
    const { productId, name, price, quantity } = ctx.request.body;

    //if (!userId) {
    //  return ctx.badRequest('User not authenticated');
    //}

    let cart = await strapi.entityService.findMany('api::cart.cart', {
      filters: { user: userId },
    });

    if (!cart.length) {
      cart = await strapi.entityService.create('api::cart.cart', {
        data: {
          user: userId,
          items: [],
          total: 0,
        },
      });
    } else {
      cart = cart[0];
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity });
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updatedCart = await strapi.entityService.update('api::cart.cart', cart.id, {
      data: { items: cart.items, total: cart.total },
    });

    ctx.send(updatedCart);
  },

  async getCart(ctx) {
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.badRequest('User not authenticated');
    }

    const cart = await strapi.entityService.findMany('api::cart.cart', {
      filters: { user: userId },
    });

    if (!cart.length) {
      return ctx.send({
        items: [],
        total: 0,
      });
    }

    ctx.send(cart[0]);
  },

  async removeFromCart(ctx) {
    const userId = ctx.state.user?.id;
    const { productId } = ctx.request.body;

    if (!userId) {
      return ctx.badRequest('User not authenticated');
    }

    let cart = await strapi.entityService.findMany('api::cart.cart', {
      filters: { user: userId },
    });

    if (!cart.length) {
      return ctx.badRequest('Cart not found');
    }

    cart = cart[0];

    cart.items = cart.items.filter((item) => item.productId !== productId);

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updatedCart = await strapi.entityService.update('api::cart.cart', cart.id, {
      data: { items: cart.items, total: cart.total },
    });

    ctx.send(updatedCart);
  },
}));