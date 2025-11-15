import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSweets } from '../context/SweetContext'
import { useCart } from '../context/CartContext'
import SweetCard from './SweetCard'
import AdminPanel from './AdminPanel'
import Cart from './Cart'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { sweets } = useSweets()
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 500, max: 1500 })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [purchaseCount, setPurchaseCount] = useState(0)
  const { getCartCount } = useCart()

  // Get unique categories
  const categories = useMemo(() => {
    return ['all', ...new Set(sweets.map((s) => s.category))]
  }, [sweets])

  // Filter sweets based on search, price range, and category
  const filteredSweets = useMemo(() => {
    return sweets.filter((sweet) => {
      const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sweet.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = sweet.price >= priceRange.min && sweet.price <= priceRange.max
      const matchesCategory = selectedCategory === 'all' || sweet.category === selectedCategory
      return matchesSearch && matchesPrice && matchesCategory
    })
  }, [sweets, searchTerm, priceRange, selectedCategory])

  const handlePurchase = () => {
    setPurchaseCount(purchaseCount + 1)
  }

  if (user?.role === 'admin' && showAdminPanel) {
    return (
      <AdminPanel
        onBack={() => setShowAdminPanel(false)}
      />
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="logo">🍬 Sweet Haven</h1>
          <div className="header-right">
            <button className="cart-icon-btn" onClick={() => setShowCart(true)}>
              🛒
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </button>
            <span className="user-info">
              👤 {user?.username} ({user?.role})
            </span>
            {user?.role === 'admin' && (
              <button
                className="admin-button"
                onClick={() => setShowAdminPanel(true)}
              >
                ⚙️ Admin Panel
              </button>
            )}
            <button className="logout-button" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Search and Filter Section */}
        <section className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search sweets, descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            {/* Category Filter */}
            <div className="filter-group">
              <label>Category:</label>
              <div className="category-buttons">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <label>Price Range: ₹{priceRange.min} - ₹{priceRange.max}</label>
              <div className="price-range">
                <input
                  type="range"
                  min="500"
                  max="1500"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      min: Math.min(parseInt(e.target.value), priceRange.max),
                    })
                  }
                  className="range-input"
                />
                <input
                  type="range"
                  min="500"
                  max="1500"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: Math.max(parseInt(e.target.value), priceRange.min),
                    })
                  }
                  className="range-input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Results Count and Purchase Stats */}
        <div className="results-header">
          <p className="results-count">
            Showing {filteredSweets.length} of {sweets.length} sweets
            {purchaseCount > 0 && <span className="purchase-count"> | Orders: {purchaseCount}</span>}
          </p>
        </div>

        {/* Products Grid */}
        <section className="products-section">
          {filteredSweets.length > 0 ? (
            <div className="products-grid">
              {filteredSweets.map((sweet) => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>😢 No sweets found matching your criteria</p>
              <p>Try adjusting your filters or search term</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2024 Sweet Haven. All rights reserved.</p>
      </footer>

      {/* Cart Modal */}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div>
  )
}
