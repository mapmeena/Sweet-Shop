import { useState } from 'react'
import { type Sweet } from '../context/SweetContext'
import { useCart } from '../context/CartContext'
import '../styles/SweetCard.css'

interface SweetCardProps {
  sweet: Sweet
  onPurchase: () => void
}

export default function SweetCard({ sweet, onPurchase }: SweetCardProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, sweet.quantity))
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    if (sweet.quantity <= 0 || quantity <= 0) return

    setIsAdding(true)
    
    // Add to cart
    addToCart(sweet, quantity)
    
    setShowSuccess(true)
    setQuantity(1)
    
    setTimeout(() => {
      setShowSuccess(false)
      setIsAdding(false)
    }, 2000)
  }

  const isLowStock = sweet.quantity > 0 && sweet.quantity < 5
  const totalPrice = sweet.price * quantity
  const discount = sweet.quantity < 5 ? 10 : 0

  return (
    <div className={`zomato-card ${sweet.quantity === 0 ? 'sold-out' : ''}`}>
      {/* Success Toast */}
      {showSuccess && (
        <div className="success-toast-zomato">
          <span className="check-icon">✓</span>
          Added to Cart!
        </div>
      )}
      
      {/* Card Image - Zomato Style */}
      <div className="zomato-card-image">
        {!imageError && sweet.image.startsWith('http') ? (
          <img 
            src={sweet.image} 
            alt={sweet.name}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="fallback-emoji">{sweet.image.startsWith('http') ? '🍬' : sweet.image}</div>
        )}
        
        <div className="image-overlay"></div>
        
        {/* Badges - Zomato Style */}
        {sweet.quantity === 0 && (
          <div className="zomato-badge sold-out-badge">SOLD OUT</div>
        )}
        {isLowStock && (
          <div className="zomato-badge hurry-badge">⚡ HURRY! {sweet.quantity} LEFT</div>
        )}
        {discount > 0 && (
          <div className="zomato-badge discount-badge">{discount}% OFF</div>
        )}
      </div>

      {/* Card Content - Zomato Style */}
      <div className="zomato-card-content">
        {/* Header */}
        <div className="card-top">
          <div>
            <h3 className="zomato-sweet-name">{sweet.name}</h3>
            <div className="zomato-category-row">
              <span className="zomato-category">{sweet.category}</span>
              <span className="zomato-rating">⭐ 4.5</span>
            </div>
          </div>
          <div className="zomato-price-tag">
            ₹{sweet.price}
          </div>
        </div>

        <p className="zomato-description">{sweet.description}</p>

        {/* Stock Bar - Vibrant */}
        {sweet.quantity > 0 && (
          <div className="zomato-stock-bar">
            <div className="stock-progress">
              <div 
                className="stock-fill-zomato"
                style={{ 
                  width: `${Math.min((sweet.quantity / 25) * 100, 100)}%`,
                  background: sweet.quantity < 5 ? 'linear-gradient(90deg, #FF5A5F, #E23744)' : 'linear-gradient(90deg, #48C479, #36A864)'
                }}
              ></div>
            </div>
            <span className="stock-text">{sweet.quantity} in stock</span>
          </div>
        )}

        {/* Purchase Controls - Zomato Style */}
        {sweet.quantity > 0 ? (
          <div className="zomato-purchase-section">
            <div className="zomato-quantity-box">
              <button
                className="qty-btn-zomato"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isAdding}
              >
                −
              </button>
              <span className="qty-value-zomato">{quantity}</span>
              <button
                className="qty-btn-zomato"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= sweet.quantity || isAdding}
              >
                +
              </button>
            </div>

            <button
              className="zomato-add-btn"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <span className="spinner-zomato"></span>
                  Adding...
                </>
              ) : (
                <>
                  ADD TO CART · ₹{totalPrice}
                </>
              )}
            </button>
          </div>
        ) : (
          <button className="zomato-sold-out-btn" disabled>
            CURRENTLY UNAVAILABLE
          </button>
        )}
      </div>
    </div>
  )
}
