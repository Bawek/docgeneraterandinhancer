# DocuMind AI - Document Generator & Enhancer

A modern Next.js application that allows you to upload documents and enhance them using AI. Features include text enhancement, summarization, key point extraction, AI chat, document comparison, and more powered by OpenAI.

## Features

### Core Functionality
- **Multi-Format Upload**: Drag-and-drop or click to upload PDF, DOCX, and TXT documents
- **Text Extraction**: Automatically extracts text from uploaded documents
- **AI Enhancement**: Three enhancement modes:
  - **Enhance Text**: Improves clarity, readability, and professionalism
  - **Summarize**: Generates concise summaries of documents
  - **Extract Key Points**: Identifies and lists important points
- **AI Chat Interface**: Real-time conversational AI for document interaction
- **Document History**: Persistent storage of documents and enhancement history
- **Document Comparison**: Compare different enhancement results side-by-side
- **Copy & Download**: Easily copy enhanced text or download as a file
- **Dark Mode**: Full dark mode support with enhanced theming

### Modern UI/UX
- **Animated Interfaces**: Smooth animations using Framer Motion
- **Responsive Design**: Mobile-friendly layout
- **Modern Styling**: Gradient backgrounds, glassmorphism effects, and contemporary design
- **Enhanced Loading States**: Skeleton loaders and animated spinners
- **Tabbed Interface**: Easy navigation between different features
- **Toast Notifications**: User feedback for success, error, and info events

### Robustness Features
- **File Size Validation**: Client and server-side validation (max 10MB)
- **Rate Limiting**: IP-based rate limiting on API routes
- **Input Sanitization**: Removes control characters and prevents injection attacks
- **Text Length Validation**: Validates text length before API calls (max 100,000 characters)
- **Retry Logic**: Automatic retry with exponential backoff for failed API calls (max 3 retries)
- **Error Handling**: Comprehensive error boundary for React errors
- **Type Safety**: Full TypeScript implementation
- **Persistent Storage**: Document history saved to local storage

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Document Enhancement
1. Upload a document (PDF, DOCX, or TXT) by dragging and dropping or clicking the upload area
2. Choose an enhancement option:
   - **Enhance Text**: Improves the document's writing quality
   - **Summarize**: Creates a concise summary
   - **Extract Key Points**: Lists the main points
3. View the results in the tabbed interface
4. Copy to clipboard or download as a text file

### AI Chat
1. Switch to the "Chat" tab
2. Ask questions about your uploaded document or request improvements
3. The AI assistant will provide contextual responses based on your document

### Document History
1. Switch to the "History" tab
2. View all uploaded documents and enhancement history
3. Select previous documents or enhancements to work with
4. Delete items you no longer need

### Document Comparison
1. Switch to the "Compare" tab
2. Select two different enhancement results
3. Compare them side-by-side to analyze differences

## Tech Stack

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Zustand**: State management with persistence
- **OpenAI API**: AI-powered text processing
- **pdfjs-dist**: PDF text extraction
- **mammoth**: DOCX text extraction
- **Lucide React**: Icons
- **shadcn/ui**: UI components

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── enhance/route.ts    # OpenAI enhancement endpoint
│   │   ├── parse-pdf/route.ts  # Document parsing endpoint (PDF, DOCX, TXT)
│   │   └── chat/route.ts       # AI chat endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page with tabbed interface
│   └── globals.css             # Global styles with enhanced theming
├── components/
│   ├── ui/                     # Reusable UI components (Button, Card, Tabs, etc.)
│   ├── DocumentUpload.tsx      # Enhanced file upload component
│   ├── EnhancementOptions.tsx   # Modern enhancement selection
│   ├── ResultDisplay.tsx       # Tabbed results display
│   ├── AIChat.tsx              # Real-time AI chat interface
│   ├── DocumentHistory.tsx     # Document and enhancement history
│   ├── DocumentComparison.tsx  # Side-by-side comparison tool
│   ├── ErrorBoundary.tsx       # Error handling component
│   └── Toaster.tsx             # Toast notification system
├── lib/
│   ├── store.ts                # Zustand state management with persistence
│   ├── api.ts                  # API utilities and validation
│   ├── errors.ts               # Custom error types
│   ├── toast.ts                # Toast state management
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## API Endpoints

### POST /api/parse-pdf
Parses uploaded documents and extracts text.
- **Supported formats**: PDF, DOCX, TXT
- **Max file size**: 10MB
- **Rate limit**: 10 requests per minute per IP

### POST /api/enhance
Enhances document text using OpenAI.
- **Enhancement types**: enhance, summarize, key-points
- **Rate limit**: 20 requests per minute per IP

### POST /api/chat
Provides AI chat functionality with document context.
- **Rate limit**: 30 requests per minute per IP

## License

This project is private.
