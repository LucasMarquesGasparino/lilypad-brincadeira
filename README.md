# Lilypad — brinca comigo

Protótipo web interativo de uma tablet-amiguinha inspirada na personagem Lilypad/Lily de *Toy Story 5*. A tela principal é deliberadamente visual: rosto em tela cheia, sem textos visíveis.

## Interações

- Toque na área livre da tela: **“Oi, eu sou a Lilypad! Que bom ter você aqui. Vamos brincar?”**
- Toque no olho esquerdo: **“Tenha um excelente dia de brincadeiras!”**
- Toque no olho direito: **“Eu senti sua falta!”**
- Toque na boca: **“Amanhã nós brincamos mais.”**

Os olhos acompanham o ponteiro, piscam sozinhos e a boca anima durante a fala. A lista à esquerda também pode disparar os quatro eventos.

## Como abrir

Abra `index.html` diretamente no navegador. Para servir por HTTP local:

```sh
cd projects/lilypad-brincadeira
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Licenças

Os sprites CC0 e a origem das vozes estão detalhados em [assets/CREDITS.md](assets/CREDITS.md).
