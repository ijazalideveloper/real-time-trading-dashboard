# Real-Time Trading Dashboard

A modern, real-time stock trading dashboard built with Next.js 16, featuring live price updates, interactive charts, and price alerts. The application provides a comprehensive view of popular stocks with real-time data from Finnhub API.

## 🚀 Demo

[Live Demo](https://real-time-trading-dashboard.vercel.app/)

<img width="1701" height="883" alt="Trading Dashboard Screenshot" src="https://github.com/user-attachments/assets/53811708-ab6f-498e-a1b8-2db6e5845855" />

## ✨ Features

### Core Features
- **Real-time Stock Data**: Live price updates via WebSocket connection
- **Interactive Charts**: Dynamic price charts with multiple time ranges (1D, 1W, 1M, 3M)
- **Price Alerts**: Set custom price alerts with above/below conditions
- **Market Status**: Real-time market status indicator
- **Responsive Design**: Fully responsive layout for desktop and mobile
- **Authentication**: Protected routes with user authentication
- **Dark/Light Theme**: Modern UI with theme support

### Stock Features
- Popular stocks tracking (AAPL, GOOGL, MSFT, AMZN, TSLA, NVDA, META, JPM)
- Real-time price updates with percentage changes
- Volume and market cap information
- Company logos and sector information
- Historical price data visualization

### Technical Features
- **WebSocket Integration**: Real-time data streaming from Finnhub
- **Caching**: Optimized API calls with React cache
- **Error Handling**: Robust error handling and fallbacks
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives
- **Charts**: Recharts 2.15.4
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend & APIs
- **API**: Finnhub Stock API
- **WebSocket**: Finnhub WebSocket for real-time data
- **HTTP Client**: Axios

### Development Tools
- **Package Manager**: PNPM
- **Build Tool**: Next.js built-in bundler
- **Linting**: ESLint (Next.js config)
- **Type Checking**: TypeScript 5

## 📁 Project Structure

```
real-time-trading-dashboard/
├── app/                          # Next.js App Router
│   ├── favicon.ico
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── common/                  # Shared components
│   │   └── header/
│   │       └── Header.tsx
│   ├── ui/                      # UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── alert-toast.tsx          # Toast notifications
│   ├── login-form.tsx           # Authentication form
│   ├── market-stats.tsx         # Market statistics
│   ├── price-alert-panel.tsx    # Price alerts management
│   ├── price-chart.tsx          # Interactive price charts
│   ├── protected-route.tsx      # Route protection
│   ├── ticker-list.tsx          # Stock ticker list
│   ├── trading-dashboard.tsx    # Main dashboard
│   └── user-menu.tsx            # User menu
├── contexts/                    # React contexts
│   └── auth-context.tsx         # Authentication context
├── features/                    # Feature-based modules
│   ├── alerts/
│   ├── auth/
│   ├── cache/
│   └── trading/
├── hooks/                       # Custom React hooks
│   ├── useChartData.ts          # Chart data management
│   ├── useLogin.ts              # Authentication logic
│   ├── useMarketStatus.ts       # Market status
│   ├── usePriceAlerts.ts        # Price alerts logic
│   ├── useStocks.ts             # Stock data management
│   └── useWebSocketData.ts      # WebSocket connection
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client and endpoints
│   ├── auth-types.ts            # Authentication types
│   ├── mock-data.ts             # Mock data for development
│   ├── price-alerts.ts          # Price alerts utilities
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
├── styles/                      # Additional styles
└── Configuration files
    ├── .env                     # Environment variables
    ├── .env.local              # Local environment variables
    ├── next.config.ts          # Next.js configuration
    ├── tailwind.config.ts      # Tailwind CSS configuration
    ├── tsconfig.json           # TypeScript configuration
    └── package.json            # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PNPM (recommended) or npm/yarn
- Finnhub API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/real-time-trading-dashboard.git
   cd real-time-trading-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key_here
   NEXT_PUBLIC_FINNHUB_BASE_URL=https://finnhub.io/api/v1
   ```

   Get your free API key from [Finnhub](https://finnhub.io/register)

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FINNHUB_API_KEY` | Your Finnhub API key | Yes |
| `NEXT_PUBLIC_FINNHUB_BASE_URL` | Finnhub API base URL | Yes |

### API Configuration

The application uses Finnhub API for:
- Real-time stock quotes
- Company profiles and logos
- Market status
- WebSocket real-time data streaming

## 📊 Key Components

### TradingDashboard
Main dashboard component that orchestrates all features:
- Stock selection and filtering
- Real-time price updates
- Chart visualization
- Price alerts management

### PriceChart
Interactive chart component featuring:
- Multiple time ranges (1D, 1W, 1M, 3M)
- Real-time price updates
- Responsive design
- Tooltip with detailed information

### PriceAlertPanel
Price alerts management:
- Set alerts above/below target prices
- Visual indicators for triggered alerts
- Alert history and management

### WebSocket Integration
Real-time data streaming:
- Automatic connection management
- Symbol subscription/unsubscription
- Error handling and reconnection

## 🎨 Styling

The application uses:
- **Tailwind CSS 4.1.9** for utility-first styling
- **CSS Variables** for theme customization
- **Radix UI** for accessible component primitives
- **Lucide React** for consistent iconography

## 🔒 Authentication

The application includes:
- Protected route wrapper
- User authentication context
- Login/logout functionality
- Session management

## 📱 Responsive Design

Optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Finnhub](https://finnhub.io/) for providing the stock market API
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Recharts](https://recharts.org/) for the charting library

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [documentation](https://nextjs.org/docs)
- Review the [API documentation](https://finnhub.io/docs/api)

---

**Built with ❤️ using Next.js 16 and TypeScript**
