# Notebook App

A Vue 3 + TypeScript notebook application with authentication and CRUD operations for notes.

## Demo

🔗 [Live Demo](https://notebook-two-azure.vercel.app/login)


## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn-vue UI components
│   ├── auth/            # Authentication components
│   ├── notes/            # Notes components
│   └── layout/           # Layout components
├── views/                # Page views
├── stores/               # Pinia stores
├── services/             # API services (mock)
│   ├── api/              # Mock API services
│   └── types/            # TypeScript types
├── router/               # Vue Router configuration
├── utils/                # Utility functions
└── assets/               # CSS and static assets
```

## Usage

1. Register a new account or login with existing credentials
2. Create notes with title (required) and content (optional)
3. View, edit, or delete your notes
4. Search and sort notes using the controls in the notes list


## License

MIT
