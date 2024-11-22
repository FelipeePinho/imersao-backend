import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Define uma rota para listar todos os posts.
export async function listarPosts(req, res) {
  // Obtém todos os posts do banco de dados.
  const posts = await getTodosPosts();
  // Envia os posts como resposta em formato JSON.
  res.status(200).json(posts);
}

// Define uma rota para criar um novo post.
export async function postarNovoPost(req, res) {
  // Extrai os dados do novo post do corpo da requisição.
  const novoPost = req.body;

  try {
    // Cria o novo post no banco de dados.
    const postCriado = await criarPost(novoPost);
    // Envia o post criado como resposta.
    res.status(200).json(postCriado);
  } catch (erro) {
    // Registra o erro no console e envia uma mensagem de erro genérica.
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

// Define uma rota para fazer upload de uma imagem e criar um novo post.
export async function uploadImagem(req, res) {
  // Cria um objeto para representar o novo post com a imagem.
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname, // Utiliza o nome original do arquivo como URL da imagem
    alt: ""
  };

  try {
    // Cria o novo post no banco de dados.
    const postCriado = await criarPost(novoPost);
    // Gera um novo nome para a imagem, utilizando o ID do post.
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Renomeia o arquivo da imagem para o novo nome.
    fs.renameSync(req.file.path, imagemAtualizada);
    // Envia o post criado como resposta.
    res.status(200).json(postCriado);
  } catch (erro) {
    // Registra o erro no console e envia uma mensagem de erro genérica.
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

// Define uma rota para criar um novo post.
export async function atualizarNovoPost(req, res) {
  // Extrai os dados do novo post do corpo da requisição.
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;
  try {
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);
    const post = {
      imgUrl: urlImagem, 
      descricao: descricao,
      alt: req.body.alt
    };
    // Cria o novo post no banco de dados.
    const postCriado = await atualizarPost(id, post);
    // Envia o post criado como resposta.
    res.status(200).json(postCriado);
  } catch (erro) {
    // Registra o erro no console e envia uma mensagem de erro genérica.
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}