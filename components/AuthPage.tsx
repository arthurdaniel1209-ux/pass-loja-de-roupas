
import React, { useState, useEffect } from 'react';

interface AuthPageProps {
  onNavigate: (page: 'home') => void;
  onLoginSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');


  // Reset state when auth mode changes
  useEffect(() => {
    setEmail('');
    setEmailError('');
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
  }, [authMode]);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um e-mail válido.');
      return;
    }

    if (authMode === 'signup' && password !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    // Placeholder for auth logic
    if (authMode === 'forgot') {
        alert('Funcionalidade de recuperação de senha não implementada.');
    } else {
        onLoginSuccess();
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: 'url(https://picsum.photos/seed/authbg/1920/1080)' }}
    >
      <div 
        className="max-w-md w-full mx-auto p-8 rounded-2xl bg-black/60 backdrop-blur-lg border border-white/10 shadow-2xl
                   transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-[1.03]"
      >

        {authMode === 'forgot' ? (
            <>
                <div className="text-center mb-8">
                    <h1 className="font-logo-pass text-5xl tracking-wider text-white mb-4 cursor-pointer" onClick={() => onNavigate('home')}>
                        Pass
                    </h1>
                    <p className="text-gray-300">
                        Recupere sua senha
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Digite seu e-mail para receber o link de recuperação.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-300 block mb-2 sr-only">Email</label>
                        <input type="email" id="email" name="email" placeholder="Email" required 
                               value={email}
                               onChange={(e) => {
                                 setEmail(e.target.value);
                                 if (emailError) setEmailError('');
                               }}
                               className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400" />
                        {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
                    </div>
                    <button type="submit" className="w-full py-3 px-4 bg-white text-black font-semibold rounded-md hover:bg-gray-300 transition-colors duration-300">
                        Enviar link de recuperação
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button onClick={() => setAuthMode('login')} className="font-medium text-gray-300 hover:text-white hover:underline text-sm">
                        Voltar para o login
                    </button>
                </div>
            </>
        ) : (
            <>
                <div className="text-center mb-8">
                    <h1 className="font-logo-pass text-5xl tracking-wider text-white mb-4 cursor-pointer" onClick={() => onNavigate('home')}>
                        Pass
                    </h1>
                    <p className="text-gray-300">
                        {authMode === 'login' ? 'Faça login na sua conta' : 'Crie uma nova conta'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {authMode === 'signup' && (
                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-gray-300 block mb-2 sr-only">Nome</label>
                            <input type="text" id="name" name="name" placeholder="Nome" required className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-300 block mb-2 sr-only">Email</label>
                        <input type="email" id="email" name="email" placeholder="Email" required 
                               value={email}
                               onChange={(e) => {
                                 setEmail(e.target.value);
                                 if (emailError) setEmailError('');
                               }}
                               className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400" />
                        {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-300 block mb-2 sr-only">Senha</label>
                        <input type="password" id="password" name="password" placeholder="Senha" required 
                               value={password}
                               onChange={(e) => {
                                setPassword(e.target.value)
                                if (passwordError) setPasswordError('');
                               }}
                               className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400" />
                         {authMode === 'login' && (
                            <div className="text-right mt-2">
                                <button type="button" onClick={() => setAuthMode('forgot')} className="text-sm font-medium text-gray-300 hover:text-white hover:underline">
                                    Esqueceu a senha?
                                </button>
                            </div>
                        )}
                    </div>
                     {authMode === 'signup' && (
                        <div>
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 block mb-2 sr-only">Confirmar Senha</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmar Senha" required 
                                   value={confirmPassword}
                                   onChange={(e) => {
                                     setConfirmPassword(e.target.value)
                                     if (passwordError) setPasswordError('');
                                   }}
                                   className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400" />
                            {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
                        </div>
                    )}
                    
                    <button type="submit" className="w-full py-3 px-4 bg-white text-black font-semibold rounded-md hover:bg-gray-300 transition-colors duration-300">
                        {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-400">
                        {authMode === 'login' ? "Não tem uma conta?" : "Já tem uma conta?"}
                        <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="font-medium text-white hover:underline ml-1">
                            {authMode === 'login' ? 'Cadastre-se' : 'Entrar'}
                        </button>
                    </p>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
