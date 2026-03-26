
import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

interface AuthPageProps {
  onNavigate: (page: 'home') => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Reset state when auth mode changes
  useEffect(() => {
    setEmail('');
    setName('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('');
  }, [authMode]);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      setLoading(false);
      return;
    }

    try {
      if (authMode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      } else if (authMode === 'signup') {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres.');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        onNavigate('home');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        onNavigate('home');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      switch (err.code) {
        case 'auth/user-not-found':
          setError('Usuário não encontrado.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta.');
          break;
        case 'auth/email-already-in-use':
          setError('Este e-mail já está em uso.');
          break;
        case 'auth/invalid-credential':
          setError('Credenciais inválidas.');
          break;
        default:
          setError('Ocorreu um erro ao processar sua solicitação.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onNavigate('home');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Erro ao entrar com Google.');
    } finally {
      setLoading(false);
    }
  };

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
                        <input type="email" placeholder="Email" required 
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400 text-white" />
                    </div>
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    {message && <p className="text-green-400 text-xs">{message}</p>}
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-3 px-4 bg-white text-black font-semibold rounded-md hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Enviando...' : 'Enviar link de recuperação'}
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
                            <input 
                              type="text" 
                              placeholder="Nome" 
                              required 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400 text-white" 
                            />
                        </div>
                    )}
                    <div>
                        <input type="email" placeholder="Email" required 
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400 text-white" />
                    </div>
                    <div>
                        <input type="password" placeholder="Senha" required 
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400 text-white" />
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
                            <input type="password" placeholder="Confirmar Senha" required 
                                   value={confirmPassword}
                                   onChange={(e) => setConfirmPassword(e.target.value)}
                                   className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400 text-white" />
                        </div>
                    )}
                    
                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-3 px-4 bg-white text-black font-semibold rounded-md hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Processando...' : (authMode === 'login' ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black/60 text-gray-400">Ou continue com</span>
                  </div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-transparent border border-gray-600 text-white font-semibold rounded-md hover:bg-white/10 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Google</span>
                </button>

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
