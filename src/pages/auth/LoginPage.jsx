import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { users } from '../../data/users';
import toast from 'react-hot-toast';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAppStore();
    const [email, setEmail] = useState('admin@inventorium.io');
    const [password, setPassword] = useState('password');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock login
        login(users[0]);
        toast.success('System access granted', {
            style: { background: '#111', color: '#fff', border: '1px solid #1f1f1f' }
        });
        navigate('/app');
    };

    return (
        <AuthLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-orbitron font-bold text-white mb-2">Welcome Back.</h1>
                <p className="text-text-secondary">Enter your credentials to access the system.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Work Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail size={16} />}
                    placeholder="name@company.com"
                    required
                />

                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm text-text-secondary font-medium">Password</label>
                        <Link to="/auth/forgot-password" className="text-xs text-accent-yellow hover:underline">Forgot Password?</Link>
                    </div>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={<Lock size={16} />}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div className="flex items-center mt-2">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border bg-elevated text-accent-yellow focus:ring-accent-yellow" defaultChecked />
                    <label htmlFor="remember" className="ml-2 text-sm text-text-secondary">Remember me on this device</label>
                </div>

                <Button type="submit" className="w-full mt-6 group">
                    Authenticate <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-text-secondary">
                Don't have an account? <Link to="/auth/signup" className="text-accent-yellow hover:underline font-medium">Request Access</Link>
            </div>
        </AuthLayout>
    );
};
