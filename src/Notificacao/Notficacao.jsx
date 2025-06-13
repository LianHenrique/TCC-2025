import { useRef, useEffect } from 'react'
import { Container } from 'react-bootstrap';
import { ToastContainer, toast, Zoom } from 'react-toastify';

const Notficacao = () => {
    // Carrega os ids já notificados do localStorage
    const prevIds = useRef(
        JSON.parse(localStorage.getItem('idsNotificados') || '[]')
    );

    useEffect(() => {
        const fetchAlerta = () => {
            fetch('http://localhost:3000/insumos/alerta')
                .then(res => res.status === 204 ? [] : res.json())
                .then(data => {
                    const idsAtuais = (data || []).map(item => item.id_insumos);
                    const idsAnteriores = prevIds.current;

                    const novoInsumo = idsAtuais.find(id => !idsAnteriores.includes(id));

                    if (novoInsumo) {
                        toast.warn('Atenção: Estoque reduzindo', {
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
                    }

                    // Atualiza prevIds e salva no localStorage
                    prevIds.current = idsAtuais;
                    localStorage.setItem('idsNotificados', JSON.stringify(idsAtuais));
                })
                .catch(error => console.log('Erro ao buscar insumos:', error));
        };

        fetchAlerta();
        const interval = setInterval(fetchAlerta, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container>
            <ToastContainer />
        </Container>
    )
}

export default Notficacao