'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/cart/addToCart',
      handler: 'api::cart.cart.addToCart',
      config: {
        auth: false
      },
    },
    {
      method: 'GET',
      path: '/cart/getCart',
      handler: 'api::cart.cart.getCart',
      config: {
      },
    },
    {
      method: 'GET',
      path: '/cart/getCart',
      handler: 'api::cart.cart.getCart',
      config: {
        auth: { enabled: true },
      },
    },
  ],
};