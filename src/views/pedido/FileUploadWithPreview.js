import { CButton } from '@coreui/react';
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import {
    useHistory
} from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

const FileUploadWithPreview = forwardRef((props, ref) => {

    const { addToast } = useToasts();
    const history = useHistory();
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes
    const [files, setFiles] = useState([]);
    const [archivos, setArchivos] = useState([]);
    const [pedidoIdLoaded, setPedidoIdLoaded] = useState();

    const handleFileChange = (event) => {
        const cantidaArchivos = archivos.length;
        const cantidadFiles = files.length;
        const cantidadFileSol = event.target.files.length;
        const totalSol = cantidaArchivos + cantidadFiles + cantidadFileSol;

        if (totalSol > 6) {
            addToast(`No se puede subir más de 6 archivos.`, {
                appearance: 'warning',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
            return;
        }
        const newFiles = Array.from(event.target.files).filter(file => file.size < MAX_FILE_SIZE).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const elimiarRegistros = async (archivoId) => {
        try {
            const user_object = reactLocalStorage.getObject('user');

            let bearer = "";

            if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
                reactLocalStorage.remove('user');
                history.push('/login');
            } else {
                bearer = `Bearer ${user_object.token}`;
            }

            const archivos = await axios({
                method: 'post',
                url: `https://ws.conectaguate.com/api/v1/site/pedido/documentos/remove/${archivoId}`,
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
            });
            listarRegistros(pedidoIdLoaded)
        } catch (e) {
            addToast(`No se pudo eliminar el archivos. Error: ${parseError(e.response.data)}`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
        }
    }

    const listarRegistros = async (pedidoId) => {
        try {
            setPedidoIdLoaded(pedidoId);
            setArchivos([]);
            if (pedidoId == null || pedidoId == undefined) {
                return;
            }
            const user_object = reactLocalStorage.getObject('user');

            let bearer = "";

            if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
                reactLocalStorage.remove('user');
                history.push('/login');
            } else {
                bearer = `Bearer ${user_object.token}`;
            }

            const archivos = await axios({
                method: 'get',
                url: `https://ws.conectaguate.com/api/v1/site/pedido/documentos/list/${pedidoId}`,
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
            });
            const files = archivos.data.Data;
            let listadoArchivos = [];
            files.forEach(file => {
                listadoArchivos.push({
                    descripcion: file.descripcion,
                    file: `https://ws.conectaguate.com/${file.file}`,
                    id: file.id,
                    pedidoId: file.pedidoId
                })
            });
            setArchivos(listadoArchivos);
        } catch (e) {
            addToast(`No se pudo listar los archivos. Error: ${parseError(e.response.data)}`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
        }
    }

    const handleUpload = async (pedidoId) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append(`files[]`, files[i].file);
        }

        const user_object = reactLocalStorage.getObject('user');

        let bearer = "";
        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        } else {
            bearer = `Bearer ${user_object.token}`;
        }
        // Add extraData to the formData if needed
        try {
            await axios({
                method: 'post',
                url: `https://ws.conectaguate.com/api/v1/site/pedido/documentos/add/${pedidoId}`,
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            });

            addToast(`Se agregaron los documentos correctamente.`, {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });

            setFiles([]);
            listarRegistros(pedidoId);
        } catch (error) {
            addToast(`No se pudo subir los archivos. Error: ${parseError(error.response.data)}`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
        }
    };

    const parseError = (response) => {
        if (!response.errors) {
            return 'No validation errors found.';
        }

        const errorMessages = [];
        response.errors.forEach(error => {
            errorMessages.push(error);
        });

        return errorMessages.join('\n');
    }

    const handleSubmit = (extraData) => {
        handleUpload(extraData); // Llama a la función de subida cuando sea necesario
    };

    function isImage(filePath) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const extension = filePath.split('.').pop().toLowerCase();
        return imageExtensions.includes(extension);
    }

    // Exponer la función handleSubmit usando el ref
    useImperativeHandle(ref, () => ({
        handleSubmit: handleUpload,
        handleList: listarRegistros
    }));

    return (
        <div id='conatiner-uploadFiles'>
            <div className="card-title">
                <h3 >Subir Archivos</h3>
            </div>
            {
                !props.soloMosrtrar ? <input type="file" multiple onChange={handleFileChange} placeholder='Subir Documento' title='Subir Documento' /> : null
            }
            <br></br>
            <span>*Maximo 5 archivos por pedido.</span>
            <br></br>
            <span>*Solo se puede subir archivos menores a 2MB.</span>
            <br></br> 
            {
                props.soloMosrtrar ? <span>*Solo se puede subir documentos cuando el pedido esta en estado <strong>Recibido</strong>.</span> : null
            }
            {files.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Archivo</th>
                            <th>Vista Previa</th>
                            {
                                !props.soloMosrtrar ? <th>Acciones</th> : null
                            }

                        </tr>
                    </thead>
                    <tbody>
                        {files.map(({ file, preview }, index) => (
                            <tr key={index}>
                                <td>{file.name}</td>
                                <td>
                                    {file.type.startsWith('image/') ? (
                                        <img src={preview} alt={file.name} width="100" />
                                    ) : (
                                        <a href={preview} target="_blank" rel="noopener noreferrer">
                                            Ver Documento
                                        </a>
                                    )}
                                </td>
                                {
                                    !props.soloMosrtrar ?
                                        <td>
                                            <CButton className="btn btn-primary" onClick={() => handleRemoveFile(index)}>Eliminar</CButton>
                                        </td>
                                        :
                                        null
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <br></br>
            {archivos.length > 0 && (
                <span>*Solo se pueden eliminar archivos si el pedido sigue en estado Recibido.</span>
            )}
            {archivos.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th className='text-center' colSpan={3}>
                                Archivos Subidos
                            </th>
                        </tr>
                        <tr>
                            <th>Archivo</th>
                            <th>Vista Previa</th>
                            {
                                !props.soloMosrtrar ?
                                    <th>Acciones</th>
                                    :
                                    null
                            }

                        </tr>
                    </thead>
                    <tbody>
                        {archivos.map((archivo, index) => (
                            <tr key={index}>
                                <td>{archivo.descripcion}</td>
                                <td>
                                    {isImage(archivo.file) ? (
                                        <img src={archivo.file} alt={archivo.descripcion} width="100" />
                                    ) : (
                                        <a href={archivo.file} target="_blank" rel="noopener noreferrer">
                                            Ver Documento
                                        </a>
                                    )}
                                </td>
                                {
                                    !props.soloMosrtrar ?
                                        <td>
                                            <CButton className="btn btn-danger" onClick={() => elimiarRegistros(archivo.id)}>Eliminar</CButton>
                                        </td>
                                        :
                                        null
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
});

export default FileUploadWithPreview;