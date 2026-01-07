import { useState, useEffect, type FormEvent } from 'react';
import api from '../services/api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
}

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0
    });

    // Fetch all products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error: any) {
            console.error('Failed to fetch products:', error);
            alert('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Create new product
    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            alert('Product created successfully!');
            setFormData({ name: '', description: '', price: 0, stockQuantity: 0 });
            fetchProducts();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || error.response?.data?.message || error.message;
            alert(`Failed to create product: ${msg}`);
        }
    };

    // Update existing product
    const handleUpdate = async (id: number) => {
        try {
            await api.put(`/products/${id}`, formData);
            alert('Product updated successfully!');
            setEditingId(null);
            setFormData({ name: '', description: '', price: 0, stockQuantity: 0 });
            fetchProducts();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || error.response?.data?.message || error.message;
            alert(`Failed to update product: ${msg}`);
        }
    };

    // Delete product
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/products/${id}`);
            alert('Product deleted successfully!');
            fetchProducts();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || error.response?.data?.message || error.message;
            alert(`Failed to delete product: ${msg}`);
        }
    };

    // Start editing a product
    const startEdit = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity
        });
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', price: 0, stockQuantity: 0 });
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: 'auto' }}>
            <h2>Manage Products</h2>

            {/* Create/Edit Form */}
            <div style={{
                background: '#f5f5f5',
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem'
            }}>
                <h3>{editingId ? 'Edit Product' : 'Create New Product'}</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        editingId ? handleUpdate(editingId) : handleCreate(e);
                    }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                >
                    <input
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        placeholder="Description"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        step="0.01"
                        min="0"
                        required
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="number"
                        placeholder="Stock Quantity"
                        value={formData.stockQuantity}
                        onChange={e => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                        min="0"
                        required
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 2rem',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {editingId ? 'Update Product' : 'Create Product'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Products Table */}
            <div>
                <h3>All Products</h3>
                {loading ? (
                    <p>Loading products...</p>
                ) : products.length === 0 ? (
                    <p>No products found. Create your first product above!</p>
                ) : (
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        background: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Description</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Price</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Stock</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: '1rem' }}>{product.id}</td>
                                    <td style={{ padding: '1rem' }}>{product.name}</td>
                                    <td style={{ padding: '1rem' }}>{product.description}</td>
                                    <td style={{ padding: '1rem' }}>${product.price.toFixed(2)}</td>
                                    <td style={{ padding: '1rem' }}>{product.stockQuantity}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => startEdit(product)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginRight: '0.5rem'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
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
        </div>
    );
};

export default AdminProducts;
