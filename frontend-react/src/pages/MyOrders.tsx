import { useEffect, useState } from 'react';
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

const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders/my');
            setOrders(response.data);
        } catch (error: any) {
            console.error('Failed to fetch orders:', error);
            alert('Failed to load orders: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
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
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: 'auto' }}>
            <h2>My Orders</h2>

            {loading ? (
                <p>Loading your orders...</p>
            ) : orders.length === 0 ? (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    marginTop: '2rem'
                }}>
                    <p style={{ fontSize: '1.1rem', color: '#666' }}>You haven't placed any orders yet.</p>
                    <p style={{ color: '#999' }}>Start shopping to see your orders here!</p>
                </div>
            ) : (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div
                            key={order.id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                background: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            {/* Order Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                                paddingBottom: '1rem',
                                borderBottom: '2px solid #f0f0f0'
                            }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Order #{order.id}</h3>
                                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                        {formatDate(order.orderDate)}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        background: getStatusColor(order.status),
                                        color: 'white',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        display: 'inline-block',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {order.status}
                                    </span>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>
                                        ${order.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 style={{ marginTop: 0, marginBottom: '0.75rem', color: '#555' }}>Items:</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                                                Product
                                            </th>
                                            <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                                                Quantity
                                            </th>
                                            <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>
                                                Price
                                            </th>
                                            <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <div>
                                                        <div style={{ fontWeight: '500' }}>{item.productName}</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#999' }}>
                                                            Product ID: {item.productId}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                    <span style={{
                                                        background: '#e3f2fd',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        fontWeight: '500'
                                                    }}>
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                                    ${item.price.toFixed(2)}
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' }}>
                                                    ${item.subTotal.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
