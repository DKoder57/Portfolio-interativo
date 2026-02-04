// ============================================
// INICIALIZAÇÃO FIREBASE
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, doc, deleteDoc } 
  from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
  from "https://www.gstatic.com/firebasejs/12.8.0/firebase-storage.js";
import { getAuth, signInWithPopup, GithubAuthProvider } 
  from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCsV4FZFZMezk76qPu-0yrdkHqFW-P1iMk",
  authDomain: "meu-portifolio-4d847.firebaseapp.com",
  projectId: "meu-portifolio-4d847",
  storageBucket: "meu-portifolio-4d847.appspot.com",
  messagingSenderId: "295863189491",
  appId: "1:295863189491:web:2d930fe00d64b56f94dc86"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);   // <-- agora sim, depois de inicializar o app
const provider = new GithubAuthProvider();

console.log("Firebase inicializado:", app);

// Função de login com GitHub
async function loginComGitHub() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Logado com GitHub:", user.displayName, user.email);
    alert("Login realizado com GitHub!");
  } catch (error) {
    console.error("Erro no login GitHub:", error.message);
  }
}
// Garante que o botão está conectado depois que o DOM carrega
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnLoginGitHub")
    .addEventListener("click", loginComGitHub);
});

// ============================================
// CARREGAR PROJETOS DO FIRESTORE
// ============================================

async function carregarProjetos() {
  try {
    const querySnapshot = await getDocs(collection(db, "projetos"));
    querySnapshot.forEach((doc) => {
      const dados = doc.data();
      // O doc.id é o que vira o "firebaseId" dentro da função
      criarCardProjeto(dados.titulo, dados.descricao, dados.link, dados.imagem, doc.id, dados.publicId);
    });
  } catch (error) {
    console.error("Erro ao carregar projetos:", error);
  }
}
carregarProjetos();

// ============================================
// POPUP GERENCIAR PROJETOS
// ============================================

const popupGerenciar = document.createElement("div");
popupGerenciar.id = "popupGerenciar";
popupGerenciar.classList.add("popup");
popupGerenciar.innerHTML = `
  <button id="btnFecharPopup" class="close-btn">×</button>
  <h2>Gerenciar Projetos</h2>
  <button id="btnAddProjeto">Adicionar Projeto</button>
`;
document.body.appendChild(popupGerenciar);
popupGerenciar.style.display = "none"; // começa escondido

// ============================================
// POPUP ADICIONAR PROJETO (LOCAL)
// ============================================

const popupAdicionar = document.createElement("div");
popupAdicionar.id = "popupAdicionar";
popupAdicionar.classList.add("popup");
popupAdicionar.innerHTML = `
  <button id="btnFecharAdicionar" class="close-btn">×</button>
  <h2>Novo Projeto</h2>
  <input type="text" id="tituloProjeto" placeholder="Título do projeto">
  <textarea id="descricaoProjeto" placeholder="Descrição do projeto"></textarea>
  <input type="url" id="linkProjeto" placeholder="Link do projeto">
  <input type="file" id="imagemProjeto" accept="image/*">
  <button id="btnSalvarProjeto">Salvar</button>
`;
document.body.appendChild(popupAdicionar);
popupAdicionar.style.display = "none"; // também começa escondido

// ============================================
// EVENTOS
// ============================================

// Abrir popup Gerenciar
document.getElementById("GenProjeto").addEventListener("click", () => {
  popupGerenciar.style.display = "block";
  document.body.classList.add("popup-ativo");
});

// Fechar popup Gerenciar
document.addEventListener("click", (e) => {
  if (e.target?.id === "btnFecharPopup") {
    fecharPopup(popupGerenciar);
  }
});

// Fechar popup Adicionar
document.addEventListener("click", (e) => {
  if (e.target?.id === "btnFecharAdicionar") {
    fecharPopup(popupAdicionar);
  }
});


// ============================================
// CONSTANTES E LIMITES
// ============================================

const LIMITE_PROJETOS = 12;

function aplicarLimite(idCampo, limite) {
  const campo = document.getElementById(idCampo);
  if (!campo) return;

  campo.addEventListener("input", () => {
    if (campo.value.length > limite) {
      campo.value = campo.value.substring(0, limite);
    }
  });
}

aplicarLimite("tituloProjeto", 50);
aplicarLimite("descricaoProjeto", 300);
aplicarLimite("linkProjeto", 100);

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function verificarLimiteProjetos() {
  const container = document.getElementById("projetos");
  const totalProjetos = container.querySelectorAll(".card").length;
  return totalProjetos >= LIMITE_PROJETOS;
}

function fecharPopup(popup) {
  popup.style.display = "none";
  document.body.classList.remove("popup-ativo");
}

function abrirPopupEscolha() {
  const popupEscolha = document.createElement("div");
  popupEscolha.classList.add("popup");
  popupEscolha.innerHTML = `
    <button id="btnFecharEscolha" class="close-btn">×</button>
    <h2>Adicionar Projeto</h2>
    <p>Escolha como deseja adicionar:</p>
    <button id="btnAbrirTeste">Adicionar Dados Teste</button>
    <button id="btnAbrirReais">Adicionar Dados Reais</button>
  `;
  document.body.appendChild(popupEscolha);
  popupEscolha.style.display = "block";
  document.body.classList.add("popup-ativo");

  popupEscolha.querySelector("#btnFecharEscolha").addEventListener("click", () => {
    popupEscolha.remove();
    document.body.classList.remove("popup-ativo");
  });

  popupEscolha.querySelector("#btnAbrirTeste").addEventListener("click", () => {
    popupEscolha.remove();
    popupAdicionar.style.display = "block";
  });

  popupEscolha.querySelector("#btnAbrirReais").addEventListener("click", () => {
    popupEscolha.remove();
    abrirPopupFirebase();
  });

  
}

// ============================================
// FUNÇÃO POPUP FIREBASE
// ============================================

// Função auxiliar para upload no Cloudinary
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "uploudportifolioimagemdk"); 
  formData.append("folder", "projetos"); 

  const response = await fetch("https://api.cloudinary.com/v1_1/dq7xboszm/image/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  if (!response.ok || !data.secure_url) {
    throw new Error("Erro no upload para Cloudinary");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id // usado para deletar depois
  };
}
function abrirPopupFirebase() {
  const popupFirebase = document.createElement("div");
  popupFirebase.classList.add("popup");
  popupFirebase.id = "popupFirebase";
  popupFirebase.innerHTML = `
    <button id="btnFecharFirebase" class="close-btn">×</button>
    <h2>Novo Projeto (Cloudinary + Firestore)</h2>
    <input type="text" id="tituloProjetoFirebase" placeholder="Título do projeto">
    <textarea id="descricaoProjetoFirebase" placeholder="Descrição do projeto"></textarea>
    <input type="url" id="linkProjetoFirebase" placeholder="Link do projeto">
    <input type="file" id="imagemProjetoFirebase" accept="image/*">
    <button id="btnSalvarProjetoFirebase">Salvar</button>
  `;

  document.body.appendChild(popupFirebase);
  popupFirebase.style.display = "block";
  document.body.classList.add("popup-ativo");

  // Botão fechar
  popupFirebase.querySelector("#btnFecharFirebase").addEventListener("click", () => {
    popupFirebase.remove();
    document.body.classList.remove("popup-ativo");
  });

  // Botão salvar
  popupFirebase.querySelector("#btnSalvarProjetoFirebase").addEventListener("click", async () => {
    const titulo = document.getElementById("tituloProjetoFirebase").value || "Projeto sem título";
    const descricao = document.getElementById("descricaoProjetoFirebase").value || "Sem descrição";
    const link = document.getElementById("linkProjetoFirebase").value;
    const imagemInput = document.getElementById("imagemProjetoFirebase");
    const imagem = imagemInput.files[0];

    console.log("Botão salvar clicado");

    try {
      let urlImagem = "";
      let publicId = "";

      if (imagem) {
        console.log("Fazendo upload da imagem...");
        const result = await uploadToCloudinary(imagem);
        urlImagem = result.url;
        publicId = result.publicId;
        console.log("Imagem enviada para Cloudinary:", urlImagem);
      }

      const docRef = await addDoc(collection(db, "projetos"), {
        titulo,
        descricao,
        link,
        imagem: urlImagem,
        publicId,
        criadoEm: serverTimestamp()
      });

      console.log("Projeto salvo no Firestore com ID:", docRef.id);

    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      alert("Erro ao salvar projeto. Verifique o console.");
      criarCardProjeto(titulo, descricao, link, "");
    }

    popupFirebase.remove();
    document.body.classList.remove("popup-ativo");
  });
}

// ============================================
// EVENT LISTENERS - ABRIR/FECHAR POPUPS
// ============================================

document.getElementById("GenProjeto").addEventListener("click", () => {
  popupGerenciar.style.display = "block";
  document.body.classList.add("popup-ativo");
});

document.addEventListener("click", (e) => {
  if (e.target?.id === "btnFecharPopup") {
    fecharPopup(popupGerenciar);
  }
});

document.addEventListener("click", (e) => {
  if (e.target?.id === "btnAddProjeto") {
    if (verificarLimiteProjetos()) {
      alert(`Você já atingiu o limite de ${LIMITE_PROJETOS} projetos.`);
      fecharPopup(popupGerenciar);
      return;
    }
    fecharPopup(popupGerenciar);
    abrirPopupEscolha();
  }
});

document.addEventListener("click", (e) => {
  if (e.target?.id === "btnFecharAdicionar") {
    fecharPopup(popupAdicionar);
  }
});

// ============================================
// SALVAR PROJETO (DADOS TESTE)
// ============================================

document.addEventListener("click", (e) => {
  if (e.target?.id === "btnSalvarProjeto") {
    const titulo = document.getElementById("tituloProjeto").value || "Projeto sem título";
    const descricao = document.getElementById("descricaoProjeto").value || "Sem descrição";
    const link = document.getElementById("linkProjeto").value;
    const imagemInput = document.getElementById("imagemProjeto");
    const imagem = imagemInput.files[0];

    criarCardProjeto(titulo, descricao, link, imagem);

    document.getElementById("tituloProjeto").value = "";
    document.getElementById("descricaoProjeto").value = "";
    document.getElementById("linkProjeto").value = "";
    imagemInput.value = "";

    fecharPopup(popupAdicionar);
  }
});

// ============================================
// CRIAR CARD DE PROJETOS
// ============================================

  function criarCardProjeto(titulo, descricao, link, imagem, firebaseId, publicId) {
  const card = document.createElement("div");
  card.classList.add("card");

  if (publicId) {
    card.dataset.publicId = publicId; // associa publicId do Cloudinary
  }

  if (firebaseId) {
    card.dataset.firebaseId = firebaseId;
  }
  let imagemHTML = "";
  if (imagem) {
    let urlImagem;
    if (typeof imagem === "string") {
      // Caso seja URL (Firebase)
      urlImagem = imagem;
    } else {
      // Caso seja File (fluxo teste)
      urlImagem = URL.createObjectURL(imagem);
    }
    imagemHTML = `<img src="${urlImagem}" alt="Imagem do projeto" style="width:100%; border-radius:8px; margin-top:10px;">`;
  }

  let linkHTML = "";
  if (link) {
    let url = link;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url; // Adiciona o protocolo "https://" se estiver faltando
    }
    linkHTML = `<p><a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:underline;">Ver projeto</a></p>`;
  }

  const deleteButton = `
    <button class="btnDelete" title="Apagar projeto">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" viewBox="0 0 24 24">
        <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5a1 1 0 0 1-1 .5H7.5a1 1 0 0 1-1-.5L5 9zm5 2v8h2v-8H10zm4 0v8h2v-8h-2zM9 4V2h6v2h5v2H4V4h5z"/>
      </svg>
    </button>
  `;

  card.innerHTML = `
    <h3>${titulo}</h3>
    <p>${descricao}</p>
    ${linkHTML}
    ${imagemHTML}
    ${deleteButton}
  `;

  document.getElementById("projetos").appendChild(card);
  adicionarEventoDeletarProjeto(card);
}

// ============================================
// DELETAR PROJETOS
// ============================================
function adicionarEventoDeletarProjeto(card) {
  card.querySelector(".btnDelete").addEventListener("click", () => {
    const confirmPopup = document.createElement("div");
    confirmPopup.classList.add("popup");
    confirmPopup.innerHTML = `
      <button class="close-btn">×</button>
      <h2>Confirmar Exclusão</h2>
      <p>Deseja realmente apagar este projeto?</p>
      <button class="btnConfirmDelete">Sim</button>
      <button class="btnCancelDelete">Não</button>
    `;
    document.body.appendChild(confirmPopup);
    confirmPopup.style.display = "block";
    document.body.classList.add("popup-ativo");

    confirmPopup.querySelector(".btnCancelDelete").addEventListener("click", () => {
      confirmPopup.remove();
      document.body.classList.remove("popup-ativo");
    });

    confirmPopup.querySelector(".close-btn").addEventListener("click", () => {
      confirmPopup.remove();
      document.body.classList.remove("popup-ativo");
    });

    confirmPopup.querySelector(".btnConfirmDelete").addEventListener("click", async () => {
      if (card.dataset.firebaseId) {
        try {
          // Se houver publicId salvo no card, exclui imagem do Cloudinary
          if (card.dataset.publicId) {
            await deleteFromCloudinary(card.dataset.publicId);
          }

          // Exclui o documento do Firestore
          await deleteDoc(doc(db, "projetos", card.dataset.firebaseId));
          console.log("Projeto excluído do Firestore:", card.dataset.firebaseId);

        } catch (error) {
          console.error("Erro ao excluir projeto:", error);
        }
      }

      card.remove();
      confirmPopup.remove();
      document.body.classList.remove("popup-ativo");
      alert("Projeto excluído com sucesso!");
    });
  });
}

// Função auxiliar global para deletar imagem do Cloudinary
async function deleteFromCloudinary(publicId) {
  const cloudName = "dq7xboszm";
  const apiKey = "729636375649274";
  const apiSecret = "z9RS7NaRWwGLzYaf0lUiZonnEoc" // Teste simples, sem cuidados com segurança.

  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

  // Gera assinatura SHA-1
  const signature = await sha1(stringToSign);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (!response.ok || result.result !== "ok") {
      throw new Error("Erro ao excluir imagem do Cloudinary");
    }

    console.log("Imagem excluída do Cloudinary:", publicId);
  } catch (error) {
    console.error("Erro ao excluir imagem do Cloudinary:", error);
  }
}

// Função auxiliar para gerar SHA-1 no navegador
async function sha1(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
