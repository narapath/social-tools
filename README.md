# 🚀 Facebook Social Tools - Marketing Automation

A premium, glassmorphism-themed Facebook automation tool. Connect with real Facebook profiles, search for targeted groups, auto-join them, and batch post your marketing messages with built-in rate-limit protection.

## ✨ Features

- **Real Facebook Integration**: Uses Direct OAuth Redirect for reliable login (no buggy JS SDK popups).
- **Group Search**: Find your target audience by keyword (Graph API with fallback filter).
- **Fast Joiner**: Assisted automation to join multiple groups sequentially.
- **Batch Posting**: Post messages/links to multiple selected groups with configurable delays.
- **Live Status**: Real-time feedback for every post (Success/Fail/Error).
- **Thai Language Support**: Built for ease of use by Thai marketers.

## 🛠️ Setup (Vercel / GitHub Pages)

1. **Deploy**: Push this code to GitHub and connect to Vercel or GitHub Pages.
2. **Facebook App Configuration**:
   - Go to [developers.facebook.com](https://developers.facebook.com)
   - Add **App Domains**: `your-production-domain.com`
   - Add **Valid OAuth Redirect URIs**: `https://your-production-domain.com/`
3. **App ID**: Copy your **App ID** from Facebook Dashboard and paste it into the "ตั้งค่า App ID" section on your live site.

## 🧪 Local Development

```bash
npm install
npm run dev
```

## 📜 Technology Stack

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS (Glassmorphism + Gradients)
- **Animations**: Framer Motion
- **Icons**: React Icons
- **API**: Facebook Graph API (v19.0)

---
Developed as a premium social marketing solution.
