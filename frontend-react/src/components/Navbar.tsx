
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { username, logout, hasRole } = useAuth();
    const isAdmin = hasRole('ADMIN');
    const isClient = hasRole('CLIENT'); // Or anyone authenticated

    return (
        <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold' }}>MicroShop</div>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>

            {isAdmin && <Link to="/admin/products" style={{ color: '#fff', textDecoration: 'none' }}>Manage Products</Link>}
            {isAdmin && <Link to="/admin/orders" style={{ color: '#fff', textDecoration: 'none' }}>All Orders</Link>}
            {isClient && <Link to="/my-orders" style={{ color: '#fff', textDecoration: 'none' }}>My Orders</Link>}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                <span>Welcome, {username}</span>
                <button onClick={logout} style={{ background: '#f44336', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
