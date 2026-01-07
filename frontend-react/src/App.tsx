import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import MyOrders from './pages/MyOrders';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AccessDenied from './pages/AccessDenied';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/access-denied" element={<AccessDenied />} />

                    <Route element={<ProtectedRoute role="CLIENT" />}>
                        <Route path="/my-orders" element={<MyOrders />} />
                    </Route>

                    <Route element={<ProtectedRoute role="ADMIN" />}>
                        <Route path="/admin/products" element={<AdminProducts />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
