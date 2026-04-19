import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { WashingMachine, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f1f5f9',
                fontFamily: "'Inter', sans-serif",
                padding: '1rem',
            }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '400px',
                    border: '1px solid #e2e8f0',
                }}>
                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '52px',
                            height: '52px',
                            background: '#0284c7',
                            borderRadius: '10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.75rem',
                        }}>
                            <WashingMachine size={26} color="white" />
                        </div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>LaundriQ</h1>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>Masuk ke akun Anda</p>
                    </div>

                    {status && (
                        <div style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#16a34a',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            marginBottom: '1.25rem',
                            textAlign: 'center',
                        }}>{status}</div>
                    )}

                    <form onSubmit={submit}>
                        {/* Email */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={data.email}
                                    placeholder="nama@email.com"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem 0.75rem 0.7rem 2.5rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        background: '#f8fafc',
                                        color: '#1e293b',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#0284c7'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; }}
                                />
                            </div>
                            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem 2.5rem 0.7rem 2.5rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        background: '#f8fafc',
                                        color: '#1e293b',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = '#0284c7'; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        padding: '2px',
                                        display: 'flex',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: '#0284c7',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                opacity: processing ? 0.6 : 1,
                            }}
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', marginTop: '1.5rem' }}>
                        Hanya untuk staf yang berwenang.
                    </p>
                </div>
            </div>
        </>
    );
}
