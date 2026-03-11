// Login.jsx
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { icone } from '../assets/Assets';

export default function Login() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-fundo-baluarte bg-cover px-4 text-base">
      <div className="w-full max-w-md  bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-red-600 space-y-4 text-text-primary">
           <figure className='justify-center flex'>
         <img src={icone} alt="" className='w-12'/>
       </figure>
        <h2 className="text-2xl font-bold text-gray-800 text-center">Bem-vindo de volta</h2>
        <p className="text-center text-gray-500 text-sm">Entre com sua conta da Igreja Baluarte</p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" placeholder="teuemail@dominio.com"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-red-400 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" placeholder="********"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-red-400 outline-none" />
          </div>

          <div className="flex justify-between text-xs text-gray-600">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" className="accent-red-600 text-text-pargh" /> Manter conectado
            </label>
            <Link to="#" className="text-red-600 hover:underline text-xs">Esqueceu a senha?</Link>
          </div>

          <button type="submit" className="w-full text-sm bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition">Entrar</button>
        </form>

        <div className="my-6 text-center text-gray-500 relative">
          <span className="px-3 text-xs text-text-pargh bg-white z-10 relative">ou</span>
          <div className="absolute left-0 right-0 top-3 h-px bg-gray-200"></div>
        </div>

        <button className="w-full flex items-center text-sm justify-center gap-3 border py-2 rounded-md hover:bg-gray-50 transition">
          <FcGoogle className="text-xl" /> Entrar com Google
        </button>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Ainda não tens conta? <Link to="/auth/register" className="text-red-600 hover:underline">Regista-te</Link>
        </p>
      </div>
    </section>
  );
}
