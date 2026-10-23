# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

The storefront can be previewed without Supabase; it loads with an empty catalogue. To show live dashboard content, configure `SUPABASE_URL` and `SUPABASE_KEY` (or `SUPABASE_PUBLISHABLE_KEY`) in `.env`. Browser auth also needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Use only a publishable/anon key for `SUPABASE_KEY`, never a service-role secret.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
