import PropTypes from 'prop-types';

function Cart({
  cartItems,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
  isCheckoutPending = false,
  canCheckout = false,
}) {
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <div>
          <p className="cart-eyebrow">Checkout</p>
          <h2>Shopping Cart</h2>
        </div>

        <p className="cart-item-count">
          {itemCount} item{itemCount === 1 ? '' : 's'}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <p className="cart-empty-state">Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <article className="cart-item-card" key={item.id}>
                <div className="cart-item-content">
                  <div className="cart-item-header">
                    <div>
                      <p className="cart-item-meta">Product</p>
                      <h3 className="cart-item-title">{item.name}</h3>
                    </div>

                    <p className="cart-item-price">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  <p className="cart-item-description">
                    {item.description}
                  </p>
                  <p className="cart-item-quantity">
                    Quantity <span className="cart-quantity-pill">{item.quantity || 1}</span>
                  </p>
                </div>

                <div className="cart-item-actions">
                  <button
                    className="btn btn-primary btn-compact cart-line-total-button"
                    type="button"
                    disabled
                  >
                    ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                  </button>
                  <button
                    className="btn btn-secondary btn-compact"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}

            <div className="cart-actions-row">
              <button className="btn btn-secondary cart-clear-button" onClick={onClearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          <aside className="cart-summary-card">
            <p className="cart-summary-label">Order summary</p>

            <div className="cart-summary-row">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <p className="cart-summary-note">
              Review your items before checking out.
            </p>

            <button
              className="btn btn-primary cart-checkout-button"
              type="button"
              onClick={onCheckout}
              disabled={isCheckoutPending || cartItems.length === 0 || !canCheckout}
            >
              {isCheckoutPending ? 'Processing...' : 'Checkout'}
            </button>

            {!canCheckout && (
              <p className="cart-summary-note">
                Login is required to checkout.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

Cart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string,
      description: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      quantity: PropTypes.number,
    })
  ).isRequired,
  onRemoveFromCart: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
  onCheckout: PropTypes.func,
  isCheckoutPending: PropTypes.bool,
  canCheckout: PropTypes.bool,
};

export default Cart;