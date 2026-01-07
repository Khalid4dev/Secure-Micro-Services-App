import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import keycloak from '../keycloak';

interface AuthContextType {
    authenticated: boolean;
    token: string | undefined;
    roles: string[];
    username: string | undefined;
    login: () => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
    initialized: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [roles, setRoles] = useState<string[]>([]);
    const [username, setUsername] = useState<string | undefined>(undefined);

    const isRun = React.useRef(false);

    useEffect(() => {
        if (isRun.current) return;
        isRun.current = true;

        keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then((auth) => {
            setAuthenticated(auth);
            setToken(keycloak.token);
            setRoles(keycloak.realmAccess?.roles || []);
            setUsername(keycloak.tokenParsed?.preferred_username);
            setInitialized(true);
        }).catch((err) => {
            console.error('Authentication Failed', err);
            setInitialized(true);
        });
    }, []);

    const login = () => keycloak.login();
    const logout = () => keycloak.logout();
    const hasRole = (role: string) => roles.includes(role);

    if (!initialized) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading Authentication...</div>;
    }

    return (
        <AuthContext.Provider value={{ authenticated, token, roles, username, login, logout, hasRole, initialized }}>
            {children}
        </AuthContext.Provider>
    );
};
