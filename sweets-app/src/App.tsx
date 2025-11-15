import './App.css'
import { AuthProvider } from './context/AuthContext'
import { SweetProvider } from './context/SweetContext'
import { CartProvider } from './context/CartContext'
import Home from './Home'

function App() {
  return (
    <AuthProvider>
      <SweetProvider>
        <CartProvider>
          <div className="app">
            <Home />
          </div>
        </CartProvider>
      </SweetProvider>
    </AuthProvider>
  )
}

export default App
