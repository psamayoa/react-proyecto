import React, {useState, useEffect} from "react";
import axios from "axios";
import Tabla from "./Tabla";

// api es la url de la Endpoint de juegos
function JuegoCRUD({api}){

    // El estado donde vamos a alojar los datos de todos los juegos
    const[juegos, setJuegos] = useState()
    
    // Esta funcion es la encargada de hacer la solicitud GET a la API sobre los juegos
    async function cargarJuego(){
        try{
            let res = await axios(api)// Solicitud de tipo GET hacia juegos
            let data = await res.data// Convertimos el resultado en un array de objetos de tipo juego

            //console.log(data)
            setJuegos(data)// El listado de los juegos se envia al estado llamado juegos
        }
        catch(error){
            alert(error)
            console.log(error)
        }
    }

    // Solo se ejecuta una vez cuando el componente es montado
    useEffect(() =>{
        cargarJuego()// Invoca la solicitud del metodo que devuelve los juegos
    }, [])
    

    return(
        <div>
            <h1>Juegos</h1>
            {
                juegos === undefined ?
                    <div>
                        <h3>Cargando...</h3>
                    </div>
                :
                <Tabla controlador={"juegos"} list={juegos} cols={["Juego ID", "Titulo", "Descripcion", "Plataforma","Precio", "Categoria"]} />
            }
            
        </div>
    )
}

export default JuegoCRUD