import { CCol, CRow, CContainer } from "@coreui/react";

const Coberturas = (props) => {
    const listadoNoCoberturasCiudad = {
        'ZONA 1': ['De la 14 a la 20 Ave. entre 17 y 22 calle (ingreso a la Limonada).', 'Barrio Gerona (solo cubrimos hasta la 15 avenida y 15 Calle).'],
        'ZONA 3': ['El Gallito.', 'La Ruedita.', 'San José Buena Vista.', 'Santa Isabel.', 'Colonia Trinidad.', 'Las Calaveras.', 'El Incienso.', 'De la 9na. a la 12 calle, cubrimos hasta la 2da. Ave. de la Zona 3.', 'De la 13 a la 17 calle, cubrimos hasta la 4ta. Ave. de la zona 3.'],
        'ZONA 5': ['La Limonada.', 'Lomas del Edén.', 'Santo Domingo.', 'Ferrocarril.', 'La Chácara', 'Saravia.'],
        'ZONA 6': ['Arimany.', 'Buena Vista.', 'El Carmen.', 'Barrio San Antonio.', 'Presbiteriana.', '30 de Junio.', 'Santa Isabel I, II y III.', 'El Jocote.', 'El Quintanal.', 'Santa Faz.', 'La Reinita.', 'San Juan de Dios.', 'San Judas Tadeo.', 'Paraíso Zona 6.', 'Las Vacas.', 'Santa Marta.', 'Los Ángeles.'],
        'ZONA 7': ['Banvi I y II.', 'El Amparo I y II.', 'El Granizo I, II, y III.', 'Mario Martínez.', '4 de Febrero.', 'Sakerty I y II.', 'El Incienso.', 'Asentamiento Las Torres.', 'Buena Vista.', 'San Vicente.', 'Niño Dormido.', 'La Verbena.', 'Colonia 6 de Octubre.', 'Tecún Umán I y II.', 'Shell.', 'San Lorenzo.', 'Madre Dormida.', 'El Cerrito.', 'Kjell Laujerud.', 'Alida de España.', 'Asentamiento Sandra Colom'],
        'ZONA 12': ['El Esfuerzo.', 'Letrán.', 'El Tamarindo.', 'Anexos I II y III.', 'Loma Real.', 'Villa Lobos I y II.', 'El Búcaro.', 'Mezquital.', 'La Esperanza.', 'El Éxodo.', 'El Esfuerzo.'],
        'ZONA 13': ['La Isla.', 'La Libertad.', 'Santa Fé.', 'Plaza de Toros.', 'Colonia Forestal.'],
        'ZONA 14': ['Cantón 21.', 'La Terronera.'],
        'ZONA 17': ['Canalitos.', 'El Jaguey.', 'Los Ángeles.', 'Santa Lucia Los Ocotes.'],
        'ZONA 18': ['El Rosario.', 'El Limón.', 'Juana de Arco.', 'Paraíso I, II y III.', 'Barrio Colombia.', 'San Rafael I, II y III.', 'Colonia Holanda.', 'San Judas Tadeo.', 'Alameda I, II y III.', 'Los Pinos.', 'Santa Faz.', 'El Chato I y II.', 'Renacimiento.', 'Santa Elena II y III.'],
        'ZONA 21': ['La Arenera.', 'La Isla.', 'Nuevo Amanecer.', 'Loma Blanca.', 'Los Barberos.', 'Finca Rodríguez.'],
        'Ciudad Quetzal': ['No existe cobertura']
    };
    const listadoNoCoberturasAledanos = {
        'VILLA NUEVA': ['Alioto.', 'San Miguelito.', 'Ulises Rojas.', 'Ramírez.', 'Santa Isabel I, II y III.', 'Ciudad del Sol.', 'Mártires.', 'San Gabriel Zona 4.', 'San Luis Zona 4.', 'Marianita.', 'La Arada.', 'Las Nubes.', 'El Tabloncito.', 'Proyectos.', 'La Embaulada.'],
        'VILLA CANALES': ['El Tablón.', 'Chichimecas.'],
        'MIXCO': ['Saturno', 'Satélite.', 'Carretera Antigua de Mixco.', 'El Manzanillo.', 'Colonia La Brigada y alrededores.', 'El Aguacate.', 'Tierra Nueva I y II.', 'El Milagro.', 'Carolingia.', 'La Esperanza.', 'Sacoj.', 'Colinas de Minerva.'],
        'BOCA DEL MONTE': ['El Porvenir Zonas 1, 2 y 3.']
    }
    let elementos = [];
    Object.keys(listadoNoCoberturasCiudad).forEach(key => {
        let makeListData = [];

        makeListData.push(<h4 className="titulo_coberturas">{key}</h4>);

        listadoNoCoberturasCiudad[key].forEach(zona => {
            makeListData.push(<li className="zona_coberturas">{zona}</li>);
        });

        makeListData.push(<br />);
        elementos.push(makeListData);
    });
    let elementosAledanos = [];
    Object.keys(listadoNoCoberturasAledanos).forEach(key => {
        let makeListData = [];

        makeListData.push(<h4 className="titulo_coberturas">{key}</h4>);

        listadoNoCoberturasAledanos[key].forEach(zona => {
            makeListData.push(<li className="zona_coberturas">{zona}</li>);
        });

        makeListData.push(<br />);
        elementosAledanos.push(makeListData);
    });
    return (
        <>
            <CContainer className="coberturas-container">
                <CRow>
                    <CCol lg="12">
                        <h2 className="titulo_coberturas_principal">¿Cuáles son las áreas de NO cobertura?</h2>
                        <div className="separador-titulo" />
                    </CCol>
                    <br />
                    <CRow className="listado-coberturas-container">

                        {elementos.map(elemento => {
                            return (<CCol lg="6">{elemento}</CCol>)
                        })}
                    </CRow>
                    <br />
                    <div className="separador-titulo extra-space" />
                    <CRow className="listado-coberturas-container">

                        {elementosAledanos.map(elemento => {
                            return (<CCol lg="6">{elemento}</CCol>)
                        })}
                    </CRow>
                </CRow>
            </CContainer>
        </>
    )
}

export default Coberturas;