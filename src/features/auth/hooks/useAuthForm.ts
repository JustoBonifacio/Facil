
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { UserRole } from '../../../shared/types';

export const useAuthForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, actions, isLoading, error: contextError } = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
    const [error, setError] = useState<string | null>(null);

    // Extra Owner Fields
    const [phone, setPhone] = useState('');
    const [nif, setNif] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    useEffect(() => {
        if (contextError) {
            setError(contextError);
        }
    }, [contextError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (isLogin) {
                await actions.login(email, password);
                navigate(from, { replace: true });
            } else {
                await actions.register(name, email, password, role, {
                    phone, nif, companyName, address
                });
                setIsLogin(true);
                setError('Registo concluído! Agora você pode fazer o login.');
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
        }
    };

    return {
        isLogin, setIsLogin,
        name, setName,
        email, setEmail,
        password, setPassword,
        role, setRole,
        error, setError,
        phone, setPhone,
        nif, setNif,
        companyName, setCompanyName,
        address, setAddress,
        handleSubmit,
        isLoading
    };
};
