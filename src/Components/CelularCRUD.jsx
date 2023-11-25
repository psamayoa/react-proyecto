import React, {useState, useEffect} from "react";
import axios from "axios";
import Tabla from "./Tabla";

// api es la url de la Endpoint de celulares
function CelularCRUD({api}){

    // El estado donde vamos a alojar los datos de todos los celulares
    const[celulares, setCelulares] = useState()
    
    // Esta funcion es la encargada de hacer la solicitud GET a la API sobre los celulares
    async function cargarCelular(){
        try{
            let res = await axios(api)// Solicitud de tipo GET hacia celulares
            let data = await res.data// Convertimos el resultado en un array de objetos de tipo celular

            //console.log(data)
            setCelulares(data)// El listado de los celulares se envia al estado llamado celulares
        }
        catch(error){
            alert(error)
            console.log(error)
        }
    }

    // Solo se ejecuta una vez cuando el componente es montado
    useEffect(() =>{
        cargarCelular()// Invoca la solicitud del metodo que devuelve los celulares
    }, [])
    

    return(
        <div>
            <h1>Celulares</h1>
            {
                celulares === undefined ?
                    <div>
                        <h3>Cargando...</h3>
                    </div>
                :
                <Tabla controlador={"celulares"} list={celulares} cols={["Celular ID", "Marca", "Modelo", "Color", "Precio","Descripción", "Operadora"]} />
            }
            
        </div>
    )
}

export default CelularCRUD