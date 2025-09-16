# Privacy Data Monetization Platform

## Overview

This is a full-stack privacy data monetization platform called "MindShield" that allows users to control and monetize their digital footprint. The platform enables users to grant selective data access permissions to companies in exchange for monthly payments, with all transactions managed through both traditional payment processing (Stripe) and blockchain technology (Polygon). Users can monitor their privacy score, track earnings, and manage data permissions through an intuitive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React + TypeScript**: Modern React application with TypeScript for type safety
- **Vite**: Fast development server and build tool with hot module replacement
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible interface
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: TanStack Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for robust form handling

### Backend Architecture
- **Express.js**: RESTful API server with TypeScript support
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Middleware**: Custom authentication middleware for protected routes
- **Error Handling**: Centralized error handling with structured error responses

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Schema**: Well-defined database schema with relationships for users, permissions, earnings, and privacy footprints
- **Migrations**: Drizzle Kit for database schema migrations

### Payment Processing
- **Stripe Integration**: Complete payment processing with customer management, payment intents, and subscription handling
- **Checkout Flow**: Stripe Elements for secure payment collection
- **Multi-currency**: Support for Indian Rupees (paise as base unit)

### Blockchain Integration
- **Smart Contracts**: Solidity contracts deployed on Polygon Mumbai testnet for transparent data licensing
- **Hardhat**: Development framework for contract compilation, testing, and deployment
- **Web3 Functions**: Contract functions for user registration, access granting/revoking, and payments
- **Network Support**: Multi-network support (Mumbai testnet, Polygon mainnet)

### Key Features
- **Privacy Dashboard**: Real-time privacy score monitoring and data footprint visualization
- **Permission Management**: Granular control over data access permissions with company-specific settings
- **Earnings Tracking**: Comprehensive earnings history and payment status tracking
- **Blockchain Transparency**: All major transactions recorded on blockchain for transparency
- **Payment Integration**: Seamless fiat-to-crypto payment processing

## External Dependencies

### Payment Services
- **Stripe**: Payment processing, customer management, and subscription billing
- **Stripe Elements**: Secure payment form components

### Blockchain Infrastructure
- **Polygon Network**: Layer 2 scaling solution for Ethereum
- **Hardhat**: Ethereum development environment
- **Ethers.js**: Ethereum library for smart contract interactions

### Database Services
- **Neon**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database toolkit

### UI and Styling
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the application
- **ESBuild**: Fast JavaScript bundler for production builds