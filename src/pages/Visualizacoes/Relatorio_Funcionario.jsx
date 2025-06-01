import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import style from '../Visualizacoes/visualizar.module.css'
import CardGeral from '../../components/Cards/CardGeral';
import NavBar from '../../components/NavBar/NavBar'
import { Container } from 'react-bootstrap';

const Relatorio_Funcionario = () => {
    const { id } = useParams();
    const [funcionario, setFuncionario] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        console.log("UseEffect disparado. id igual a", id);

        fetch(`http://localhost:3000/funcionarios/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Funcionário não encontrado');
                return response.json();
            })
            .then(data => {
                console.log(`dados:`, data)

                // transformando o obj que o back retorna em array 
                const funcionario = Array.isArray(data) ? data[0] : data;
                const funcionarioFormatado = {
                    nome: funcionario.nome_funcionario,
                    link: funcionario.imagem_url,
                    descricao: [
                        { texto: `Nome: ${funcionario.nome_funcionario}` },
                        { texto: `Email de contato: ${funcionario.email_funcionario}` }
                    ]
                };
                setFuncionario([funcionarioFormatado])
            })
            .catch(error => {
                console.log("Erro ao buscar produtos", error)
                setError(error.message);
            });
    }, [id]);


    return (
        <div>
            <NavBar/>
            <Container className={style.Container}>
            {/* se id for vazio */}
            {!id ? (
                <section>
                    <img src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png" alt='Sem produtos relacionados a ele.' />
                </section>
            ) : (
                <CardGeral
                    filtro={null}
                    card={funcionario}
                    ClassNameCard={style.corpo_card}
                    ClassImg={style.img}
                    enableOverflow={false}
                    Desc={style.desc}
                    ClassTitulo={style.titulo}
                />
            )}
            </Container>
            <p className={style.title}>Funcionario</p>
        </div>
    )
}

export default Relatorio_Funcionario