import Home from './pages/Home/Home.tsx'
import Especies from './pages/Especies/Especies.tsx'
import EspecieDetalhe from './pages/Especies/EspecieDetalhe.tsx'
import Sobre from './pages/Sobre/Sobre.tsx'
import Perfil from './pages/Perfil/Perfil.tsx'
import Login from './pages/Login/Login.tsx'
import Denuncia from './pages/Denuncia/Denuncia.tsx'
import Cadastro from './pages/Cadastro/Cadastro.tsx'
import Admin from './pages/Admin/Admin.tsx'
import Pesquisador from './pages/Pesquisador/Pesquisador.tsx'
import Ong from './pages/ONG/Ong.tsx'
import PagOng from './pages/PagOng/PagOng.tsx'
import CadastroPesquisador from './pages/CadastroPesquisador/CadastroPesquisador.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NavBar } from './components/NavBar.tsx'
import { Footer } from './components/Footer.tsx'


export function App() {
  return (
    <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/especies" element={<Especies />} />
          <Route path="/especies/:id" element={<EspecieDetalhe />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/denuncia" element={<Denuncia />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/Pesquisador" element={<Pesquisador />} />
          <Route path="/ONG" element={<Ong />} />
          <Route path="/PagOng/:id" element={<PagOng />} />
          <Route path="/CadastroPesquisador" element={<CadastroPesquisador />} />
        </Routes>
        <Footer/>
    </BrowserRouter>
  );
}

