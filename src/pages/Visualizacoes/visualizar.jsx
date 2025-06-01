import React from 'react'
import { useParams } from 'react-router-dom'

const Visualizar = () => {
    const { id } = useParams();
    console.log(`Número do id: ${id}`);

  return (
    <div>
        
    </div>
  )
}

export default Visualizar