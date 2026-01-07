import { useState } from 'react';
import api from '../services/api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
}

interface ProductSearchProps {
    onProductFound?: (product: Product) => void;
}

const ProductSearch = ({ onProductFound }: ProductSearchProps) => {
    const [productId, setProductId] = useState('');
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!productId || isNaN(Number(productId))) {
            setError('Please enter a valid product ID');
            return;
        }

        setLoading(true);
        setError('');
        setProduct(null);

        try {
            const response = await api.get(`/products/${productId}`);
            setProduct(response.data);
            if (onProductFound) {
                onProductFound(response.data);
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('Product not found');
            } else {
                setError('Failed to search product: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div style={{
            background: '#f5f5f5',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem'
        }}>
            <h3>Search Product by ID</h3>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <input
                    type="number"
                    placeholder="Enter Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                    }}
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    style={{
                        padding: '0.5rem 2rem',
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: '#ffebee',
                    color: '#c62828',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}

            {product && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '4px',
                    border: '2px solid #4CAF50'
                }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#4CAF50' }}>Product Found!</h4>
                    <p><strong>ID:</strong> {product.id}</p>
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                    <p><strong>Stock:</strong> {product.stockQuantity}</p>
                </div>
            )}
        </div>
    );
};

export default ProductSearch;
