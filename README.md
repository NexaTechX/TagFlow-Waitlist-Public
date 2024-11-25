# TagFlow Waitlist

A waitlist application for TagFlow with admin dashboard and email notifications.

## Features

- User waitlist registration
- Admin dashboard
- Email notifications
- Dark/Light mode
- Comment system
- Responsive design

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file based on `.env.example`
4. Run development server: `npm run dev`

## Environment Variables

Required environment variables:
- `VITE_ADMIN_PASSWORD`
- `VITE_EMAIL_SERVICE_ID`
- `VITE_EMAIL_TEMPLATE_ID`
- `VITE_EMAIL_PUBLIC_KEY`
- `VITE_WELCOME_TEMPLATE_ID`
- `VITE_UPDATE_NOTIFICATION_TEMPLATE_ID`

## Deployment

This project is configured for deployment on Vercel. 