import { useState } from 'react'
import { createProduct, updateProduct, errorMessage } from '../api'

export default function ProductForm({ product, onDone, onCancel }) {
  const editing = !!product
  const [form, setForm] = useState({
    product_name: product?.product_name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? '',
    quantity: product?.quantity ?? '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Quick checks before calling the API (the API validates again)
    if (!form.product_name.trim()) return setError('Product name is required.')
    if (form.price === '' || Number(form.price) < 0) return setError('Price must be 0 or higher.')
    if (form.quantity === '' || !Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0)
      return setError('Quantity must be a whole number, 0 or higher.')

    const payload = {
      product_name: form.product_name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    }

    setSaving(true)
    try {
      if (editing) {
        await updateProduct(product.id, payload)
        onDone('Product updated.')
      } else {
        await createProduct(payload)
        onDone('Product added.')
      }
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
      {error && <div className="alert error">{error}</div>}

      <label>Product Name</label>
      <input name="product_name" value={form.product_name} onChange={change} maxLength={100} />

      <label>Description</label>
      <textarea name="description" value={form.description} onChange={change} rows={3} />

      <label>Price</label>
      <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={change} />

      <label>Quantity</label>
      <input name="quantity" type="number" step="1" min="0" value={form.quantity} onChange={change} />

      <div className="row">
        <button className="btn" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Save'}</button>
        <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}