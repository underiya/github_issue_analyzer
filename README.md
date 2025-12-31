# GitHub Issue Analyzer

A robust NestJS-based service that fetches GitHub issues from repositories, caches them locally using SQLite for persistence, and provides intelligent analysis using Google's Gemini LLM. This tool helps maintainers and developers gain insights from their project's issue tracker through natural language queries.

## Features

- **Repository Scanning**: Fetch all open issues from any public GitHub repository with automatic pagination and rate limit handling
- **Local Caching**: Persistent storage using SQLite database for offline analysis and performance
- **LLM-Powered Analysis**: Leverage Google Gemini 2.5 Flash for intelligent issue analysis and insights
- **RESTful API**: Clean, documented endpoints for integration with other tools
- **Error Handling**: Comprehensive error handling for API failures, rate limits, and invalid inputs
- **TypeScript**: Fully typed codebase with modern development practices

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Google Gemini API key (obtain from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/underiya/github_issue_analyzer
   cd github_issue_analyzer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

   > **Note**: Replace `your_gemini_api_key_here` with your actual Gemini API key.

## Usage

### Running the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The server will start on the port specified in your `.env` file (default: 3000).

### API Endpoints

#### POST /scan

Fetches and caches all open issues from a specified GitHub repository.

**Request Body:**

```json
{
  "repo": "owner/repository-name"
}
```

**Response:**

```json
{
  "repo": "owner/repository-name",
  "issues_fetched": 42,
  "cached_successfully": true
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/scan \
  -H "Content-Type: application/json" \
  -d '{"repo": "microsoft/semantic-kernel"}'
```

#### POST /analyze

Analyzes cached issues using a natural language prompt and returns LLM-generated insights.

**Request Body:**

```json
{
  "repo": "owner/repository-name",
  "prompt": "Summarize the most common issues and suggest priority fixes"
}
```

**Response:**

```json
{
  "analysis": "Based on the 42 open issues analyzed, the most common themes are...\n\nPriority recommendations:\n1. Fix authentication bugs (5 issues)\n2. Improve documentation (3 issues)\n..."
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "microsoft/semantic-kernel",
    "prompt": "What are the top 3 most reported bugs?"
  }'
```

## Error Handling

The service includes comprehensive error handling for common scenarios:

- **Repository not found (404)**: Invalid repository name or private repository
- **Rate limiting (403)**: GitHub API rate limit exceeded
- **No cached issues**: Attempting analysis before scanning
- **Invalid repository format**: Must be in `owner/repo` format
- **LLM service errors**: Gemini API failures or invalid API key
- **Network errors**: Connectivity issues with GitHub API

All errors return appropriate HTTP status codes and descriptive error messages.

## Project Structure

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application bootstrap
├── controllers/
│   └── app.controller.ts      # Main API controller
├── services/
│   ├── app.service.ts         # Main business logic
│   ├── database.service.ts    # TypeORM database operations
│   ├── github.service.ts      # GitHub API integration
│   └── llm.service.ts         # Google Gemini LLM integration
├── entities/
│   ├── repository.entity.ts   # Repository TypeORM entity
│   ├── issue.entity.ts        # Issue TypeORM entity
│   └── index.ts               # Entity exports
├── dtos/
│   ├── dtos.ts                # Data transfer objects
│   ├── types.ts               # TypeScript interfaces
│   └── index.ts               # DTO exports
└── .env                       # Environment variables (not committed)
```

## Technologies Used

- **NestJS**: Progressive Node.js framework for building efficient server-side applications
- **TypeScript**: Typed superset of JavaScript for better development experience
- **SQLite**: Lightweight, file-based database for local caching
- **TypeORM**: Object-relational mapping for TypeScript and JavaScript
- **Google Gemini**: Advanced LLM for natural language processing and analysis
- **Axios**: Promise-based HTTP client for API requests
- **Class Validator/Transformer**: Data validation and transformation utilities

## Storage Architecture

The application uses TypeORM with SQLite for local data persistence. TypeORM provides object-relational mapping with the following entities:

- **Repository Entity**: Stores repository metadata with auto-generated ID and timestamps
- **Issue Entity**: Stores individual GitHub issues with foreign key relationship to repositories
- **Relationships**: One-to-many relationship between Repository and Issue entities

Benefits of SQLite choice:

- Zero-configuration setup
- ACID compliance for data integrity
- Cross-platform compatibility
- Single file database for easy backup
- No external dependencies required

## Development

### Scripts

- `npm run build` - Build the application
- `npm run format` - Format code with Prettier
- `npm run start` - Start in production mode
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start production build
- `npm run lint` - Run ESLint with auto-fix

### Code Quality

The project includes:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## Configuration

Environment variables:

- `GEMINI_API_KEY`: Required API key for Google Gemini
- `PORT`: Server port (default: 3000)
