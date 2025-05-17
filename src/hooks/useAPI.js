const url = import.meta.env.VITE_API_URL

import { useState, useEffect, useContext } from "react"

import { AuthContext } from "../contexts/UserContext"

export function useVerificaLogin () {

    const [usuarios, setUsuarios] = useState([])

    const { login } = useContext(AuthContext)

    useEffect( () => {
        async function fetchData() {
            try{
                const req = await fetch(`${url}usuarios`)
                console.log(req)
                setUsuarios(await req.json())
            }
            catch(erro){
                console.log(erro.message)
            }
        }
        fetchData()
    }, [])

    const verificaLogin = (data) => {
        const userToFind = usuarios.find( (user) => {
            return user.email === data.email
        } );
        
        if(userToFind != undefined && userToFind.senha == data.senha){
            login(userToFind)
            console.log(userToFind.nome,"logado")
            return "Login bem sucedido"
        }
        else{
            console.log(userToFind)
            return "Usuario ou senha invalidos"
        }

    }

    return { verificaLogin };

}

export function useListaProdutos() {
    const [produtos, setProdutos] = useState([])

    useEffect( () => {
        async function fetchData() {
            try{
                const req = await fetch(`${url}produtos`)
                console.log(req)
                setProdutos(await req.json())
            }
            catch(erro){
                console.log(erro.message)
            }
        }
        fetchData()
    }, [])

    return produtos

}

export function useDeleteProduto() {
    const deletarProduto = async (idProd) => {
        const req = await fetch(`${url}produtos/${idProd}`, {
            method:"DELETE"
        })
        const res = await req.json();
        console.log("Produto deletado:", res)
        return res
    }
    return {deletarProduto}
}

export function useBuscarProdutoPorId () {
    const buscarProdutoPorId = async (idProd) => {
        const req = await fetch(`${url}produtos/${idProd}`);
        const res = await req.json();
        console.log("Produto encontrado:", res);
        return res;
    }
    return { buscarProdutoPorId }
}

export function useListaCargo() {
    const [ cargo, setCargo ] = useState([])

    useEffect(() => {
        async function fetchData() {
            try{
                const req = await fetch(`${url}cargo`)
                setCargo(await req.json())
            }
            catch(erros){
                console.log(erros.message)
            }
        }
        fetchData()
    }, [])
    return cargo
}

export function useListaCategorias() {
    const [ categorias, setCategorias ] = useState([])

    useEffect(() => {
        async function fetchData() {
            try{
                const req = await fetch(`${url}categorias`)
                setCategorias(await req.json())
            }
            catch(erros){
                console.log(erros.message)
            }
        }
        fetchData()
    }, [])
    return categorias
}

export function useInserirProduto(){
    const inserirProduto = async (data) => {
        const req = await fetch (`${url}produtos`, {
            method: "POST",
            headers: {
                "Content-Type": "appçication/json"
            },
            body: JSON.stringify(data)
        })
        return (await req.json())
    }
    return { inserirProduto }
}

export function useAtualizaProduto(){
    const atualizaProduto = async (data, idProduto) => {
        const req = await fetch (`${url}produtos/${idProduto}`, {
            method: "PUT",
            headers: {
                "Content-Type": "appçication/json"
            },
            body: JSON.stringify(data)
        })
        return (await req.json())
    }
    return { atualizaProduto }
}