import React from 'react'
import { useEffect, useState } from 'react'

const Notficacao = () => {
  const [resultados, setresultados] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/produtos')
        .then(res = res.json())

        if(resultados <= 10){
            
        }
  })

  return (
    <div>
        <h1> E RECARREGAR O ESTOQUE? NADA AINDA? </h1>
    </div>
  )
}

export default Notficacao