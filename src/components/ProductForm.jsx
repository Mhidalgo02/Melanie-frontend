import { useState, useEffect } from 'react'
import { createProduct, updateProduct, errorMessage } from '../api'

export default function ProductForm({ product, onDone, onCancel }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('0')
  const [loading, setLoading] = useState(false)
  const isEditing = !!product

  useEffect(() => {
    if (product) {
      // product from the API likely uses product_name; fall back to name just in case
      setName(product.product_name || product.name || '')
      setDescription(product.description || '')
      setPrice(product.price ?? '')
      setQuantity(String(product.quantity ?? 0))
    }
  }, [product])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || price === '' || quantity === '') {
      alert('Please fill out all required fields.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        product_name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      }
      if (isEditing) {
        await updateProduct(product.id, payload)
        onDone('Product updated successfully.')
      } else {
        await createProduct(payload)
        onDone('Product created successfully.')
      }
    } catch (err) {
      alert(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card">
      <h2>{isEditing ? 'Modify Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            step="1"
            min="0"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button type="button" className="btn secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}