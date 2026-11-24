# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Fontes do dashboard

- Calendário histórico e voltas efetivamente completadas pelo vencedor: [resultados da Jolpica F1](https://api.jolpi.ca/ergast/f1/2024/results/1/), com dados de 2022 a 2024. As voltas mais rápidas vêm dos [resultados por ranking de volta](https://api.jolpi.ca/ergast/f1/2024/fastest/1/results/).
- Comprimento da volta: fichas de circuito da [Fórmula 1](https://www.formula1.com/en/racing/2024) e [media kit da FIA](https://api.fia.com/sites/default/files/2024_japanesegp_mediakit_full.pdf).
- Traçados: GeoJSON de [Tomislav Bacinger](https://github.com/bacinger/f1-circuits), projetado em linhas SVG. Consulte a [licença MIT dos dados](src/data/CIRCUIT-MAPS-LICENSE.md).
- Calendário, resultados de corrida e sprint, e classificações de pilotos e equipes de 2022 a 2026: [Jolpica F1](https://api.jolpi.ca/docs/). A evolução soma os pontos recebidos por etapa. As tabelas usam a classificação publicada pela API.
- Tempos por volta do vencedor ao selecionar um circuito, de 2023 em diante: [OpenF1](https://openf1.org/docs/).

O painel inclui uma cópia de segurança de 2026 verificada em 24/11/2026, até o GP de Las Vegas. A pontuação da sprint de Singapura nessa cópia foi conferida na [classificação oficial da Fórmula 1](https://www.formula1.com/en/results/2026/races/1296/singapore/sprint-results).
