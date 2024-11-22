import "dotenv/config";
// Importa a função para conectar ao banco de dados, definida em dbConfig.js.
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";
// Conecta ao banco de dados usando a string de conexão fornecida pela variável de ambiente STRING_CONEXAO. O resultado da conexão é armazenado na variável conexao.
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
 
// Define uma função assíncrona para buscar todos os posts do banco de dados.
export async function getTodosPosts() {
     // Seleciona o banco de dados "imersao-instabytes" da conexão estabelecida.
    const db = conexao.db("imersao-instabytes");
     // Seleciona a coleção "posts" dentro do banco de dados.
    const colecao = db.collection("posts");
    // Executa uma consulta para encontrar todos os documentos da coleção e retorna os resultados como um array.
    return colecao.find().toArray();
}

export async function criarPost(novoPost) {
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPost)
}

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost})
}