# Article Mind

Article Mind is a modern web application that uses AI to summarize articles in various formats. Built with Next.js and powered by Groq's LLM, it provides an intuitive interface for users to get concise summaries of any article.

![Article Mind Screenshot](screenshot.png)

## Features

- **Multiple Summary Formats**:
  - Concise Paragraph: A single, clear summary paragraph
  - Bullet Points: 5-7 key takeaways
  - Explain Like I'm 5 (ELI5): Simplified, beginner-friendly version
  - Executive Summary: High-level insights for professionals
  - Detailed Breakdown: Structured summary with introduction, body, and conclusion
  - Pros & Cons: Analysis of advantages and disadvantages
  - Key Facts & Statistics: Extraction of factual data and statistics

- **Modern UI/UX**:
  - Clean, responsive design
  - Dark/Light mode support
  - Intuitive interface
  - Toast notifications for user feedback

- **Local Storage**:
  - Save summaries for later reference
  - View history of past summaries
  - Export summaries as text files
  - Delete saved summaries

## Tech Stack

- **Frontend**:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Heroicons

- **AI Integration**:
  - Groq API
  - Llama 3.3 70B model

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Groq API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/article-mind.git
   cd article-mind
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your Groq API key:
   ```
   GROQ_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter the URL of the article you want to summarize
2. Select your preferred summary format
3. Click "Summarize Article"
4. View the generated summary
5. Optionally save the summary for later reference
6. Access your saved summaries through the history feature
7. Export summaries as text files when needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Groq](https://groq.com/)
- [Heroicons](https://heroicons.com/)
