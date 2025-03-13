# Feedit App

Feedit is a Reddit Clone application built with modern web technologies. This project aims to replicate the core functionalities of Reddit, allowing users to create posts, comment, and interact with each other.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Prisma**: An ORM for Node.js and TypeScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Radix UI**: A set of accessible, unstyled components for building high-quality design systems and web apps.
- **React Hook Form**: A library for managing form state in React.
- **Axios**: A promise-based HTTP client for the browser and Node.js.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **NextAuth.js**: Authentication for Next.js applications.
- **Upstash Redis**: A serverless Redis database for caching and real-time data.
- **UploadThing**: A library for handling file uploads in React.
- **Editor.js**: A block-styled editor for rich text content.
- **Lucide Icons**: A library of beautiful & consistent icon sets.
- **Date-fns**: A modern JavaScript date utility library.
- **Sharp**: A high-performance image processing library.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/feedit-app.git
    cd feedit-app
    ```

2. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```

3. Set up environment variables:
    - Copy `.env.example` to `.env` and fill in the required values.

4. Generate Prisma client:
    ```sh
    npx prisma generate
    ```

### Running the App

- Development mode:
    ```sh
    npm run dev
    # or
    yarn dev
    ```

- Production mode:
    ```sh
    npm run build
    npm start
    # or
    yarn build
    yarn start
    ```

### Linting

- To lint the codebase, run:
    ```sh
    npm run lint
    # or
    yarn lint
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.