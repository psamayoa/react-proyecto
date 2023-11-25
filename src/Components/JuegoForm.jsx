import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// api: la url de endpoint de juegos
// del: Contiene si el formulario se ha cargado para eliminar
function JuegoFORM({api, del}){
    console.log("api",api)
    console.log("del", del)

    // Son estados asociados a los campos del formulario
    const[titulo, setTitulo] = useState("")
    const[descripcion, setDescripcion] = useState("")
    const[plataforma, setPlataforma] = useState("")
    const[precio, setPrecio] = useState("")
    const[categoria, setCategoria] = useState("")

    // id: el parametro id recibido desde el CRUD
    const {id} = useParams()
    console.log("id", id)

    // navigate es el nombre con el cual voy a invocar a la funcion que haga la redirección
    const navigate = useNavigate()

    

    // La funcion encargada de cargar los datos del juego para los casos de editar y eliminar
    async function cargarJuego(){
        try{
            let res = await axios(api+"/"+id)// Solicitud GET con parametro ID
            let data = await res.data // Convierte el resultado a objeto 

            //console.log(data)

            // Los datos devueltos por la API se asignan a los respectivos estados
            // Para que en el formulario se carguen dichos datos
            setTitulo(data.titulo)
            setDescripcion(data.descripcion)
            setPlataforma(data.plataforma)
            setPrecio(data.precio)
            setCategoria(data.categoria)
        }
        catch(error){
            console.log(error)

            // Verifica si el error es 404 lo que significa que el id del juego no existe
            if(error.response.status === 404){
                alert("El registro no existe")
                navigate("/juegos")
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
            // Creación del objeto juego el cual posteriormente se le enviara a la API
            let juego = {
                titulo: titulo,
                descripcion: descripcion,
                plataforma: plataforma,
                precio: precio,
                categoria: categoria
            }

            // Solicitud POST hacia la API
            let res = await axios.post(api, juego)
            let data = await res.data// Convierte el resultado en objeto

            // Verifica si la API respondio en status con el valor de 1
            if(data.status === 1){
                alert(data.message)// Muestra el mensaje devuelto por la API
                navigate("/juegos")// Redirecciona al componente donde se muestra la tabla de juegos
            }
        }
        catch(error){
            alert(error)
            console.log(error)
        }
    }

    // Funcion encargada de editar el juego
    async function editar(){
        try{
            let juego = {
                juegoId: id,
                titulo: titulo,
                descripcion: descripcion,
                plataforma: plataforma,
                precio: precio,
                categoria: categoria
            }
            
            // Se realiza una solicitud a la API de tipo PUT
            let res = await axios.put(api, juego)
            let data = await res.data// Convertimos la respuesta a objeto

            // Verificamos si la APi devolvio status 1
            if(data.status === 1){
                alert(data.message)// Mostramos el mensaje de la API
                navigate("/juegos")// Redireccionamos a la tabla juegos
            }
        }
        catch(error){
            // Verificamos si la api respondio que no existe
            if(error.response.status === 500){
                alert("El registro ya no existe")
                navigate("/juegos")
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
                navigate("/juegos")// Redireccionamos hacia la tabla principal de juegos
            }

        }
        catch(error){
            // Verificamos si no existe el id a eliminar
            if(error.response.status === 404){
                alert("El juego ya no existe")// Mostramos mensaje de que no existe
                navigate("/juegos")// Redireccionamos hacia la tabla principal de juegos
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
            cargarJuego()// Invoca a la funcion cargar juego
        }
    }, [])

    return(
        <div>
            <form className="needs-validation" noValidate>

                {
                    // Se verifica que el id sea diferente de undefined
                    // Si esto es cierto significa que se va editar o eliminar el registro
                    // Por  lo cual mostrar el campo juego id
                    id !== undefined ?
                        <div className="form-group mt-3">
                            <label className="form-label">Juego ID:</label>
                            <input className="form-control" type="text" value={id} readOnly disabled />
                        </div>
                    :
                        ""
                }

                <div className="form-group mt-3">
                    <label className="form-label">Titulo:</label>
                    <input type="text" value={titulo} className="form-control" disabled={del === undefined ? false : true} onChange={(e) => setTitulo(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <div className="form-group mt-3">
                    <label className="form-label">Descripción:</label>
                    <input className="form-control" type="text" value={descripcion} disabled={del === undefined ? false : true} onChange={(e) => setDescripcion(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <div className="form-group mt-3">
                    <label className="form-label">Plataforma:</label>
                    <input className="form-control" type="text" value={plataforma} disabled={del === undefined ? false : true} onChange={(e) => setPlataforma(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <div className="form-group mt-3">
                    <label className="form-label">Precio:</label>
                    <input className="form-control" type="text" value={precio} disabled={del === undefined ? false : true} onChange={(e) => setPrecio(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <div className="form-group mt-3">
                    <label className="form-label">Categoria:</label>
                    <input className="form-control" type="text" value={categoria} disabled={del === undefined ? false : true} onChange={(e) => setCategoria(e.target.value)} required />
                    <div className="invalid-feedback">Campo obligatorio</div>
                </div>
                <button className={`btn btn-${(id === undefined ? "success" : del===undefined ? "primary" : "danger")}`} onClick={(e) => enviar(e)}><i className={id === undefined ? "fa-solid fa-floppy-disk" : del===true ? "fa-solid fa-trash" : "fa-solid fa-pen-to-square"}></i> {id === undefined ? "Guardar" : del === undefined ? "Editar" : "Eliminar"}</button>
                <button className="btn btn-warning" onClick={() => navigate("/juegos")}><i className="fa-solid fa-xmark"></i> Cancelar</button>
            </form>
        </div>
    )
}

export default JuegoFORM