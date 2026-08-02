import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 screenshot uploads
app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Extract data from screenshot API
app.post("/api/extract", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png", customPrompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image base64 data is required." });
    }

    // Clean base64 string if it contains data URL header
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert OCR & data extraction AI assistant.
Your task is to thoroughly analyze the provided screenshot image and extract all relevant information into structured data.

Specifically, identify and extract:
1. Phone Number: Any phone number, mobile number, WhatsApp number, or landline found (e.g. "98XXXXXXXX", "+91 9876543210"). Format cleanly. If no number is visible, return "Not found".
2. Date & Time: Any timestamp, date, time of message, creation time, or scheduled time visible (e.g. "24-07-2026 10:30 AM", "Yesterday at 6:45 PM", "2026-07-24 14:20"). If none visible, return "Not found".
3. Link: Any URL, link, domain name, email address, or web link visible (e.g. "https://...", "www.example.com"). Ensure full protocol prefix (http/https) if applicable. Return "Not found" if none exists.
4. Content: The text content, message text, notification details, post body, comment, or context associated with the entry. Be concise yet accurate and retain key details.

Rules:
- If the screenshot contains multiple distinct messages, rows, transactions, or contacts, extract each item as a separate object in the 'items' array.
- If it is a single screenshot with one primary context, return 1 object in the 'items' array.
- Clean up OCR noise, preserve accurate numbers, dates, links, and content accurately.`;

    const promptText = customPrompt || "Extract all phone numbers, dates & times, links, and content from this screenshot.";

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/png",
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              description: "Extracted data items from the screenshot",
              items: {
                type: Type.OBJECT,
                properties: {
                  phoneNumber: {
                    type: Type.STRING,
                    description: "Extracted phone number or 'Not found'",
                  },
                  dateTime: {
                    type: Type.STRING,
                    description: "Extracted date and time or 'Not found'",
                  },
                  link: {
                    type: Type.STRING,
                    description: "Extracted URL or link or 'Not found'",
                  },
                  content: {
                    type: Type.STRING,
                    description: "Extracted text content or message body",
                  },
                },
                required: ["phoneNumber", "dateTime", "link", "content"],
              },
            },
            notes: {
              type: Type.STRING,
              description: "Optional notes or overall summary of the screenshot",
            },
          },
          required: ["items"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "Gemini AI returned empty response." });
    }

    const parsedData = JSON.parse(text);
    return res.json({
      success: true,
      items: parsedData.items || [],
      notes: parsedData.notes || "",
    });
  } catch (error: any) {
    console.error("Error extracting screenshot data:", error);
    return res.status(500).json({
      error: error.message || "Failed to extract data from screenshot.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
