# demo-assessment

GitHub Copilot code-review assistant extension built with Node.js and Express.

## Project Overview

This is a demonstration project featuring a GitHub Copilot code-review assistant extension. The application is built with modern Node.js (v20+) and includes both development and production configurations.

## Tech Stack

- **Runtime**: Node.js ≥ 20
- **Framework**: Express.js 4.19.2
- **Type Support**: TypeScript definitions available
- **SDK**: GitHub Copilot Extensions Preview SDK 5.0.1
- **Containerization**: Docker with multi-stage builds

## Repository Structure

- **Language Composition**: 90.2% JavaScript, 9.8% Dockerfile
- **Main Entry Point**: `src/index.js`
- **Configuration**: `package.json`
- **Deployment**: `Dockerfile`

## Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nisprksh/demo-assessment.git
cd demo-assessment
```

2. Install dependencies:
```bash
npm install
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the application in watch mode for development with automatic reload on file changes.

### Production
```bash
npm start
```
Starts the application in production mode.

### Testing
```bash
npm test
```
Runs the test suite using Node's built-in test runner.

## Running the Application

### Local Development
```bash
npm run dev
```
This will start the Express server with file watching enabled for rapid development.

### Production
```bash
npm start
```
Runs the application in production mode on the configured port (default: 3000).

## Docker Deployment

The project includes a multi-stage Dockerfile optimized for production:

### Build
```bash
docker build -t demo-assessment .
```

### Run
```bash
docker run -p 3000:3000 demo-assessment
```

The Docker configuration:
- Uses Alpine Linux for minimal image size
- Implements multi-stage build to reduce final image size
- Runs as non-root user (`appuser`) for security
- Exposes port 3000
- Sets `NODE_ENV=production` automatically

## API Endpoints

The Express server runs on port 3000 and provides:
- Code review capabilities via GitHub Copilot Extensions
- RESTful endpoints for integration

## Environment Variables

- `NODE_ENV`: Set to `production` by default in Docker
- `PORT`: Application port (default: 3000)

## Dependencies

### Production
- `@copilot-extensions/preview-sdk`: ^5.0.1 - GitHub Copilot Extensions SDK
- `express`: ^4.19.2 - Web application framework

### Development
- `@types/express`: ^4.17.21 - TypeScript definitions for Express

## Security

- Non-root user execution in Docker
- Minimal Alpine Linux base image
- Production dependencies only in runtime image

## Contributing

1. Create a new branch for your feature or fix
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

## License

Check the repository for license information.

## Support

For issues, questions, or contributions, please open an issue in the repository.
