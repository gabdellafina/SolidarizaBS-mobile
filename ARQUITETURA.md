# SolidarizaBS Mobile — Arquitetura

## Stack
- React + Vite (mesmo da web)
- Tailwind CSS
- React Router DOM
- React Hook Form + Zod
- Zustand
- Axios
- Capacitor (wrapper nativo)
- react-hot-toast
- clsx, date-fns, lucide-react

## Instalação
```bash
npm create vite@latest solidarizabs-mobile -- --template react
cd solidarizabs-mobile
npm install react-router-dom react-hook-form @hookform/resolvers zod zustand axios clsx date-fns react-hot-toast lucide-react
npm install -D tailwindcss @tailwindcss/vite

# Capacitor (após build funcionar)
npm install @capacitor/core @capacitor/cli
npx cap init SolidarizaBS com.solidarizabs.app --web-dir dist
npm install @capacitor/android @capacitor/ios @capacitor/clipboard @capacitor/status-bar
npx cap add android
```

## Estrutura
```
src/
├── main.jsx
├── App.jsx
├── index.css
├── assets/logo.svg
├── data/            ← mesmos mocks da web (copiar)
├── utils/           ← mesmos utils da web (copiar)
├── schemas/         ← mesmos schemas da web (copiar)
├── services/        ← mesmos services da web (copiar)
├── store/           ← mesmos stores da web (copiar)
├── hooks/           ← mesmos hooks da web (copiar)
├── components/
│   ├── ui/          ← mesmos da web (copiar)
│   ├── cards/
│   │   ├── OngCard.jsx        (adaptado mobile)
│   │   └── CampanhaCard.jsx   (com botão doar)
│   ├── forms/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterDoadorForm.jsx
│   │   └── RegisterOngForm.jsx
│   └── layout/
│       └── BottomNav.jsx      (NOVO - nav inferior)
├── pages/
│   ├── SplashPage.jsx         (NOVO - tela inicial)
│   ├── LoginPage.jsx
│   ├── CadastroPage.jsx
│   ├── HomePage.jsx           (projetos com filtros)
│   ├── OngDetailPage.jsx      (com doação Pix)
│   ├── PerfilPage.jsx         (NOVO - perfil do usuário)
│   └── DoacaoPage.jsx         (NOVO - gerar Pix)
└── routes/
    └── index.jsx
```
