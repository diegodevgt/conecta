import { CContainer } from "@coreui/react";
import Event from "./Event";

const TrackEvent = (props) => {
    const { data } = props;

    return (
        <CContainer>
            <Event informacionPedido={data}></Event>
        </CContainer>
    );
}

export default TrackEvent;