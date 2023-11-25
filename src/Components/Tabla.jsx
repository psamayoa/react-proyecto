import React from "react";
import { Link } from "react-router-dom";

// cols son los encabezados de cada columna de la tabla
// list Son el listado devuelto por la api y contiene los valores de cada fila
// controlador es el nombre que se utilizara en las urls de los botones Link
function Tabla({cols, list, controlador}){
    console.log("cols", cols)
    console.log("list", list)
    console.log("controlador", controlador)

    return(
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>
                            {/* Boton de nuevo registro ADD*/}
                            <Link className="btn btn-success" to={`/${controlador}/add`}><i className="fa-solid fa-file"></i> Nuevo</Link>
                        </th>
                        {
                            // Recorre cada posicion del array cols que es el que contiene los encabezados de las columnas
                            cols.map((value, index) => {
                                return <th key={index}>{value}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                        {
                            // El que recorre cada fila devuelta por la API, que es lo recibido en la prop list
                            list.map((item, index) =>{
                                return <tr key={index}>
                                    <td>{/*Crea la celda de los botones de editar y eliminar*/}
                                        <Link to={`/${controlador}/edit/${Object.values(item)[0]}`} className="btn btn-primary"><i className="fa-solid fa-pen-to-square"></i> Editar</Link>
                                        <Link  to={`/${controlador}/delete/${Object.values(item)[0]}`} className="btn btn-danger"><i className="fa-solid fa-trash"></i> Eliminar</Link>
                                    </td>
                                    {
                                        // Genera cada celda de la fila que contiene los datos
                                        // Object values convierte el objeto a array
                                        Object.values(item).map((value, index2) =>{
                                            return <td key={index2}>{value}</td>
                                        })
                                    }
                                </tr>
                            })
                        }
                </tbody>
                <tfoot>
                        <tr>
                            <td></td>
                        {
                            cols.map((value, index) => {
                                return <th key={index}>{value}</th>
                            })
                        }
                        </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default Tabla