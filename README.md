# Article Simplifier

## Demo URL
https://article-simplifier.gadget.app/

## Overview

Article Simplifier is a powerful web application that transforms complex articles and text content into easier-to-understand versions. Built on the Gadget platform using React, TypeScript, and Vite, it helps users quickly comprehend difficult content by simplifying language, reducing complexity, and highlighting key information.

The application uses advanced natural language processing techniques to maintain the core meaning of content while making it more accessible to a wider audience. Whether you're a student trying to understand academic papers, a professional dealing with technical documents, or anyone who encounters complex written content, Article Simplifier streamlines your reading experience.

## Project Structure

```
.gitignore
components.json
package.json
postcss.config.js
react-router.config.ts
settings.gadget.ts
tailwind.config.ts
tsconfig.api.json
tsconfig.json
tsconfig.web.json
vite.config.mts
.gadget/
    sync.json
    client/
        package.json
        tsconfig.json
        dist-cjs/
        dist-esm/
        src/
        types/
        types-esm/
    server/
.react-router/
    types/
accessControl/
    permissions.gadget.ts
    filters/
api/
    actions/
    models/
    routes/
web/
    api.ts
    app.css
    root.tsx
    routes.ts
    vite-env.d.ts
    components/
    lib/
    routes/
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd <project-directory>
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

### Running the Project

To start the development server, run:
```sh
npm run dev
```
or
```sh
yarn dev
```

### Building the Project

To build the project for production, run:
```sh
npm run build
```
or
```sh
yarn build
```

## Project Configuration

- **Tailwind CSS**: Configured in `tailwind.config.ts`
- **PostCSS**: Configured in `postcss.config.js`
- **TypeScript**: Configured in `tsconfig.json`, `tsconfig.api.json`, and `tsconfig.web.json`
- **Vite**: Configured in `vite.config.mts`
- **Gadget**: Backend functionality configured in `.gadget/` directory

## Development Guidelines

### Code Style

This project follows standard TypeScript and React best practices:
- Use functional components with hooks
- Follow the ESLint configuration for code style
- Write tests for new features

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Backend Development

- API routes are defined in `api/routes/`
- Models are defined in `api/models/`
- Custom actions are defined in `api/actions/`

### Frontend Development

- React components are located in `web/components/`
- Page routes are defined in `web/routes/`
- Utility functions are in `web/lib/`

## Troubleshooting

### Common Issues

- **API Key Problems**: Ensure all required API keys are properly set in your `.env` file
- **CORS Issues**: When testing locally, you may need to enable CORS in your browser or use a CORS proxy
- **Simplification Quality**: Adjust the simplification level in settings for better results
- **Major Failure Points**: This app is experimental, and incomplete. Major functionalities such as text-extraction, NLP & Interpretation do not work.

### Getting Help

If you encounter issues not covered in this documentation, please:
1. Check existing GitHub issues
3. Open a new issue with detailed reproduction steps

## Contact

GitHub Repository: [article-simplifier](https://github.com/DerekY2/Article-Simplifier)
