import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, ArrowRight } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import toast from 'react-hot-toast';

export const SignupPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Registration request submitted. Awaiting approval.', {
            style: { background: '#111', color: '#fff', border: '1px solid #1f1f1f' }
        });
        navigate('/auth/login');
    };

    return (
        <AuthLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-orbitron font-bold text-white mb-2">Request Access.</h1>
                <p className="text-text-secondary">Create a new operator or manager profile.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        leftIcon={<User size={16} />}
                        required
                    />
                    <Input
                        label="Last Name"
                        leftIcon={<User size={16} />}
                        required
                    />
                </div>

                <Input
                    label="Work Email"
                    type="email"
                    leftIcon={<Mail size={16} />}
                    placeholder="name@company.com"
                    required
                />

                <Select
                    label="Requested Role"
                    options={[
                        { value: 'operator', label: 'Warehouse Operator' },
                        { value: 'manager', label: 'Facility Manager' },
                        { value: 'admin', label: 'System Administrator' }
                    ]}
                />

                <Input
                    label="Password"
                    type="password"
                    leftIcon={<Lock size={16} />}
                    placeholder="••••••••"
                    required
                />

                <div className="flex items-start mt-4">
                    <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-border bg-elevated text-accent-yellow focus:ring-accent-yellow" required />
                    <label htmlFor="terms" className="ml-2 text-sm text-text-secondary leading-tight">
                        I agree to the <a href="#" className="text-accent-yellow hover:underline">Terms of Service</a> and <a href="#" className="text-accent-yellow hover:underline">Privacy Policy</a>
                    </label>
                </div>

                <Button type="submit" className="w-full mt-6 group">
                    Submit Request <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-text-secondary">
                Already have access? <Link to="/auth/login" className="text-accent-yellow hover:underline font-medium">Back to Login</Link>
            </div>
        </AuthLayout>
    );
};
