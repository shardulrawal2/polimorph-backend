🧠 Polimorph – AI Text Rephraser Chrome Extension

Polimorph is a lightweight Chrome extension that helps you rephrase text using AI directly inside your browser — fast, simple, and distraction-free.

This repository includes the full extension packaged in a ZIP file so it can be installed locally without coding.

📦 What’s Inside

polimorph-extension.zip
→ Full Chrome extension source code

README.md
→ Setup & usage instructions

⚠️ Note: The extension connects to a hosted backend.
You do not need Node.js or any backend setup.

🚀 How to Install & Use (Local Setup)

Follow these steps carefully.

✅ Step 1: Download & Unzip

Download polimorph-extension.zip

Right-click → Extract Here / Extract All

You will get a folder like:

polimorph-extension/

🚨 IMPORTANT — COMMON MISTAKE

When downloading ZIPs, Chrome sometimes creates:

Polimorph Extension/
   └── polimorph-extension/
         └── manifest.json


If you load the outer folder, Chrome shows:

Manifest file is missing or unreadable

You must load the inner folder that directly contains manifest.json.

Keep this rule in mind:

✔️ Select the folder where manifest.json is visible

🌐 Step 2: Open Chrome Extensions Page

Open Chrome and go to:

chrome://extensions/


Turn on:

Developer mode (top-right)

📂 Step 3: Load the Extension

Click:

Load unpacked


Select the correct extracted folder:

polimorph-extension/


The extension should now appear in your extensions list. ✅

✨ Step 4: Start Using Polimorph

Click the Polimorph icon in your toolbar

Paste or type text

Click Rephrase

Get AI-optimized output instantly 🚀

🔄 Updates & Improvements

Backend updates happen automatically

If the UI changes, download the new ZIP

Remove the old version and reload the new one

🛠️ Tech Stack (For Developers)

Chrome Extension (Manifest v3)

JavaScript

Hosted Node.js backend

OpenAI API

🔐 Security Notes

No API keys are stored in the extension

All AI requests are securely handled through the backend

📄 License

This project is for educational and personal use.
Please do not redistribute without permission.

🙌 Author

Polimorph
Built with curiosity and experimentation 🚀
