// Register.jsx
import { Link } from 'react-router-dom';
import { icone } from '../../assets/Assets';
import { useCallback, useState } from 'react';
import { apiFetch } from '../../utils/api.js';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton.jsx';

export default function Register() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', password: '' });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const notifyAdmin = async ({ nome, email, telefone }) => {
    try {
      await apiFetch('/public/mensagem/send', {
        method: 'POST',
        body: {
          nome,
          email,
          telefone,
          assunto: 'Novo cadastro pendente',
          descricao: `Novo utilizador pendente: ${nome} (${email}).`,
        },
      });
    } catch (error) {
      // Silenciar falhas de notificação para não bloquear o registo
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    try {
        const response = await apiFetch('/auth/register', {
          method: 'POST',
          body: {
          nome: form.nome.trim(),
          email: form.email.trim(),
          telefone: form.telefone.trim(),
          password: form.password,
          },
        });

      if (!response.ok) {
        let message = 'Erro ao registar. Verifica os dados e tenta novamente.';
        try {
          const errorPayload = await response.json();
          if (errorPayload?.message) message = errorPayload.message;
        } catch (error) {
          // ignore JSON parse errors
        }
        setStatus({ loading: false, error: message, success: false });
        return;
      }

      setStatus({ loading: false, error: '', success: true });
      await notifyAdmin({
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim() || 'N/A',
      });
    } catch (error) {
      setStatus({ loading: false, error: 'Falha na ligação com o servidor.', success: false });
    }
  };

  const handleGoogleCredential = useCallback(
    async (credential) => {
      setStatus({ loading: true, error: '', success: false });
      try {
        const response = await apiFetch('/auth/google', {
          method: 'POST',
          body: { credential },
        });

        if (!response.ok) {
          let message = 'Não foi possível registar com Google.';
          try {
            const errorPayload = await response.json();
            if (errorPayload?.message) message = errorPayload.message;
          } catch (error) {
            // ignore JSON parse errors
          }
          if (message.toLowerCase().includes('aguarde') || message.toLowerCase().includes('pendente')) {
            setStatus({ loading: false, error: '', success: true });
            return;
          }
          setStatus({ loading: false, error: message, success: false });
          return;
        }

        setStatus({
          loading: false,
          error: '',
          success: true,
        });
      } catch (error) {
        setStatus({ loading: false, error: 'Falha na ligação com o servidor.', success: false });
      }
    },
    []
  );

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-fundo-baluarte bg-cover px-4 text-base">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-red-600 space-y-4 text-text-primary">
       <figure className='justify-center flex'>
         <img src={icone} alt="" className='w-12'/>
       </figure>
        <h2 className="text-2xl font-bold text-gray-800 text-center">Cria a tua conta</h2>
        <p className="text-center text-gray-500 text-sm">Junta-te à família Baluarte</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome completo</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Teu nome"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-red-400 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="teuemail@dominio.com"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-red-400 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="Ex: 923 000 000"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-red-400 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-red-400 outline-none" />
          </div>

          {status.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {status.error}
            </p>
          )}

          {status.success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              Conta criada com sucesso. Aguarde a aprovação do administrador.
            </p>
          )}

          <button
            type="submit"
            disabled={status.loading || status.success}
            className="w-full text-sm bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-60"
          >
            {status.loading ? 'Aguarde...' : 'Registar'}
          </button>
        </form>

        <div className="my-6 text-center text-gray-500 relative">
          <span className="px-3 text-xs bg-white z-10 relative">ou</span>
          <div className="absolute left-0 right-0 top-3 h-px bg-gray-200"></div>
        </div>

        <GoogleAuthButton onCredential={handleGoogleCredential} text="signup_with" />

        <p className="text-center text-gray-600 mt-6 text-sm">
          Já tens conta? <Link to="/auth/login" className="text-red-600 hover:underline">Entra agora</Link>
        </p>
      </div>
    </section>
  );
}
