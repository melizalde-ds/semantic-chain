# Semantic Chain

A word-linking game where you connect two unrelated words through a chain of semantically similar words. Each link in the chain must meet a minimum cosine similarity threshold with the previous word.

Built mainly as an excuse to play around with running transformer models via WASM in the browser.

**[Play it here →](https://semantic-chain.vercel.app/)**

## How it works

You get a start word and a target word. Type words one at a time — each word must be semantically close enough to the previous one (≥35% cosine similarity). Keep chaining until you reach the target. Fewer steps = better.

All inference runs client-side using [all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2) for sentence embeddings. Currently uses `@huggingface/transformers`, with plans to swap the backend to a Rust/WASM runtime via [tract](https://github.com/sonos/tract).

## Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- `@huggingface/transformers` (current embedding backend)
- tract + wasm-pack (planned)
- Deployed on [Vercel](https://vercel.com)

## Running locally
```bash
cd web
pnpm install
pnpm dev
```

The embedding model (~23MB) downloads on first load and is cached by the browser.

## Roadmap

- [ ] Replace HuggingFace Transformers.js with a tract-based WASM module (`tractjs`)
- [ ] Pull model weights out of the binary and fetch/cache separately
- [ ] Publish `tractjs` as a reusable npm package

## License

MIT