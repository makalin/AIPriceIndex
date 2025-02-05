# AI Price Index

A real-time dashboard for tracking and comparing prices across different AI model providers (OpenAI, Anthropic, Google, Mistral).

## Features

- 📊 Real-time price tracking for major AI model providers
- 📈 Historical price trends and comparisons
- 🔔 Price change alerts and notifications
- 🔍 Search and filter capabilities
- 📱 Responsive design for all devices
- 🔒 Authentication system for admin access

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL
- JWT Authentication
- Winston Logger

### Frontend
- Next.js
- React
- TypeScript
- Chart.js
- Tailwind CSS

### Infrastructure
- Docker
- GitHub Actions for CI/CD
- Node.js 18+

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 15 or higher
- npm or yarn

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-price-index.git
cd ai-price-index
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables:

Backend (.env):
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/aipriceindex
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
MISTRAL_API_KEY=your_mistral_key

# Email notifications
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Slack notifications
SLACK_TOKEN=your_slack_token
SLACK_CHANNEL=price-alerts
```

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Running the Application

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000/api

### Docker Setup

1. Build and run using Docker Compose:
```bash
docker-compose up --build
```

## API Documentation

### Endpoints

#### Prices
- `GET /api/prices/current` - Get current prices for all models
- `GET /api/prices/history` - Get historical prices for a specific model
- `GET /api/prices/provider/:provider` - Get prices for a specific provider

#### Alerts
- `GET /api/alerts/recent` - Get recent price change alerts
- `POST /api/alerts/subscribe` - Subscribe to price alerts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI API Documentation
- Anthropic API Documentation
- Google AI Documentation
- Mistral AI Documentation

## Contact

Project Link: [https://github.com/makalin/AIPriceIndex](https://github.com/makalin/AIPriceIndex)
