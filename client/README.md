# GoalifyInvest Frontend

A beautiful, modern React frontend for GoalifyInvest - the student investment platform that makes investing personal and motivating.

## 🎨 Features

### Landing Page
- **Hero Section** - Compelling value proposition with clear call-to-action
- **Feature Grid** - Highlights key benefits of the platform
- **Modern Design** - Clean, professional interface with gradient backgrounds

### User Registration
- **Simple Form** - Name, email, and starting cash balance
- **Real-time Validation** - Form validation with helpful error messages
- **Smooth Transitions** - Animated transitions between views

### Dashboard
- **Goal Overview** - Visual progress tracking for each investment goal
- **Progress Bars** - Dynamic progress indicators showing completion percentage
- **Goal Creation** - Modal-based goal creation with smart portfolio recommendations
- **Portfolio Types** - Automatic recommendation based on timeline

### Smart Features
- **Portfolio Recommendation** - Automatically suggests portfolio type based on goal timeline
- **Visual Progress** - Beautiful progress bars and completion percentages
- **Responsive Design** - Mobile-first design that works on all devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Backend server running on port 3001

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Running with Backend
From the project root:
```bash
# Run both frontend and backend
npm run dev:all
```

## 🎯 User Flow

1. **Landing Page** - User sees compelling value proposition
2. **Registration** - Simple form to create account with starting cash
3. **Dashboard** - View existing goals and create new ones
4. **Goal Creation** - Define goal with smart portfolio recommendation
5. **Progress Tracking** - Visual progress bars and growth tracking

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3b82f6 to #1e40af)
- **Success**: Green (#22c55e)
- **Background**: Light gray (#f9fafb)
- **Text**: Dark gray (#111827)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large sizes
- **Body**: Regular weight, readable sizes

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Primary and secondary styles
- **Forms**: Clean inputs with focus states
- **Modals**: Overlay with backdrop blur

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Breakpoints** - sm (640px), md (768px), lg (1024px)
- **Flexible Grid** - Responsive grid layouts
- **Touch Friendly** - Large touch targets for mobile

## 🔧 Technical Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls

## 🎯 Key Components

### App.jsx
Main application component with routing logic and state management.

### Landing Page
- Hero section with value proposition
- Feature grid highlighting benefits
- Call-to-action buttons

### Registration Form
- User input form
- Form validation
- API integration

### Dashboard
- Goal overview cards
- Progress tracking
- Goal creation modal

## 🚀 Next Steps

- [ ] Add funding interface for adding money to goals
- [ ] Implement projection power-up modal
- [ ] Add goal templates for common student goals
- [ ] Implement multiple goals management
- [ ] Add goal editing and deletion
- [ ] Implement goal sharing features

## 🎉 Ready to Use!

The frontend is fully functional and ready to use with your backend API. All core features from the PRD are implemented with a beautiful, modern interface that students will love!