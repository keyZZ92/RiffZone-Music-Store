/**
 * @jest-environment jsdom
 */
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          id: 1,
          name: 'Guitarra Test',
          price: 100,
          offerPrice: 80,
          image: 'img.png',
          description: 'desc',
          category: ['guitar'],
        },
      ]),
  })
);

describe('productos.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="guitar-products"></div>`;
    localStorage.clear();
    window.actualizarContadorCarrito = jest.fn();
  });

  it('carga productos y los muestra en el DOM', async () => {
    await require('../src/js/productos.js');
    const card = document.querySelector('.card-title');
    expect(card.textContent).toBe('Guitarra Test');
  });

  it('añade producto al carrito al hacer click', async () => {
    await require('../src/js/productos.js');
    const btn = document.querySelector('.btn-add-cart');
    btn.click();
    const carrito = JSON.parse(localStorage.getItem('carrito'));
    expect(carrito[0].nombre).toBe('Guitarra Test');
    expect(window.actualizarContadorCarrito).toHaveBeenCalled();
  });
});
