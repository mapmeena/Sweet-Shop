import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useSweets } from '../context/SweetContext'
import '../styles/Cart.css'

interface CartProps {
  onClose: () => void
}

export default function Cart({ onClose }: CartProps) {
  const { cart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, getTaxAmount, getGrandTotal } = useCart()
  const { updateSweet } = useSweets()
  const [showCheckout, setShowCheckout] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const deliveryCharge = getCartTotal() > 1000 ? 0 : 50

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update inventory for all items
    for (const item of cart) {
      await updateSweet(item.id, { quantity: item.quantity - item.cartQuantity })
    }
    
    setIsProcessing(false)
    setOrderPlaced(true)
    
    // Clear cart after 3 seconds
    setTimeout(() => {
      clearCart()
      onClose()
    }, 3000)
  }

  if (orderPlaced) {
    return (
      <div className="cart-overlay">
        <div className="order-success-card fade-in">
          <div className="success-animation">
            <div className="success-circle">✓</div>
          </div>
          <h2 className="success-title">Order Placed Successfully!</h2>
          <p className="success-message">Thank you for your order</p>
          <div className="order-total">₹{getGrandTotal()}</div>
          <p className="success-note">Your sweets will be delivered soon! 🍬</p>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-container empty-cart fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>Shopping Cart 🛒</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="empty-cart-content">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some delicious sweets to get started!</p>
            <button className="browse-btn" onClick={onClose}>
              Browse Sweets
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart ({cart.length} items) 🛒</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {!showCheckout ? (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    {item.image.startsWith('http') ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="emoji-img">{item.image}</div>
                    )}
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="item-price">₹{item.price} each</p>
                  </div>

                  <div className="item-controls">
                    <div className="qty-controls-cart">
                      <button
                        className="qty-btn-cart"
                        onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)}
                      >
                        −
                      </button>
                      <span className="qty-value-cart">{item.cartQuantity}</span>
                      <button
                        className="qty-btn-cart"
                        onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)}
                        disabled={item.cartQuantity >= item.quantity}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">₹{item.price * item.cartQuantity}</div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="summary-row">
                <span>GST (5%)</span>
                <span>₹{getTaxAmount()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge</span>
                <span className={deliveryCharge === 0 ? 'free-delivery' : ''}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              {getCartTotal() < 1000 && (
                <div className="delivery-tip">
                  Add ₹{1000 - getCartTotal()} more for free delivery! 🎉
                </div>
              )}
              <div className="summary-row total-row">
                <span>Grand Total</span>
                <span>₹{getGrandTotal() + deliveryCharge}</span>
              </div>
            </div>

            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
              <button 
                className="checkout-btn" 
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="checkout-section">
              <h3 className="checkout-title">📋 Order Summary</h3>
              
              <div className="checkout-items">
                {cart.map((item) => (
                  <div key={item.id} className="checkout-item">
                    <span className="checkout-item-name">
                      {item.name} x {item.cartQuantity}
                    </span>
                    <span className="checkout-item-price">
                      ₹{item.price * item.cartQuantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bill-breakdown">
                <div className="bill-row">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="bill-row">
                  <span>GST (5%)</span>
                  <span>₹{getTaxAmount()}</span>
                </div>
                <div className="bill-row">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                </div>
                <div className="bill-divider"></div>
                <div className="bill-row bill-total">
                  <span>Total Amount</span>
                  <span>₹{getGrandTotal() + deliveryCharge}</span>
                </div>
              </div>

              <div className="checkout-actions">
                <button 
                  className="back-btn" 
                  onClick={() => setShowCheckout(false)}
                  disabled={isProcessing}
                >
                  ← Back to Cart
                </button>
                <button 
                  className="place-order-btn" 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner"></span>
                      Processing Order...
                    </>
                  ) : (
                    'Place Order 🎉'
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
