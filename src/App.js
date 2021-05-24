import React, {useState, useEffect} from 'react';
import {Formulario, Label, ContenedorTerminos, ContenedorBotonCentrado, Boton, MensajeExito, MensajeError} from './elementos/Formularios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Input from './componentes/Input';
import axios from 'axios';
import './estilos.css'



const App = () => {
//Variables para control de estados locales//
	const [ciudades, setCiudades] = useState([]);
	const [ciudad, cambiarCiudad] = useState({campo: '', valido: null});
	const [zip, cambiarZip] = useState({campo: '', valido: null});
	const [formularioValido, cambiarFormularioValido] = useState(null);
	const [confirmZip, setConfirm] = useState("");
	const [city, setCity] = useState("");
	const [zipcod, setzipCod] = useState("");

	
//Da formato y rango de caracteres a las entradas de input//
	const expresiones = {
		nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
		telefono: /^\d{6}$/ // 7 a 14 numeros.
	}
//Valida contenido de formulario//
	const onSubmit = (e) => {
		e.preventDefault();
		if(
			ciudad.valido === 'true' &&
			zip.valido === 'true' 	
		){
			cambiarFormularioValido(true);
			cambiarCiudad({campo: '', valido: null});
			cambiarZip({campo: '', valido: null});
		} else {
			cambiarFormularioValido(false);
		}
	}
//Conecta con la API provincias y extrae los datos//	
	useEffect(() => {
 
		axios.get("http://localhost:3000/provincias")
		.then(response => { 
			setCiudades(response.data)
			console.log(ciudades)
		})
	   
		  .catch((error) => console.log(error));
	}, [ciudad.campo])
	
//Valida las entradas ingresadas en los input, utilizando los datos importados de la API//
	function valideZip() {
		setCity(ciudad.campo);
		setzipCod(zip.campo.trim())
		var reformattedZipCode = zip.campo.trim()
		var reformattedCiudad= ciudad.campo.trim().toLowerCase()
		const city = ciudades.find(item => item.nombre == reformattedCiudad)
		if (city != null){
			const zipcode = city.Zip.find(zipc => zipc == reformattedZipCode)
			if (city.nombre == reformattedCiudad && zipcode == reformattedZipCode){
				setConfirm("correcto")
				console.log(city.nombre)
				console.log("Validacion exitosa, datos correctos")
			}else{
				setConfirm("incorrectoE")
				console.log(city.nombre)
				console.log("Validacion exitosa, datos no corresponden entre si")
			}
		}else{
			setConfirm("noEC")
			console.log(city)
			console.log("La ciudad o el codigo ingresados no pertenecen a ecuador")
		}
	}

	return (
		<main>
			<Formulario action="" onSubmit={onSubmit}>
			
				<Input
					estado={ciudad}
					cambiarEstado={cambiarCiudad}
					tipo="text"
					label="Ciudad"
					placeholder="Loja"
					name="usuario"
					leyendaError="La ciudad solo puede contener letras y espacios"
					expresionRegular={expresiones.nombre}
				/>
					
				<Input
					estado={zip}
					cambiarEstado={cambiarZip}
					tipo="text"
					label="Codigo Postal"
					placeholder="ZIP"
					name="telefono"
					leyendaError="El codigo postal solo puede tener numeros y una longitud maxima de 6 digitos"
					expresionRegular={expresiones.telefono}
				/>

				{formularioValido === false&& <MensajeError>
					<p>
						<FontAwesomeIcon icon={faExclamationTriangle}/>
						<b>Error:</b> Por favor rellena el formulario correctamente.
					</p>
				</MensajeError>}

				<ContenedorBotonCentrado>
					<Boton type="submit" onClick={()=>valideZip()}>Enviar</Boton>
						{confirmZip == "correcto"&& <MensajeExito>El codigo postal: {zipcod}, es correcto para la ciudad de: {city}</MensajeExito>}
						{confirmZip =="incorrectoE"&& <MensajeError>El codigo postal:{zipcod}, no pertenece a la ciudad de: {city} </MensajeError>}
						{confirmZip == "noEC"&& <MensajeError>El codigo postal:{zip.campo} o la ciudad: {city}, no pertenece a Ecuador </MensajeError>}
				</ContenedorBotonCentrado>

			</Formulario>
			
	  
	
  
 
		</main>
	);
}
 
export default App;

