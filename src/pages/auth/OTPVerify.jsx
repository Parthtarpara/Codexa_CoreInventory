import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const OTPVerify = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const [countdown, setCountdown] = useState(45);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        setIsError(false);

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = otp.join('');

        if (code.length !== 6) {
            setIsError(true);
            return;
        }

        if (code === '123456') { // Mock validation
            toast.success('Identity verified successfully.', {
                icon: <CheckCircle2 className="text-success" />,
                style: { background: '#111', color: '#fff', border: '1px solid #1f1f1f' }
            });
            navigate('/auth/login');
        } else {
            setIsError(true);
            toast.error('Invalid verification code.', {
                style: { background: '#111', color: '#fff', border: '1px solid #1f1f1f' }
            });
        }
    };

    return (
        <AuthLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-orbitron font-bold text-white mb-2">Verify Identity.</h1>
                <p className="text-text-secondary">We sent a 6-digit code to your email. Enter it below to confirm access.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                    className="flex justify-between gap-2"
                    animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`w-12 h-14 text-center text-xl font-orbitron font-bold bg-elevated border rounded-md text-white 
                focus:outline-none focus:shadow-[0_0_10px_rgba(245,196,0,0.2)] transition-all
                ${isError ? 'border-danger text-danger focus:border-danger' : 'border-border focus:border-accent-yellow'}
              `}
                        />
                    ))}
                </motion.div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">
                        {countdown > 0 ? `Resend code in 0:${countdown.toString().padStart(2, '0')}` : 'Code expired.'}
                    </span>
                    <button
                        type="button"
                        disabled={countdown > 0}
                        onClick={() => setCountdown(45)}
                        className={`font-medium ${countdown > 0 ? 'text-text-secondary opacity-50 cursor-not-allowed' : 'text-accent-yellow hover:underline'}`}
                    >
                        Resend
                    </button>
                </div>

                <Button type="submit" className="w-full">
                    Verify & Continue
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
