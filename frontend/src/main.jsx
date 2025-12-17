import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { RouterProvider } from 'react-router-dom'
import router from './routes.jsx'
import './index.css'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const MissingKeyError = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md bg-gray-800 p-8 rounded-xl border border-red-500 shadow-2xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h2>
            <p className="mb-4 text-gray-300">The <code>VITE_CLERK_PUBLISHABLE_KEY</code> is missing.</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
                <li>Open <code>frontend/.env.local</code></li>
                <li>Add your Clerk Publishable Key: <br /><code className="bg-gray-900 p-1 rounded">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code></li>
                <li>Restart the server</li>
            </ol>
        </div>
    </div>
)

ReactDOM.createRoot(document.getElementById('root')).render(
    !PUBLISHABLE_KEY ? (
        <MissingKeyError />
    ) : (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <RouterProvider router={router} />
        </ClerkProvider>
    )
)
