import { useEffect, useState } from 'react'
import { getProducts, deleteProduct, errorMessage } from '../api'

export default function ProductList({ onEdit, onMessage }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      setProducts(await getProducts())
    } catch (err) {
      onMessage('error', errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.product_name}"?`)) return
    try {
      await deleteProduct(p.id)
      onMessage('success', 'Product deleted.')
      load()
    } catch (err) {
      onMessage('error', errorMessage(err))
    }
  }

  if (loading) return <p>Loading products...</p>

  return (
    <div className="card">
      <h2>Product List</h2>
      {products.length === 0 ? (
        <p>No products yet. Click "Add Product" to create one.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Description</th>
                <th>Price</th><th>Qty</th><th>Created</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.product_name}</td>
                  <td>{p.description}</td>
                  <td>{Number(p.price).toFixed(2)}</td>
                  <td>{p.quantity}</td>
                  <td>{p.created_at}</td>
                  <td className="actions">
                    <button className="btn small" onClick={() => onEdit(p)}>Edit</button>
                    <button className="btn small danger" onClick={() => handleDelete(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}