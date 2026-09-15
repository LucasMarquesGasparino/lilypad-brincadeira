# Lilypad — brinca comigo (Web)

Protótipo web interativo de uma tablet-amiguinha inspirada na personagem
Lilypad/Lily de *Toy Story 5*. A tela principal é deliberadamente visual:
rosto em tela cheia, sem textos visíveis.

## Como abrir

Abra `index.html` diretamente no navegador, ou sirva por HTTP local:

```sh
cd ~/projects/lilypad-brincadeira
python3 -m http.server 8080
# acesse http://localhost:8080
```

## Interações

- Toque na área livre da tela: **"Oi, eu sou a Lilypad! Que bom ter você
  aqui. Vamos brincar?"**
- Toque no olho esquerdo: **"Tenha um excelente dia de brincadeiras!"**
- Toque no olho direito: **"Eu senti sua falta!"**
- Toque na boca: **"Amanhã nós brincamos mais."**

Os olhos acompanham o ponteiro, piscam sozinhos e a boca anima durante a fala.
A lista lateral também pode disparar os quatro eventos.

## Estrutura

```
lilypad-brincadeira/
├── index.html
├── app.js
├── styles.css
├── manifest.webmanifest
└── assets/   # sprites + 4 áudios (ver assets/CREDITS.md)
```

## Licenças

Os sprites CC0 e a origem das vozes estão detalhados em
[assets/CREDITS.md](assets/CREDITS.md).

> O `lilypad-apk` empacota esta interface num APK Android offline.
