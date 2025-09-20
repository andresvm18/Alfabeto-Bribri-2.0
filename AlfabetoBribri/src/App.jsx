import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Shared/Components/Header"
import Home from "./Shared/Screens/Home";
import Alphabet from "./Alphabet/Screens/Alphabet"
import Character from "./Alphabet/Screens/Character";
import Game from "./Game/Screens/GameHome";
import GameMode from "./Game/Screens/Game";
import Resource from "./Shared/Screens/Resource";
import AboutUs from "./Shared/Screens/AboutUs";
import Credits from "./Shared/Screens/Credits";
import Footer from "./Shared/Components/Footer";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./Shared/Components/ScrollToTop";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alfabeto" element={<Alphabet />} />
          <Route path="/caracter/:letra" element={<Character />} />
          <Route path="/aprende" element={<Game />} />
          <Route path="/juego/:gameMode" element={<GameMode />} />
          <Route path="/recurso" element={<Resource />} />
          <Route path="/creditos" element={<Credits />} />
          <Route path="/tc-625" element={<AboutUs />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
