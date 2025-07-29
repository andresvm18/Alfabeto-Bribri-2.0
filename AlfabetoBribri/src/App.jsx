import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Shared/Components/Header"
import Home from "./Shared/Screens/Home";
import Alphabet from "./Alphabet/Screens/Alphabet"
import Character from "./Alphabet/Screens/Character";
import AFIEquivalencies from "./Alphabet/Screens/AFIEquivalencies";
import History from "./Shared/Screens/History";
import Footer from "./Shared/Components/Footer";


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alfabeto" element={<Alphabet />} />
          <Route path="/caracter/:letra" element={<Character />} />
          <Route path="/equivalencias-afi" element={<AFIEquivalencies />} />
          <Route path="/historia" element={<History />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
