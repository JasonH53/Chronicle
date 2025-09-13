# 🤖 Gemini AI Integration Setup

Chronicle now uses Google's Gemini LLM for real AI-powered financial insights!

## 🔑 Getting Your Gemini API Key

1. **Visit Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Create API Key** - click "Create API Key"
4. **Copy your API key** - it will look like: `AIzaSyC...`

## ⚙️ Configuration

### Option 1: Environment Variable (Recommended)
```bash
# Set environment variable (macOS/Linux)
export GEMINI_API_KEY="your_api_key_here"

# Or add to your shell profile (~/.zshrc, ~/.bashrc)
echo 'export GEMINI_API_KEY="your_api_key_here"' >> ~/.zshrc
```

### Option 2: .env File
```bash
# Create .env file in the project root
cd Chronicle
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

## 🚀 Usage

Once configured, Chronicle will automatically use Gemini for AI insights:

```bash
# Start Chronicle
./start.sh

# Visit the AI Analysis tab
# http://localhost:3000 → AI Analysis tab
```

## 🔍 Features

With Gemini integration, you get:

- **Real AI Analysis**: Actual insights from Google's LLM
- **Personalized Recommendations**: Based on your specific financial data
- **Smart Categorization**: AI-powered spending pattern analysis
- **Actionable Advice**: Practical financial recommendations
- **Confidence Scores**: How confident the AI is in each insight

## 🛠 Troubleshooting

### "Mock Analysis Mode" Message
- This means the API key isn't configured
- Check your environment variable or .env file
- Restart the backend after setting the key

### API Errors
- Verify your API key is correct
- Check you have credits/quota remaining
- Ensure internet connection is working

### Fallback Behavior
- If Gemini fails, Chronicle automatically falls back to mock insights
- No functionality is lost - you'll just see sample data instead

## 💰 Pricing

Gemini API pricing (as of 2024):
- **Free tier**: 15 requests per minute
- **Pay-as-you-go**: Very affordable for personal use
- **Typical cost**: ~$0.01-0.05 per analysis

## 🔒 Security

- API keys are stored as environment variables (not in code)
- No financial data is permanently stored by Google
- Each request is independent and stateless

---

**Ready to get AI-powered insights?** Set your API key and restart Chronicle! 🚀
