import React, { useRef, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { ToastContainer, toast, Zoom } from 'react-toastify';

const Notficacao = () => {
    const [resultados, setresultados] = useState([]);
    const [visivel, setVisivel] = useState(false);
    const prevResultados = useRef([]);

    useEffect(() => {
        const fetchAlerta = () => {
            fetch('http://localhost:3000/insumos/alerta')
                .then(res => res.status === 204 ? [] : res.json())
                .then(data => {
                    if (JSON.stringify(data) !== JSON.stringify(prevResultados.current)) {
                        if (data && data.length > 0) {
                            setresultados(data);
                            setVisivel(true);
                            toast.warn('Atenção: Estoque reduzindo!', {
                                position: "bottom-left",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: false,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                                transition: Zoom,
                            });
                            setTimeout(() => setVisivel(false), 5000);
                        }
                        prevResultados.current = data;
                    }
                })
                .catch(error => console.log(error));
        };

        fetchAlerta();
        const interval = setInterval(fetchAlerta, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container> 
            <ToastContainer/>
        </Container>
    )
}

export default Notficacao