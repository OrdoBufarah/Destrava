# Destrava — como colocar no ar

App de inglês por voz com o professor Jarvis. Funciona no navegador do celular, com microfone de verdade e conversa contínua: você fala, ele responde em voz alta e volta a ouvir sozinho.

## O que tem aqui

- `index.html`: o app (modo voz com a esfera e a tela de conversa)
- `api/chat.js`: o servidor que fala com a IA (sua chave fica só aqui, segura)
- `manifest.json` e ícones: para instalar na tela inicial como um app

## 1. Pegar a chave da IA

### Opção grátis para testar (Google Gemini, sem cartão)
1. Acesse **aistudio.google.com** e entre com sua conta Google.
2. Clique em **Get API key → Create API key**.
3. Copie a chave (começa com `AIza`).
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

## Ajustes úteis

- **Professor educado ou impaciente**, velocidade da voz e legendas: ícone de ajustes no topo do modo voz.
- **Modo direção**: menu **+** → "Estou dirigindo".
- **Trocar o modelo da IA**: adicione a variável `DESTRAVA_MODEL` na Vercel (padrão: `claude-haiku-5-5`, o mais rápido e barato; `claude-sonnet-5-5` é mais caprichado, porém mais lento e caro).

## Limites desta versão

- O progresso fica salvo no próprio celular. Trocar de aparelho começa do zero (contas de usuário vêm na próxima versão).
- A voz do Jarvis é a voz do sistema do celular. Vozes mais naturais (com sotaque brasileiro de verdade no português) entram numa próxima etapa.
- O reconhecimento de voz depende do navegador. Funciona bem no Chrome e no Safari atualizados.
