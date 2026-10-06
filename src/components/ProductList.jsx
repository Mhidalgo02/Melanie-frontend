import { useState, useEffect } from 'react'
import { getProducts, deleteProduct, errorMessage } from '../api'

export default function ProductList({ onEdit, onMessage }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data || [])
    } catch (err) {
      onMessage('error', errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      onMessage('success', 'Product deleted successfully.')
    } catch (err) {
      onMessage('error', errorMessage(err))
    }
  }

  if (loading) return <div className="loading">Loading products list...</div>

  return (
    <div className="list-wrapper">
      <h2>Products Inventory</h2>
      {products.length === 0 ? (
        <p className="no-data">No products found. Click "Add Product" to get started.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.product_name}</td>
                <td className="desc-cell" title={product.description}>
                  {product.description || '—'}
                </td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>
                  <button className="btn edit-btn" onClick={() => onEdit(product)}>
                    Edit
                  </button>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDelete(product.id, product.product_name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}