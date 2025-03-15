# Project Name

## Overview

This is a Gadget web application built with React, TypeScript, and Vite. It includes a server-side component and a client-side component, with configurations for Tailwind CSS and PostCSS.

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

## License

This project is licensed under the MIT License.