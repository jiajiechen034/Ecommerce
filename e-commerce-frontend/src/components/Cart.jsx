function Cart({ cartItems, onRemoveFromCart, onClearCart }) {
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
          {cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} item{cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0) === 1 ? '' : 's'}
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

            <button className="btn btn-primary cart-checkout-button" type="button">
              Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;