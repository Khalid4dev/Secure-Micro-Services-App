import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductSearch from '../components/ProductSearch';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const { hasRole } = useAuth();
    const isClient = hasRole('CLIENT');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
            // Initialize quantities to 1 for each product
            const initialQuantities: Record<number, number> = {};
            response.data.forEach((p: Product) => {
                initialQuantities[p.id] = 1;
            });
            setQuantities(initialQuantities);
        } catch (error) {
            console.error('Failed to load products', error);
        }
    };

    const buyProduct = async (productId: number) => {
        const quantity = quantities[productId] || 1;
        try {
            await api.post('/orders', { items: [{ productId, quantity }] });
            alert(`Order placed successfully! (${quantity} item(s))`);
        } catch (error: any) {
            alert('Failed to place order: ' + (error.response?.data?.error || error.message));
        }
    };

    const updateQuantity = (productId: number, value: number) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: value
        }));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Products</h2>

            {/* Product Search */}
            <ProductSearch />

            {/* Product Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {products.map(p => (
                    <div key={p.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                        <p><strong>Price:</strong> ${p.price.toFixed(2)}</p>
                        <p><strong>Stock:</strong> {p.stockQuantity}</p>
                        {isClient && (
                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label htmlFor={`qty-${p.id}`} style={{ fontSize: '0.9rem' }}>Quantity:</label>
                                    <input
                                        id={`qty-${p.id}`}
                                        type="number"
                                        min="1"
                                        max={p.stockQuantity}
                                        value={quantities[p.id] || 1}
                                        onChange={(e) => updateQuantity(p.id, parseInt(e.target.value) || 1)}
                                        style={{
                                            width: '60px',
                                            padding: '0.25rem',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc'
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={() => buyProduct(p.id)}
                                    style={{
                                        background: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        width: '100%'
                                    }}
                                >
                                    Buy Now
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
