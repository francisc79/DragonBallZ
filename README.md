# Dragon Ball Z — Memory Battle

Jogo da memória temático inspirado no universo Dragon Ball Z. O projeto utiliza **HTML5, CSS3 e JavaScript puro**, sem frameworks ou dependências de instalação.

<p align="center">
  <a href="https://francisc79.github.io/DragonBallZ/"><strong>▶ JOGAR ONLINE</strong></a>
</p>

## Captura de tela do jogo

<p align="center">
  <a href="docs/Imagem do ChatGPT 4 de nov. de 2026, 10_20_43.png">
    <img src="docs/Imagem do ChatGPT 4 de nov. de 2026, 10_20_43.png" alt="Prévia visual da interface Dragon Ball Z Memory Battle, com placar e tabuleiro de cartas" width="900">
  </a>
</p>

## Funcionalidades

- **Modo Solo:** encontre os 10 pares e acompanhe suas tentativas.
- **Modo Versus:** desafie outra pessoa, alterne os turnos e dispute a maior pontuação.
- **Partidas dinâmicas:** seleção aleatória de 10 personagens em cada rodada.
- **Experiência imersiva:** trilhas e efeitos sonoros.
- **Interface responsiva:** compatível com desktop, tablet e celular.
- **PWA:** manifesto de instalação e cache offline básico via Service Worker.

## Tecnologias

| Tecnologia | Utilização |
| --- | --- |
| HTML5 | Estrutura semântica e acessibilidade |
| CSS3 | Layout responsivo, Grid, animações e design system |
| JavaScript ES6+ | Lógica, eventos, pontuação e manipulação do DOM |
| PWA | Manifest e Service Worker |

## Executar localmente

1. Clone ou baixe este repositório.
2. Abra a pasta no VS Code.
3. Inicie um servidor local, como a extensão Live Server.
4. Acesse o endereço disponibilizado pelo servidor.

> O Service Worker exige localhost ou HTTPS. Abrir o HTML diretamente pelo explorador de arquivos não ativa os recursos PWA.

## Estrutura

```text
DragonBallZ/
├── docs/
│   └── gameplay-preview.svg  # Captura de tela real do jogo
├── img/                      # Imagens dos personagens
├── index.html                # Estrutura da aplicação
├── style.css                 # Estilos e responsividade
├── script.js                 # Regras e interações do jogo
├── manifest.json             # Configuração PWA
├── sw.js                     # Cache offline
├── DBZ.png                   # Identidade visual
├── ESFERA.png                # Elemento visual e ícone
└── *.mp3                     # Trilhas e efeitos sonoros
```

## Destaques de implementação

- Embaralhamento Fisher–Yates para distribuição imparcial das cartas.
- Prevenção de cliques duplicados e seleção de cartas já encontradas.
- Bloqueio de interações após o encerramento da partida.
- Atualização de placar e indicador de turno no modo Versus.
- Escape de caracteres HTML nos nomes exibidos no resultado.
- Rótulos acessíveis para as cartas e controles.

## Créditos e direitos

Projeto independente, sem vínculo oficial com a franquia Dragon Ball. Dragon Ball, seus personagens, marcas, músicas e materiais relacionados pertencem aos respectivos titulares. Os recursos de mídia devem ser utilizados respeitando os direitos de seus proprietários.

---

Desenvolvido por **Francisco Antônio** · Projeto de portfólio
