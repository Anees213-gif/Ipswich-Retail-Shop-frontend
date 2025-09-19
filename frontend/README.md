# Ipswich Retail - E-commerce Storefront

A modern, production-ready e-commerce storefront built with React, TypeScript, and Tailwind CSS. Designed to integrate seamlessly with a Django backend while providing a complete shopping experience.

## 🌟 Features

- **4 Core Pages**: Home, Product Listing, Product Detail, Cart/Checkout
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Dark/Light Mode**: Theme switching with system preference detection
- **Framework-Agnostic**: Easy backend integration via configurable API endpoints
- **State Management**: Zustand for cart state with localStorage persistence
- **Form Validation**: React Hook Form with Zod schema validation
- **SEO Optimized**: Semantic HTML, meta tags, and structured data

## 🚀 Quick Start

### Development Mode (Mock Data)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will use mock data when no API URL is configured, allowing frontend development without a backend.

### Production Mode (With Backend)
```bash
# Copy environment template
cp .env.example .env

# Configure your Django backend URL
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Start development server
npm run dev
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Django backend API base URL | No |

When `VITE_API_URL` is not set, the app automatically uses mock data for development.

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navbar.tsx      # Navigation component
│   └── ProductCard.tsx # Product display component
├── pages/              # Route components
│   ├── Index.tsx       # Home page
│   ├── Products.tsx    # Product listing
│   ├── ProductDetail.tsx # Product detail page
│   └── Cart.tsx        # Shopping cart & checkout
├── store/              # Zustand state management
├── lib/                # Utilities and API client
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

### Key Technologies
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for accessible UI components
- **Zustand** for state management
- **React Hook Form + Zod** for form handling
- **React Router** for navigation
- **Framer Motion** for animations

## 🛒 E-commerce Features

### Shopping Cart
- Persistent cart state with localStorage
- Quantity management
- Real-time total calculations
- Item removal and updates

### Product Catalog
- Grid and list view modes
- Advanced filtering (category, price, rating)
- Search functionality
- Sorting options
- Pagination

### Checkout Process
- Form validation with error handling
- Shipping address collection
- Order summary with tax/shipping calculations
- Mock payment processing (ready for real integration)

## 🔌 API Integration

The app uses a flexible API client (`src/lib/api.ts`) that supports:

### Mock Data Mode (Development)
When `VITE_API_URL` is not configured, the app uses comprehensive mock data including:
- 6 sample products across multiple categories
- Realistic product data with images, ratings, and specifications
- Category filtering and search functionality
- Pagination simulation

### Backend Integration
When connected to a Django backend, the API client expects these endpoints:

```
GET /api/products              # Product listing with filters
GET /api/products/{slug}       # Single product details
GET /api/categories           # Category list
POST /api/orders              # Order creation
```

### Expected API Response Format
```typescript
// Product List Response
{
  "data": {
    "products": Product[],
    "meta": {
      "page": number,
      "pageSize": number,
      "totalItems": number,
      "totalPages": number,
      "hasNext": boolean,
      "hasPrevious": boolean
    },
    "filters": {
      "categories": Category[],
      "priceRange": { "min": number, "max": number }
    }
  },
  "success": boolean
}
```

## 🎨 Design System

The app uses a comprehensive design system defined in `src/index.css` and `tailwind.config.ts`:

### Color Palette
- **Primary**: Sophisticated slate for main branding
- **Accent**: Warm orange for CTAs and highlights
- **Success**: Green for positive actions
- **Destructive**: Red for warnings and errors
- **Muted**: Subtle grays for secondary content

### Component Variants
Custom button and badge variants for e-commerce use cases:
- `Button` variants: `cta`, `cart`, `hero`
- `Badge` variants: `inStock`, `lowStock`, `outOfStock`, `sale`, `featured`

## ♿ Accessibility Features

- **WCAG 2.1 AA Compliant**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators
- **Skip Links**: Quick navigation for assistive technologies
- **Color Contrast**: Sufficient contrast ratios in all themes

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: Tailwind's responsive system
- **Touch-Friendly**: Appropriate touch targets
- **Adaptive Layout**: Components adapt to screen size

## 🧪 Testing

The project includes testing scaffolding for:
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E testing capabilities

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📈 Performance

- **Lighthouse Optimized**: Targets 85+ performance, 95+ accessibility
- **Image Optimization**: Lazy loading and proper sizing
- **Code Splitting**: Route-based splitting with React Router
- **Bundle Analysis**: Optimized dependencies

## 🚀 Deployment

The app is ready for deployment on any static hosting platform:

1. **Vercel/Netlify**: Zero-config deployment
2. **AWS S3 + CloudFront**: Static hosting with CDN
3. **Docker**: Container-ready for any platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@ipswichretail.com
- Documentation: Check the inline code comments
- Issues: Use GitHub issues for bug reports

---

Built with ❤️ using modern web technologies for a fast, accessible, and delightful shopping experience.