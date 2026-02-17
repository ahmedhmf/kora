# Ball Shop Frontend

A premium, modern, animation-rich brand website and e-commerce storefront for a sports ball brand. 
Built with Angular and Tailwind CSS, ready for Medusa backend integration.

## Features

- **Premium UI/UX:** High-end design with smooth animations and responsive layout.
- **Landing Page:** Story-driven content, product showcases, and trust signals.
- **Shop:** 
  - Product Listing with mock filtering and sorting.
  - Product Detail with gallery, variants, and cart actions.
  - Sidebar Cart drawer (mock).
- **Checkout:** Visual multi-step checkout flow.
- **Architecture:** 
  - Standalone Components.
  - Signal-based state management (Cart).
  - Clean separation of concerns (Features vs Shared).
- **Mock Mode:** Fully functional without a backend using `ProductService` and `CartService` mocks.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Application:**
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`.

3.  **Build for Production:**
    ```bash
    npm run build
    ```

## Medusa Integration

The frontend is designed to be easily connected to a Medusa backend.

-   **Product Service:** `src/app/shared/services/product.service.ts`
    -   Replace the mock data methods with HTTP calls to your Medusa Store API (e.g., `/store/products`).
-   **Cart Service:** `src/app/shared/services/cart.service.ts`
    -   Replace the local signal state with Medusa Cart calls (`/store/carts`).
-   **Authentication:** `src/app/features/account`
    -   Implement the login/register forms to hit Medusa Customer endpoints (`/store/auth`).

## Tech Stack

-   **Framework:** Angular 19+ (Standalone)
-   **Styling:** Tailwind CSS v4
-   **Icons:** SVGs (Lucide style)
-   **Fonts:** Outfit (Google Fonts)
