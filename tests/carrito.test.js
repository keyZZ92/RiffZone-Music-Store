/**
 * @jest-environment jsdom
 */
describe('carrito.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="seguir-comprando"></button>
      <button id="btn-pagar"></button>
    `;
    localStorage.clear();
    window.requireLogin = jest.fn(() => true);
  });

  it('redirige a la última página al hacer click en "seguir-comprando"', () => {
    localStorage.setItem('ultimaPagina', 'test.html');
    require('../src/js/carrito.js');
    const btn = document.getElementById('seguir-comprando');
    delete window.location;
    window.location = { href: '' };
    btn.click();
    expect(window.location.href).toBe('test.html');
  });

  it('muestra alerta al pagar si requireLogin devuelve true', () => {
    window.alert = jest.fn();
    require('../src/js/carrito.js');
    const btn = document.getElementById('btn-pagar');
    btn.click();
    expect(window.alert).toHaveBeenCalledWith('¡Gracias por tu compra! (Simulación de pago)');
  });
});
