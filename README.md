# SmartLog

Versão técnica, estática e pronta para GitHub Pages.

## O que tem nesta versão

- Site 100% estático: `index.html`, imagens e arquivos PWA.
- Visual responsivo para abrir bem no celular durante a apresentação.
- PWA simples com `manifest.webmanifest`, ícone e cache offline em `sw.js`.
- Conteúdo, busca, filtros, quiz, glossário, Canvas e equipe.
- Demonstração local com `localStorage`, exportação e importação em JSON.

## Como hospedar no GitHub Pages

1. Envie todos os arquivos desta pasta para o repositório `smartlog-site`.
2. No GitHub, abra `Settings`.
3. Entre em `Pages`.
4. Em `Build and deployment`, selecione:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Clique em `Save`.

A URL deve ficar parecida com:

```txt
https://kaykabreu132-cloud.github.io/smartlog-site/
```

## Limite importante

GitHub Pages não tem banco de dados nem servidor. Por isso, posts e mural da demonstração ficam só no navegador de quem está usando. Para sincronizar dados entre várias pessoas, uma versão futura precisa de backend, Supabase, Firebase ou outro serviço externo.
