import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// api: la url de endpoint de celulares
// del: Contiene si el formulario se ha cargado para eliminar
function CelularFORM({api, del}){
    console.log("api",api)
    console.log("del", del)

    // Son estados asociados a los campos del formulario
    const[marca, setMarca] = useState("")
    const[modelo, setModelo] = useState("")
    const[color, setColor] = useState("")
    const[precio, setPrecio] = useState("")
    const[descripcion, setDescripcion] = useState("")
    const[operadora, setOperadora] = useState("")

    // id: el parametro id recibido desde el CRUD
    const {id} = useParams()
    console.log("id", id)

    // navigate es el nombre con el cual voy a invocar a la funcion que haga la redirección
    const navigate = useNavigate()

    

    // La funcion encargada de cargar los datos del celular para los casos de editar y eliminar
    async function cargarCelular(){
        try{
            let res = await axios(api+"/"+id)// Solicitud GET con parametro ID
            let data = await res.data // Convierte el resultado a objeto 

            //console.log(data)

            // Los datos devueltos por la API se asignan a los respectivos estados
            // Para que en el formulario se carguen dichos datos
            setMarca(data.marca)
            setModelo(data.modelo)
            setColor(data.color)
            setPrecio(data.precio)
            setDescripcion(data.descripcion)
            setOperadora(data.operadora)
        }
        catch(error){
            console.log(error)

            // Verifica si el error es 404 lo que significa que el id del celular no existe
            if(error.response.status === 404){
                alert("El registro no existe")
                navigate("/celulares")
            }
            else{
                alert(error)
                console.log(error)
            }
        }
    }

    // Funcion asincrona para guardar un nuevo registro
    async function guardar(){
        try{
            // Creación del objeto celular el cual posteriormente se le enviara a la API
            let celular = {
                marca: marca,
                modelo: modelo,
                color: color,
                precio: precio,
                descripcion: descripcion,
                operadora: operadora
            }

            // Solicitud POST hacia la API
            let res = await axios.post(api, celular)
            let data = await res.data// Convierte el resultado en objeto

            // Verifica si la API respondio en status con el valor de 1
            if(data.status === 1){
                alert(data.message)// Muestra el mensaje devuelto por la API
                navigate("/celulares")// Redirecciona al componente donde se muestra la tabla de celulares
            }
        }
        catch(error){
            alert(error)
            console.log(error)
        }
    }

    // Funcion encargada de editar el celular
    async function editar(){
        try{
            let celular = {
                celularId: id,
                marca: marca,
                modelo: modelo,
                color: color,
                precio: precio,
                descripcion: descripcion,
                operadora: operadora
            }
            
            // Se realiza una solicitud a la API de tipo PUT
            let res = await axios.put(api, celular)
            let data = await res.data// Convertimos la respuesta a objeto

            // Verificamos si la APi devolvio status 1
            if(data.status === 1){
                alert(data.message)// Mostramos el mensaje de la API
                navigate("/celular")// Redireccionamos a la tabla celulares
            }
        }
        catch(error){
            // Verificamos si la api respondio que no existe
            if(error.response.status === 500){
                alert("El registro ya no existe")
                navigate("/celulares")
            }
            else{
                // Si es otro tipo de error mostramos el detalle
                alert(error)
                console.log(error)
            }
        }
    }

    // Funcion se encarga de hacer la peticion de tipo DELETe hacia la API
    async function eliminar(){
        try{
            let res = await axios.delete(api+"?id="+id)// Se solicita DELETE
            let data = await res.data// Convertimos el resultado de la API en un objeto


            // Verificamos si la API a devuelto el estado de que fue eliminado
            if(data.status === 1){
                alert(data.message)// Mostramos el mensaje devuelto por la API
                navigate("/celulares")// Redireccionamos hacia la tabla principal de celulares
            }

        }
        catch(error){
            // Verificamos si no existe el id a eliminar
            if(error.response.status === 404){
                alert("El celular ya no existe")// Mostramos mensaje de que no existe
                navigate("/celulares")// Redireccionamos hacia la tabla principal de celulares
            }
            else{
                // Si es otro tipo de error ingresa aqui
                alert(error)
                console.log(error)
            }
        }
    }

    // Esta funciones es invocada por el boton guardar, editar o eliminar
    function enviar(e){

        // Detiene la propagacion del evento submit generada por defacto en el button dado que este se encuentra dentro de un formulario
        e.preventDefault()
        e.stopPropagation()

        // Seleccionamos el formulario el cual tiene la clase needs-validation
        let form = document.querySelector(".needs-validation")

        // Verificamos si el formulario es invalido
        if (!form.checkValidity()){
            // Si es invalido agregamos el estilo de la validacion (invalid-feedback)
            form.classList.add('was-validated')
        }
        else{
            // Significa que el formulario tiene todos los campos completos
            // Por  lo cual procedemos a ejecutar la acción (guardar, editar, eliminar)
            if(id === undefined)// Si el id es undefined significa que es un nuevo registro
                guardar()// Invoca a la funcion guardar
            else if(del === undefined)// Si del es undefined significa que se desea editar
                editar()
            else{// Se desea eliminar
                let respuesta = window.confirm("Esta seguro que desea eliminar?")// Solicitamos confirmacion del usuario
                if(respuesta === true)// Verificamos la respuesta
                    eliminar()// Si la respuesta es true entonces invocamos a eliminar
            }
        }
        

    }

    useEffect(() =>{
        console.log("termino el render")

        // Este if sirve para verificar si se deben cargar los datos en el fomrulario
        if(id !== undefined){
            cargarCelular()// Invoca a la funcion cargar celular
        }
    }, [])

    return(
        <div>
            <form className="needs-validation" noValidate>

                {
                    // Se verifica que el id sea diferente de undefined
                    // Si esto es cierto significa que se va editar o eliminar el registro
                    // Por  lo cual mostrar el campo celular id
                    id !== undefined ?
                        <div className="form-group mt-3">
                            <label className="form-label">Celular ID:</label>
                            <input className="form-control" type="text" value={id} readOnly disabled />
                        </div>
                    :
                        ""
                }

                <div className="form-group mt-3">
                    <label className="form-label">Marca:</label>
                    <input type="text" value={marca} className="form-control" disabled={del === undefined ? false : true} onChange={(e) => setMarca(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <div className="form-group mt-3">
                    <label className="form-label">Modelo:</label>
                    <input className="form-control" type="text" value={modelo} disabled={del === undefined ? false : true} onChange={(e) => setModelo(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <div className="form-group mt-3">
                    <label className="form-label">Color:</label>
                    <input className="form-control" type="text" value={color} disabled={del === undefined ? false : true} onChange={(e) => setColor(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <div className="form-group mt-3">
                    <label className="form-label">Precio:</label>
                    <input className="form-control" type="text" value={precio} disabled={del === undefined ? false : true} onChange={(e) => setPrecio(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <div className="form-group mt-3">
                    <label className="form-label">Descripción:</label>
                    <input className="form-control" type="text" value={descripcion} disabled={del === undefined ? false : true} onChange={(e) => setDescripcion(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <div className="form-group mt-3">
                    <label className="form-label">Operadora:</label>
                    <input className="form-control" type="text" value={operadora} disabled={del === undefined ? false : true} onChange={(e) => setOperadora(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <button className={`btn btn-${(id === undefined ? "success" : del===undefined ? "primary" : "danger")}`} onClick={(e) => enviar(e)}><i className={id === undefined ? "fa-solid fa-floppy-disk" : del===true ? "fa-solid fa-trash" : "fa-solid fa-pen-to-square"}></i> {id === undefined ? "Guardar" : del === undefined ? "Editar" : "Eliminar"}</button>
                <button className="btn btn-warning" onClick={() => navigate("/juegos")}><i className="fa-solid fa-xmark"></i> Cancelar</button>
            </form>
        </div>
    )
}

export default CelularFORM