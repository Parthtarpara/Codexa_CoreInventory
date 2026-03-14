import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            navigate('/auth/verify');
        }
    };

    return (
        <AuthLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-orbitron font-bold text-white mb-2">Reset Password.</h1>
                <p className="text-text-secondary">Enter your email and we'll send you a 6-digit verification code to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Work Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail size={16} />}
                    placeholder="name@company.com"
                    required
                />

                <Button type="submit" className="w-full group">
                    Send Reset Code <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
            </form>

            <div className="mt-8">
                <Link to="/auth/login" className="inline-flex items-center text-sm text-text-secondary hover:text-white transition-colors">
                    <ArrowLeft size={14} className="mr-2" /> Back to Login
                </Link>
            </div>
        </AuthLayout>
    );
};
