# Frontend Structure

The frontend is a React + Vite single page application.

## Main Folders

```txt
client/src/
  api/          Axios API service layer
  Assets/       Images and icons
  Components/   Reusable UI components
  Context/      Global state providers
  Hooks/        Reusable hooks
  Screens/      Route-level screens
  Styles/       CSS files by screen/component
  utils/        Pure helper functions
```

## Routing

File:

```txt
client/src/App.jsx
```

Routes:

| Route | Screen |
| --- | --- |
| `/` | `HomeScreen` |
| `/collections` | `CollectionScreen` |
| `/collections/product/:id` | `ProductScreen` |
| `/cart` | `CartScreen` |
| `/checkout` | `CheckoutScreen` |
| `/checkout/success` | `CheckoutStatusScreen` |
| `/checkout/failure` | `CheckoutStatusScreen` |
| `/checkout/pending` | `CheckoutStatusScreen` |
| `/account` | `AccountScreen` |
| `/user` | `UserProfileScreen` |
| `/dashboard` | `DashboardScreen` |

## Providers

File:

```txt
client/src/main.jsx
```

Provider order:

```txt
BrowserRouter
  QueryClientProvider
    AuthProvider
      ProductProvider
        CartProvider
          App
```

## API Layer

The app centralizes HTTP configuration in:

```txt
client/src/api/axios.js
```

It applies:

- `baseURL` from `VITE_API_URL`
- `withCredentials`
- JWT `Authorization` header
- logout cleanup on `401`

API modules:

| File | Responsibility |
| --- | --- |
| `api/auth.js` | Login, register, current user |
| `api/products.js` | Public product listing and detail |
| `api/cart.js` | Cart CRUD |
| `api/orders.js` | Checkout, order detail, current user orders |
| `api/dashboard.js` | Admin product management |

## State Management

### AuthContext

File:

```txt
client/src/Context/AuthContext.jsx
```

Responsibilities:

- Login
- Register
- Fetch current user
- Logout
- Persist JWT tokens in localStorage
- Expose `isAdmin` and `canManageCatalog`
- Store active store id

### CartContext

File:

```txt
client/src/Context/CartContext.jsx
```

Responsibilities:

- Local cart persistence
- Backend cart sync
- Add, remove, update and clear items
- Ensure backend cart exists before checkout

### ProductContext

File:

```txt
client/src/Context/ProductContext.jsx
```

Responsibilities:

- Product data used across storefront views
- Shared product loading state

## Components

### Storefront

| Component | Purpose |
| --- | --- |
| `Nav` | Main responsive navigation, cart and search entry points |
| `Header` | Sale/free-shipping banner |
| `ProductGrid` | Collection product grid |
| `ProductCard` | Product card UI |
| `CartSidebar` | Slide-out cart |
| `SearchDrawer` | Search overlay |
| `Footer` | Footer links |

### Checkout

| Component | Purpose |
| --- | --- |
| `CheckoutStatusLayout` | Shared layout for checkout result pages |
| `OrderSummary` | Purchased products summary |
| `PaymentStatusBadge` | Visual payment state |

### Dashboard

| Component | Purpose |
| --- | --- |
| `ProductsModule` | Product admin module |
| `ProductForm` | Product creation/edit form |
| `ProductTable` | Product listing |
| `ImageDropzone` | Image upload UI |
| `VariantEditor` | Variant editor |
| `InventoryModule` | Inventory view |
| `OrdersModule` | Orders view |
| `CouponsModule` | Coupons placeholder/module |

## Styling Strategy

The app currently uses CSS files grouped by responsibility:

```txt
Styles/
  account.css
  cart.css
  cart-side-bar.css
  checkout.css
  checkout-status-page.css
  dashboard.css
  homescreen.css
  nav-home.css
  product-screen.css
  search-drawer.css
  user-profile.css
```

Guidelines:

- Keep class names consistent and readable.
- Keep screen-level layout in screen CSS.
- Keep reusable component styles in component-specific CSS.
- Avoid introducing Tailwind until a project-wide migration decision is made.

## Production Improvements

- Add route guards for `/dashboard`.
- Add loading skeletons for collections.
- Add form schema validation.
- Add image lazy loading and responsive `srcset`.
- Add automated UI tests for cart and checkout.
