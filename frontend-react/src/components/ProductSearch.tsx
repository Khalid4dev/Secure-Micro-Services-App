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
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setError('Please enter a product name');
            return;
        }

        setLoading(true);
        setError('');
        setProducts([]);

        try {
            const response = await api.get(`/products/search?query=${encodeURIComponent(searchTerm)}`);
            setProducts(response.data);
            if (response.data.length === 0) {
                setError('No products found with that name');
            }
        } catch (err: any) {
            setError('Failed to search product: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSelectProduct = (product: Product) => {
        if (onProductFound) {
            onProductFound(product);
        }
        // Optional: clear search after selection
        // setSearchTerm('');
        // setProducts([]);
    };

    return (
        <div style={{
            background: '#f5f5f5',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem'
        }}>
            <h3>Search Product by Name</h3>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <input
                    type="text"
                    placeholder="Enter Product Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

            {products.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Results ({products.length}):</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {products.map(product => (
                            <div key={product.id} style={{
                                padding: '1rem',
                                background: 'white',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                        ${product.price ? product.price.toFixed(2) : 'N/A'} - Stock: {product.stockQuantity}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{product.description}</div>
                                </div>
                                <button
                                    onClick={() => handleSelectProduct(product)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Select
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSearch;
