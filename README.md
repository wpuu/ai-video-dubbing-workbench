<div align="center">
  <h1>AI Video Dubbing Workbench Pro</h1>
  <p>An end-to-end video dubbing script review and generation system based on Gemini's multimodal native parsing.</p>
</div>

## ✨ Features
- **Multimodal Native Parsing:** Powered by Google Gemini to analyze and process video and text seamlessly.
- **Multi-Role Configuration:** Easily manage and configure multiple voice roles for different characters in your videos.
- **Adaptive Duration & Character Validation:** Automatically checks script length and character limits to fit within the designated video duration.
- **Smart Abbreviation & Refinement:** Automatically condenses text when needed to ensure smooth, natural-sounding voiceovers that match the video's pacing.

## 🛠️ Tech Stack
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@google/genai](https://www.npmjs.com/package/@google/genai)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/wpuu/ai-video-dubbing-workbench.git
   cd ai-video-dubbing-workbench
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and set your `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License
This project is open-source and available under the MIT License.
