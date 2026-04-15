import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
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

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

                .login-page {
                    font-family: 'Inter', sans-serif;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #ffffff;
                    position: relative;
                    overflow: hidden;
                    padding: 1rem;
                }

                .login-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 24px;
                    padding: 2.5rem;
                    width: 100%;
                    max-width: 420px;
                    position: relative;
                    z-index: 10;
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
                    animation: cardSlide 0.5s ease-out;
                }

                @keyframes cardSlide {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .login-logo-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .login-logo-icon {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #0c4a6e, #0ea5e9);
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
                    margin-bottom: 1rem;
                }

                .login-title {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #0c4a6e;
                    letter-spacing: -0.025em;
                    margin: 0;
                }

                .login-subtitle {
                    font-size: 0.875rem;
                    color: #94a3b8;
                    margin-top: 0.25rem;
                    font-weight: 400;
                }

                .login-input-group {
                    margin-bottom: 1.25rem;
                }

                .login-label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #475569;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                }

                .login-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .login-input-icon {
                    position: absolute;
                    left: 14px;
                    width: 20px;
                    height: 20px;
                    color: #94a3b8;
                    pointer-events: none;
                    transition: color 0.3s;
                }

                .login-input {
                    width: 100%;
                    padding: 0.8rem 0.85rem 0.8rem 2.75rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    color: #1e293b;
                    font-size: 0.95rem;
                    font-weight: 400;
                    transition: all 0.3s ease;
                    outline: none;
                    font-family: 'Inter', sans-serif;
                }

                .login-input::placeholder {
                    color: #cbd5e1;
                }

                .login-input:focus {
                    background: #ffffff;
                    border-color: #0ea5e9;
                    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
                }

                .login-password-toggle {
                    position: absolute;
                    right: 14px;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    transition: color 0.3s;
                }

                .login-password-toggle:hover {
                    color: #0ea5e9;
                }

                .login-options {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    margin-top: 0.25rem;
                }

                .login-remember {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    user-select: none;
                }

                .login-checkbox {
                    width: 18px;
                    height: 18px;
                    border-radius: 6px;
                    border: 1.5px solid #cbd5e1;
                    background: #f8fafc;
                    appearance: none;
                    -webkit-appearance: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }

                .login-checkbox:checked {
                    background: #0ea5e9;
                    border-color: #0ea5e9;
                }

                .login-checkbox:checked::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 12px;
                    font-weight: 700;
                }

                .login-remember-text {
                    font-size: 0.8rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .login-forgot {
                    font-size: 0.8rem;
                    color: #0ea5e9;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s;
                }

                .login-forgot:hover {
                    color: #0284c7;
                    text-decoration: underline;
                }

                .login-btn {
                    width: 100%;
                    padding: 0.85rem;
                    background: linear-gradient(135deg, #0c4a6e, #0ea5e9);
                    border: none;
                    border-radius: 14px;
                    color: white;
                    font-size: 0.95rem;
                    font-weight: 700;
                    letter-spacing: 0.025em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(14, 165, 233, 0.35);
                }

                .login-btn:active {
                    transform: translateY(0);
                }

                .login-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .login-btn:disabled:hover {
                    box-shadow: none;
                    transform: none;
                }

                .login-error {
                    color: #ef4444;
                    font-size: 0.8rem;
                    margin-top: 0.4rem;
                    font-weight: 500;
                }

                .login-status {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #16a34a;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    margin-bottom: 1.25rem;
                    text-align: center;
                }

                .login-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 2.5px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                    margin-right: 8px;
                    vertical-align: middle;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 480px) {
                    .login-card {
                        padding: 1.75rem;
                        border-radius: 20px;
                        box-shadow: none;
                        border: none;
                    }

                    .login-title {
                        font-size: 1.5rem;
                    }

                    .login-options {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.75rem;
                    }
                }
            `}</style>

            <div className="login-page">
                <div className="login-card">
                    {/* Logo & Header */}
                    <div className="login-logo-container">
                        <div className="login-logo-icon">🧺</div>
                        <h1 className="login-title">LaundriQ</h1>
                        <p className="login-subtitle">Masuk ke akun Anda</p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="login-status">{status}</div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit}>
                        {/* Email */}
                        <div className="login-input-group">
                            <label className="login-label" htmlFor="login-email">Email</label>
                            <div className="login-input-wrapper">
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="login-input"
                                    placeholder="nama@email.com"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <svg className="login-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {errors.email && <div className="login-error">{errors.email}</div>}
                        </div>

                        {/* Password */}
                        <div className="login-input-group">
                            <label className="login-label" htmlFor="login-password">Password</label>
                            <div className="login-input-wrapper">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="login-input"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <svg className="login-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <div className="login-error">{errors.password}</div>}
                        </div>

                        {/* Options Row */}
                        <div className="login-options">
                            <label className="login-remember">
                                <input
                                    type="checkbox"
                                    className="login-checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="login-remember-text">Ingat saya</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="login-btn"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <span className="login-spinner"></span>
                                    Memproses...
                                </>
                            ) : (
                                'Masuk'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
