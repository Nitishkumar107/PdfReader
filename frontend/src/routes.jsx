import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import App from './App';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { Pricing } from './pages/pricing';
import LandingPage from './pages/LandingPage';

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <SignedIn>
                    <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                    <LandingPage />
                </SignedOut>
            </>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <>
                <SignedIn>
                    <App />
                </SignedIn>
                <SignedOut>
                    <RedirectToSignIn redirectUrl="/sign-in" />
                </SignedOut>
            </>
        )
    },
    {
        path: "/sign-in/*",
        element: <SignInPage />,
    },
    {
        path: "/sign-up/*",
        element: <SignUpPage />,
    },
    {
        path: "/pricing",
        element: <Pricing />,
    },

]);

export default router;
