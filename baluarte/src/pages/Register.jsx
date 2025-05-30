// Register.jsx
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function Register() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-fundo-baluarte bg-cover px-6">
      <div className="w-full max-w-xl bg-white p-10 rounded-2xl shadow-2xl border-t-8 border-red-600">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Cria a tua conta</h2>
        <p className="text-center text-gray-500 mb-6">Junta-te à família Baluarte</p>

        <form className="space-y-5">
          <div>
            <label className="block text-text-pargh text-gray-700">Nome completo</label>
            <input type="text" placeholder="Teu nome"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-red-400 outline-none" />
          </div>

          <div>
            <label className="block text-text-pargh text-gray-700">Email</label>
            <input type="email" placeholder="teuemail@dominio.com"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-red-400 outline-none" />
          </div>

          <div>
            <label className="block text-text-pargh text-gray-700">Senha</label>
            <input type="password" placeholder="********"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-red-400 outline-none" />
          </div>

          <button type="submit" className="w-full text-text-pargh bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition">Registar</button>
        </form>

        <div className="my-6 text-center text-gray-500 relative">
          <span className="px-3 bg-white z-10 relative">ou</span>
          <div className="absolute left-0 right-0 top-3 h-px bg-gray-200"></div>
        </div>

        <button className="w-full  text-text-pargh flex items-center justify-center gap-3 border py-2 rounded-md hover:bg-gray-50 transition">
          <FcGoogle className="text-xl" /> Registar com Google
        </button>

        <p className="text-center text-gray-600 mt-6">
          Já tens conta? <Link to="/auth/login" className="text-text-pargh text-red-600 hover:underline">Entra agora</Link>
        </p>
      </div>
    </section>
  );
}
