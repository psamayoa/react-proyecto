import React, {useState} from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import JuegoCRUD from "./JuegoCRUD";
import JuegoFORM from './JuegoForm';
import CelularCRUD from "./CelularCRUD";
import CelularFORM from "./CelularForm";

function App() {
  const[apiJuegos, setApiJuegos] = useState("https://denny2023.azurewebsites.net/api/juegos")
  const[apiCelulares, setApiCelulares] = useState("https://denny2023.azurewebsites.net/api/celulares")
  return (
    <BrowserRouter>
            <Menu />
            <Routes>                
                {/* Enrutamiento a la pagina principal del CRUD de juegos */}
                <Route path="/juegos" element={<JuegoCRUD api={apiJuegos} />} />

                {/* Enrutamiento hacia el formulario de nuevo registro de juegos*/}
                <Route path="/juegos/add" element={<JuegoFORM api={apiJuegos} />} />

                {/* Enrutamiento hacia el formulario de editar juego*/}
                <Route path="/juegos/edit/:id" element={<JuegoFORM api={apiJuegos} />} />

                {/* Enrutamiento hacia el formulario de eliminar juego */}
                <Route path="/juegos/delete/:id" element={<JuegoFORM del={true} api={apiJuegos} />} />

                {/* Enrutamiento a la pagina principal del CRUD de celulares */}
                <Route path="/celulares" element={<CelularCRUD api={apiCelulares} />} />

                {/* Enrutamiento hacia el formulario de nuevo celular*/}
                <Route path="/celulares/add" element={<CelularFORM api={apiCelulares} api2={apiJuegos} />} />

                {/* Enrutamiento hacia el formulario de editar celular */}
                <Route path="/celulares/edit/:id" element={<CelularFORM api={apiCelulares} api2={apiJuegos} />} />

                {/* Enrutamiento hacia el formulario de eliminar celular */}
                <Route path="/celulares/delete/:id" element={<CelularFORM api={apiCelulares} api2={apiJuegos} del={true} />} />
            </Routes>
            <Menu />
        </BrowserRouter>
  );
}

export default App;