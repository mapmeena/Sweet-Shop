import { useState } from 'react'
import { useSweets, type Sweet } from '../context/SweetContext'
import '../styles/SweetCard.css'

interface SweetCardProps {
  sweet: Sweet
  onPurchase: () => void
}

export default function SweetCard({ sweet, onPurchase }: SweetCardProps) {
  const { updateSweet } = useSweets()
  const [quantity, setQuantity] = useState(1)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, sweet.quantity))
    setQuantity(newQuantity)
  }

  const handlePurchase = async () => {
    if (sweet.quantity <= 0 || quantity <= 0) return

    setIsPurchasing(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    updateSweet(sweet.id, { quantity: sweet.quantity - quantity })
    
    setShowSuccess(true)
    onPurchase()
    
    setTimeout(() => {
      setShowSuccess(false)
      setQuantity(1)
    }, 3000)

    setIsPurchasing(false)
  }

  const isLowStock = sweet.quantity > 0 && sweet.quantity < 5
  const totalPrice = sweet.price * quantity

  return (
    <div className={`sweet-card-premium ${sweet.quantity === 0 ? 'out-of-stock-card' : ''}`}>
      {/* Success Toast */}
      {showSuccess && (
        <div className="success-toast fade-in">
          <span className="success-icon">✓</span>
          Order Placed Successfully!
        </div>
      )}
      
      {/* Card Image Section */}
      <div className="card-image-section">
        <div className="card-gradient-bg"></div>
        <div className="sweet-emoji-large">{sweet.image}</div>
        
        {/* Badges */}
        {sweet.quantity === 0 && (
          <div className="badge badge-sold-out">SOLD OUT</div>
        )}
        {isLowStock && (
          <div className="badge badge-low-stock">Only {sweet.quantity} Left!</div>
        )}
        
        {/* Category Chip */}
        <div className="category-chip">{sweet.category}</div>
      </div>

      {/* Card Content */}
      <div className="card-content-premium">
        <div className="card-header-premium">
          <h3 className="sweet-title-premium">{sweet.name}</h3>
          <div className="price-tag-premium">
            <span className="currency">₹</span>
            <span className="price-amount">{sweet.price}</span>
          </div>
        </div>

        <p className="sweet-description-premium">{sweet.description}</p>

        {/* Stock Info */}
        <div className="stock-info-bar">
          <div className="stock-label">
            <span className="stock-icon">📦</span>
            Stock Available
          </div>
          <div className="stock-bar">
            <div 
              className="stock-fill"
              style={{ 
                width: `${Math.min((sweet.quantity / 20) * 100, 100)}%`,
                backgroundColor: sweet.quantity < 5 ? '#f44336' : '#4caf50'
              }}
            ></div>
          </div>
          <span className="stock-count">{sweet.quantity} units</span>
        </div>

        {/* Purchase Section */}
        {sweet.quantity > 0 ? (
          <div className="purchase-section-premium">
            <div className="quantity-control-premium">
              <button
                className="qty-btn-premium minus"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isPurchasing}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <div className="qty-display">
                <input
                  type="number"
                  min="1"
                  max={sweet.quantity}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="qty-input-premium"
                  disabled={isPurchasing}
                  aria-label="Quantity"
                />
              </div>
              <button
                className="qty-btn-premium plus"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= sweet.quantity || isPurchasing}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className="purchase-btn-premium"
              onClick={handlePurchase}
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <>
                  <span className="btn-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="cart-icon">🛒</span>
                  Add to Cart
                </>
              )}
            </button>

            <div className="total-price-display">
              <span className="total-label">Total:</span>
              <span className="total-amount">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ) : (
          <div className="sold-out-section">
            <button className="sold-out-btn" disabled>
              <span>😞</span>
              Currently Unavailable
            </button>
            <p className="notify-text">We'll restock soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
