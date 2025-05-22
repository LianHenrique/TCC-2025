import React from 'react'
import Navbar from '../../components/NavBar/NavBar'
import CardGeral from '../../components/Cards/CardGeral'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// tem que pegar o id da tela de cardápio, props.
const visualizar = () => {
    const { id } = useParams()
    const [produtos, setProdutos] = useState([])

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3000/produto${id}`)
                .then(response => response.json())
                .then(data => {
                    setProdutos([data])
                })
                .catch(error => console.log("Erro ao buscar produtos", error))
        }
    }, [id])
    // Esse [id] é uma ordem pra esse useeffect rodar tdas as vezes que o id mudar


    return (
        <div>
            <Navbar />

            {/* Se o id for vazio, então: */}
            {!id ? (
                <section>
                    <img src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png" alt='Sem produtos relacionados a ele.' />
                </section>
            ) : (
                <CardGeral filtro="produtos" card={produtos} />
            )}
        </div>

    )
}

export default visualizar