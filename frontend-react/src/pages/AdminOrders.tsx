import { useState, useEffect } from 'react';
import api from '../services/api';

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    subTotal: number;
}

interface Order {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    userId: string;
    items: OrderItem[];
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error: any) {
            console.error('Failed to fetch orders:', error);
            alert('Failed to load orders: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const toggleOrderExpansion = (orderId: number) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return '#FFA726';
            case 'COMPLETED': return '#66BB6A';
            case 'CANCELLED': return '#EF5350';
            default: return '#78909C';
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: 'auto' }}>
            <h2>All Orders (Admin View)</h2>

            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div style={{ marginTop: '1.5rem' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        background: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Order ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>User ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Total</th>
                                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Items</th>
                                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <>
                                    <tr key={order.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                        <td style={{ padding: '1rem' }}>#{order.id}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#666' }}>{order.userId.substring(0, 20)}...</td>
                                        <td style={{ padding: '1rem' }}>{formatDate(order.orderDate)}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                background: getStatusColor(order.status),
                                                color: 'white',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                                            ${order.totalAmount.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            {order.items.length} item(s)
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => toggleOrderExpansion(order.id)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#2196F3',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {expandedOrders.has(order.id) ? 'Hide' : 'Show'} Details
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedOrders.has(order.id) && (
                                        <tr key={`${order.id}-details`}>
                                            <td colSpan={7} style={{ padding: '1rem', background: '#f8f9fa' }}>
                                                <h4 style={{ marginTop: 0 }}>Order Items:</h4>
                                                <table style={{ width: '100%', marginTop: '0.5rem' }}>
                                                    <thead>
                                                        <tr style={{ background: '#e9ecef' }}>
                                                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Product ID</th>
                                                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Product Name</th>
                                                            <th style={{ padding: '0.5rem', textAlign: 'center' }}>Quantity</th>
                                                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Price</th>
                                                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.items.map((item, idx) => (
                                                            <tr key={idx} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                                <td style={{ padding: '0.5rem' }}>{item.productId}</td>
                                                                <td style={{ padding: '0.5rem' }}>{item.productName}</td>
                                                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                                                                <td style={{ padding: '0.5rem', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                                                                <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 'bold' }}>
                                                                    ${item.subTotal.toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
