# Portfolio Interativo

Um portfólio web interativo desenvolvido para apresentar projetos de forma dinâmica, permitindo gerenciamento em tempo real através de autenticação, banco de dados em nuvem e armazenamento de imagens.

## Demonstração

**Site:** https://dkoder57.github.io/Portfolio-interativo/

## Funcionalidades

* Tela de boas-vindas animada
* Exibição dinâmica de projetos
* Autenticação via GitHub
* Integração com Firebase Authentication
* Armazenamento de dados no Firestore
* Upload de imagens para Cloudinary
* Cadastro de novos projetos
* Exclusão de projetos existentes
* Sistema de gerenciamento por popups modais
* Limite configurável de projetos
* Persistência de dados em nuvem
* Deploy automático via GitHub Pages

## Tecnologias Utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)

### Backend as a Service

* Firebase Authentication
* Cloud Firestore

### Armazenamento de Mídia

* Cloudinary

### Hospedagem

* GitHub Pages

## Arquitetura

```text
Usuário
   │
   ▼
Frontend (GitHub Pages)
   │
   ├── Firebase Authentication
   │
   ├── Cloud Firestore
   │
   └── Cloudinary
```

## Estrutura dos Dados

### Coleção Firestore

```json
{
  "titulo": "Nome do Projeto",
  "descricao": "Descrição do projeto",
  "link": "https://...",
  "imagem": "https://...",
  "publicId": "cloudinary-id",
  "criadoEm": "timestamp"
}
```

## Fluxo de Funcionamento

### Cadastro de Projeto

1. Usuário autentica via GitHub.
2. Seleciona uma imagem.
3. A imagem é enviada para o Cloudinary.
4. A URL retornada é armazenada no Firestore.
5. O projeto é exibido automaticamente na página.

### Carregamento

1. O site inicia.
2. Os documentos da coleção `projetos` são carregados.
3. Os cards são gerados dinamicamente.
4. O conteúdo é renderizado na interface.

## Objetivos do Projeto

Este projeto foi criado com o objetivo de:

* Centralizar meus projetos em um único ambiente.
* Demonstrar integração com serviços em nuvem.
* Explorar autenticação social utilizando GitHub.
* Praticar manipulação avançada do DOM.
* Desenvolver uma interface mais dinâmica que um portfólio tradicional.

## Aprendizados

Durante o desenvolvimento foram explorados conceitos como:

* CRUD em banco NoSQL
* Firebase Authentication
* Firestore
* Upload de arquivos
* Integração com APIs externas
* Manipulação dinâmica do DOM
* Programação assíncrona com async/await
* Deploy de aplicações estáticas

## Melhorias Futuras

* Sistema de categorias para projetos
* Busca e filtros
* Dashboard administrativo
* Edição de projetos existentes
* Tema escuro/claro
* Estatísticas de visualização
* Integração com GitHub API
* Otimização de carregamento de imagens
* Migração de operações sensíveis para backend

## Como Executar Localmente

```bash
git clone https://github.com/DKoder57/Portfolio-interativo.git
cd Portfolio-interativo
```

Abra o arquivo:

```bash
index.html
```

ou utilize uma extensão como Live Server.

## Autor

**Danilo César**

Desenvolvedor de Software focado em desenvolvimento web, automação e soluções utilizando tecnologias modernas.

---

Projeto desenvolvido para aprendizado contínuo e demonstração de habilidades técnicas.
