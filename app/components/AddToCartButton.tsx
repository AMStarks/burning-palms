"use client"

import { useState } from "react"

type Variant = {
  id: string
  title: string
  price: string
  available: boolean
}

type Product = {
  id: string
  title: string
  handle: string
  variants: Variant[]
}

export function AddToCartButton({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id || "")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const addToCart = async () => {
    if (!selectedVariant) return

    setLoading(true)
    try {
      // Add item to Shopify cart
      const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "burning-palms.myshopify.com"
      const response = await fetch(`https://${storeDomain}/cart/add.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: selectedVariant,
            quantity: quantity
          }]
        })
      })

      if (response.ok) {
        // Redirect to Shopify checkout
        window.location.href = `https://${storeDomain}/checkout`
      } else {
        console.error('Failed to add to cart')
        alert('Failed to add item to cart. Please try again.')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error adding item to cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Variant Selection */}
      {product.variants.length > 1 && (
        <div>
          <label className="block text-sm font-medium mb-2">Select Variant</label>
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id} disabled={!variant.available}>
                {variant.title} {!variant.available && '(Out of Stock)'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quantity Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={addToCart}
        disabled={loading || !selectedVariant || !product.variants.find(v => v.id === selectedVariant)?.available}
        className="w-full px-6 py-3 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 disabled:opacity-50 disabled:cursor-not-allowed font-display text-lg"
      >
        {loading ? 'Adding...' : 'Add to Cart & Checkout'}
      </button>
    </div>
  )
}
