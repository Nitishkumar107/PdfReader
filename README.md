# Voice Reader AI

A web application to read PDF/text files with voice, offering voice customization, translation, and summarization.

## Prerequisites

-   Python 3.8+
-   Node.js 16+
-   npm

## Project Structure

-   `backend/`: FastAPI application (Python)
-   `frontend/`: React application (Vite)

## Setup & Run Instructions

### 1. Backend (Python/FastAPI)

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
```

Create a virtual environment (optional but recommended):

```bash
python -m venv venv
```

Activate the virtual environment:

-   **Windows**:
    ```bash
    .\venv\Scripts\activate
    ```
-   **macOS/Linux**:
    ```bash
    source venv/bin/activate
    ```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the server:

```bash
python main.py
```

The backend will start at `http://localhost:8000`.

### 2. Frontend (React/Vite)

Open a **new** terminal and navigate to the `frontend` directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will start at `http://localhost:5173`.

## Usage

1.  Open `http://localhost:5173` in your browser.
2.  Upload a PDF or Text file.
3.  Select a **Voice** from the dropdown.
4.  Click **Read Aloud** to listen to the text.
5.  Use **Translate To** to translate the text.
6.  Click **Generate AI Summary** to get a summary (requires OpenAI API Key in `.env`).
