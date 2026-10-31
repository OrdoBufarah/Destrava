# Destrava — como colocar no ar

App de inglês por voz com o professor Jarvis. Funciona no navegador do celular, com microfone de verdade e conversa contínua: você fala, ele responde em voz alta e volta a ouvir sozinho.

## O que tem aqui

- `index.html`: o app (modo voz com a esfera e a tela de conversa)
- `api/chat.js`: o servidor que fala com a IA (sua chave fica só aqui, segura)
- `api/tts.js`: a voz natural do Jarvis (IA de voz do Google, a mesma em qualquer aparelho)
- `kids.html`: o **Destrava Kids**, inglês para crianças em forma de joguinho (16 fases em 4 mundos)
- `manifest.json` e ícones: para instalar na tela inicial como um app

## 1. Pegar a chave da IA

### Opção grátis para testar (Google Gemini, sem cartão)
1. Acesse **aistudio.google.com** e entre com sua conta Google.
2. Clique em **Get API key → Create API key**.
3. Copie a chave (pode começar com `AQ.` ou `AIza`).
4. Na Vercel, use a variável **`GEMINI_API_KEY`** com essa chave.

O plano grátis tem limite de mensagens por dia. Se aparecer "Limite de mensagens atingido", é só esperar o dia seguinte.

### Opção paga para o produto final (Claude)
1. Acesse **console.anthropic.com**, crie a conta e coloque US$ 5 de crédito em **Billing**.
2. Em **API Keys → Create Key**, copie a chave (começa com `sk-ant-`).
3. Na Vercel, use a variável **`ANTHROPIC_API_KEY`**. Se as duas chaves existirem, o app usa o Claude.

## 2. Publicar na Vercel (10 min)

1. Crie uma conta grátis em **vercel.com**. Pode entrar com o Google.
2. Crie uma conta no **github.com**, crie um repositório chamado `destrava` e envie todos os arquivos desta pasta (botão **Add file → Upload files**, arraste tudo, inclusive a pasta `api`).
3. Na Vercel, clique em **Add New → Project**, escolha o repositório `destrava` e clique em **Import**.
4. Antes de publicar, abra **Environment Variables** e adicione:
   - `GEMINI_API_KEY` (grátis) ou `ANTHROPIC_API_KEY` (pago) = a chave que você copiou
   - `DESTRAVA_ACCESS_CODE` = um código qualquer, por exemplo `costela2026` (opcional, mas recomendado: impede que estranhos gastem seus créditos)
5. Clique em **Deploy**. Em 1 minuto você recebe um link do tipo `destrava.vercel.app`.

## 3. Usar no celular

1. Abra o link no **Safari** (iPhone) ou no **Chrome** (Android).
2. Digite seu nome e o código de acesso, se você criou um, e toque em **Começar**.
3. Toque no **microfone escuro** e permita o uso do microfone.
4. Fale em inglês. Quando ele terminar de responder, ele volta a te ouvir sozinho. Para pausar, toque no microfone de novo.
5. Para virar app: no iPhone, toque em **Compartilhar → Adicionar à Tela de Início**. No Android, **⋮ → Instalar app**.

## Voz do Jarvis

A voz natural é gerada pela IA de voz do Google com a mesma `GEMINI_API_KEY`. Em Ajustes → **Voz do Jarvis** dá para escolher entre 8 vozes. Se o limite grátis do dia acabar, o app passa sozinho para a voz do aparelho e volta depois.

Variáveis opcionais na Vercel: `DESTRAVA_VOICE` (voz padrão, ex.: `Puck`) e `DESTRAVA_TTS_MODEL` (modelo de voz, padrão `gemini-3.1-flash-tts-preview`).

## Destrava Kids (v6: as 3 aulas)

Acesse pelo botão **Destrava Kids** ou em `seu-link.vercel.app/kids.html`.

**Arquivos do Kids** (todos precisam estar no repositório):
- `kids.html`: o app
- `art.js`: os desenhos e a lista das figuras
- a pasta `img/`: as figuras 3D recortadas da folha de arte (animais, família, brinquedos, escola, casa, potes de tinta e cenários)
- `hero.png` e `hero-face.png`: o Super Benjamin

**A jornada** começa pelas 3 aulas feitas à mão:
1. **A Casa da Família** (mom, dad, grandma, grandpa e baby). A criança descobre tocando, faz "Find Grandma!", arrasta o papai até a porta ("Bring Dad home!"), responde "Who is this?" e termina com revisão nas bolhas.
2. **O Quarto dos Brinquedos** (ball, car, teddy bear, doll e bike). A bola quica, o carro anda e o ursinho dança. Ela faz "Find the ball!", arrasta o carro até a pista ("Make the car go!"), procura o ursinho nos baús e responde "Can you say ball?".
3. **O Laboratório das Cores** (red, blue, yellow, green e pink). Ela arrasta a tinta até o carrinho cinza ("Make it red!"), pinta a bola ("Paint the ball blue!"), faz "Find the yellow toy!" e responde "What color?" (ou toca no pote da cor).

Depois vêm os níveis com a bolha mágica: Floresta (animais e selva), Minha Escola, Minha Casa e Mais cores.

**Regras de cada aula:**
- Toda fala tem uma alternativa de toque e o botão **Pular**. Sem microfone, a aula vai até o fim.
- O erro recebe "Try again!". Depois de 2 erros, o Benjamin voa para perto da resposta certa e ela brilha.
- O fim de cada aula, e um momento no meio dela, têm a **cama elástica dourada**: 3 pulos, o último com cambalhota, e o Benjamin volta ao voo.
- O progresso é salvo por palavra: toque, compreensão de comando, tentativa de fala e revisão.

### Voz própria do Benjamin (opcional)
Por padrão, o Benjamin usa a voz natural do Google (Puck), com sotaque de Brasília. Para usar uma voz infantil própria pela ElevenLabs, criada com autorização e consentimento dos pais, coloque na Vercel:
- `ELEVENLABS_API_KEY`: a chave da ElevenLabs
- `ELEVENLABS_VOICE_ID`: o ID da voz do Benjamin
Se a ElevenLabs falhar, o app volta sozinho para a voz do Google. Ao trocar a voz, aumente `VOICE_REV` no `kids.html` (de 1 para 2) para renovar o cache das falas.

## Ajustes úteis

- **Professor educado ou impaciente**, velocidade da voz e legendas: ícone de ajustes no topo do modo voz.
- **Modo direção**: menu **+** → "Estou dirigindo".
- **Trocar o modelo da IA**: adicione a variável `DESTRAVA_MODEL` na Vercel (padrão: `claude-haiku-5-5`, o mais rápido e barato; `claude-sonnet-5-5` é mais caprichado, porém mais lento e caro).

## Limites desta versão

- O progresso fica salvo no próprio celular. Trocar de aparelho começa do zero (contas de usuário vêm na próxima versão).
- A voz natural está em versão de prévia no Google e o plano grátis tem limite diário.
- O reconhecimento de voz depende do navegador. Funciona bem no Chrome e no Safari atualizados.
