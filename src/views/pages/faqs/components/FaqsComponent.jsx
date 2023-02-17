import Title from "../../components/Title";
import Recomendaciones from "./Recomendaciones";
import Coberturas from "./Coberturas";
import LimitesUrbanos from "./LimitesUrbanos";
import Preguntas from "./Preguntas";
import SeguimientoEnvio from "./SeguimientoEnvio";
import Preguntas2 from "./Preguntas2";
import Localizaciones from "./Localizaciones";
const FaqsComponent = () => {
    return (
        <>
            <Title title={"FAQS CONECTA GUATE"} />
            <Coberturas />
            <LimitesUrbanos />
            <Recomendaciones />
            <Preguntas step="1" />
            <SeguimientoEnvio />
            <Preguntas step="2" />
            <Preguntas2 step="1" />
            <Preguntas2 step="2" />
            <Localizaciones />
        </>
    )
}

export default FaqsComponent;