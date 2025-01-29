// Importa los módulos necesarios
import React, { useRef, useEffect } from 'react';
import {
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton
} from '@coreui/react';
import FileUploadWithPreview from './FileUploadWithPreview'; // Ajusta la ruta según la ubicación de tu componente

const PedidoUploadModal = ({ pedidoId, soloMosrtrar = false, showModal, toggleModal }) => {
    const fileUploadRef = useRef(null);

    useEffect(() => {
        handleExternalList();
    }, [pedidoId]);

    const handleExternalList = () => {
        if (fileUploadRef.current && fileUploadRef.current.handleSubmit) {
            fileUploadRef.current.handleList(pedidoId);
        }
    };

    const handleExternalSubmit = () => {
        if (fileUploadRef.current && fileUploadRef.current.handleSubmit) {
            const uploadedFiles = fileUploadRef.current.handleSubmit(pedidoId);
            // Aquí puedes manejar los archivos subidos
            console.log('Archivos subidos:', uploadedFiles);
            // Puedes hacer llamadas a API u otras operaciones con uploadedFiles y idPedido aquí
        } else {
            console.error('Error: fileUploadRef or handleSubmit function not defined.');
        }
    };

    return (
        <CModal show={showModal} onClose={toggleModal}>
            <CModalHeader closeButton>Subir Archivos para el Pedido #{pedidoId}</CModalHeader>
            <CModalBody>
                <FileUploadWithPreview ref={fileUploadRef} soloMosrtrar={soloMosrtrar} />
            </CModalBody>
            <CModalFooter>
                {!soloMosrtrar ? <CButton color="primary" onClick={handleExternalSubmit}>Subir Archivos</CButton> : null}
            </CModalFooter>
        </CModal>
    );
};

export default PedidoUploadModal;
