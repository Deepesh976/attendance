# Biometric Application

A web application for managing employee biometric data, salary information, and activity tracking.

## Docker Setup

This project is containerized using Docker for easy development and deployment.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd bio
   ```

2. Create an environment file:
   ```
   cp env.example .env
   ```
   Edit the `.env` file and update the variables as needed.

3. Build and start the containers:
   ```
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000/api

### Development Workflow

- View logs: `docker-compose logs -f`
- Stop containers: `docker-compose down`
- Rebuild containers: `docker-compose up -d --build`

## Project Structure

- **Backend**: Node.js/Express API with MongoDB
  - Located in the `/backend` directory
  - API endpoints for employee management, salary processing, and authentication

- **Frontend**: React application
  - Located in the `/frontend` directory
  - User interface for managing employees, salaries, and activities

## Deployment

For detailed deployment instructions, refer to the [docker-setup.md](docker-setup.md) file.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGO_USERNAME | MongoDB username | admin |
| MONGO_PASSWORD | MongoDB password | - |
| MONGO_URI | MongoDB connection string | mongodb://admin:password@mongodb:27017/biometric?authSource=admin |
| JWT_SECRET | Secret for JWT tokens | - |
| NODE_ENV | Environment (development/production) | development |

## License

[ISC License](LICENSE) 