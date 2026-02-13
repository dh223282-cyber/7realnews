# 7RealNews - Next.js News Application

Based on Next.js 14/15, Tailwind CSS, and Firebase.

## Setup Instructions

1.  **Environment Variables**:
    Create `.env.local` based on `.env.local.example` with your Firebase credentials.
    Ensure Firestore rules are set to `allow read: if true;`.

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

## Features

-   **Bilingual Toggle**: Switch between English and Tamil (UI).
-   **Admin Dashboard**: Secure login via Firebase Auth. accessible at `/admin`.
-   **News Editor**: Includes `react-transliterate` for Tamil input.
-   **Dynamic Ads**: Manage via Admin dashboard, injects after 3rd post.
-   **SSR & SEO**: Server-side rendering for news feed and details.

## Project Structure

-   `src/app`: Page routes (App Router).
-   `src/components`: UI components (Navbar, NewsCard, Admin forms).
-   `src/context`: Language context provider.
-   `src/lib`: Firebase config and utilities.
-   `src/locales`: Translation files.
# 7realnews
