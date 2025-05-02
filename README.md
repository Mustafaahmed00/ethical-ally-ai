# Ethical Ally

An AI companion that helps users navigate confusing ethical dilemmas by walking through different ethical frameworks, showing perspectives they might be missing, and guiding them to make better decisions that align with their values - all without telling them what to do.

## Key Features

- **Framework-Based Guidance**: Explore ethical dilemmas through multiple frameworks (utilitarian, deontological, virtue ethics, etc.)
- **Domain-Specific Scenarios**: Pre-built ethical scenarios for healthcare, emergency services, education, and general situations
- **No Prescriptive Advice**: The AI presents perspectives rather than telling users what to do
- **Simple Interface**: Easy-to-use chat interface focused on ethical exploration

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ethical-ally.git
cd ethical-ally
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your API key:
```
GEMINI_API_KEY=your-gemini-api-key-here
```

To get a Gemini API key (free):
- Go to https://aistudio.google.com/app/apikey
- Sign in with your Google account
- Click "Create API Key" and copy the key
- Paste it in your `.env` file

The application uses Google's **Gemini Flash 2** model, which is completely free to use with no usage limits.

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Browse Scenarios**: Explore pre-built ethical dilemmas in healthcare, emergency services, education, and general domains
2. **Select a Prompt**: Choose from domain-specific ethical questions or dilemmas
3. **Chat with the AI**: Discuss your ethical situation and receive guidance based on different ethical frameworks
4. **Explore Perspectives**: Consider different viewpoints without being told what to do

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Google Gemini Flash 2 AI API (free, no usage limits)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
