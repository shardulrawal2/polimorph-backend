import express from "express"; 
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";


dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

let savedData = []; // In-memory storage

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Utility: call OpenAI with a prompt
async function callOpenAI(prompt) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  let result = response.choices[0].message.content.trim();
  
  // Remove all types of quotes from the response
  result = result.replace(/^["']|["']$/g, ''); // Remove single quotes at start/end
  result = result.replace(/^`|`$/g, ''); // Remove backticks at start/end
  result = result.replace(/^""|""$/g, ''); // Remove double quotes at start/end
  result = result.replace(/^''|''$/g, ''); // Remove double single quotes at start/end
  
  // Remove any additional formatting or prompts that might be included
  result = result.replace(/^(Here's|Here is|The result|Output|Response|Answer|Result):\s*/i, '');
  result = result.replace(/^(Original|Input|Text|Message):\s*.*$/gm, '');
  result = result.replace(/^(Prompt|Request|Task|Instruction):\s*.*$/gm, '');
  result = result.replace(/^(Analysis|Explanation|Note):\s*.*$/gm, '');
  
  // Clean up any remaining formatting
  result = result.replace(/^\s*[-*•]\s*/gm, ''); // Remove bullet points
  result = result.replace(/^\s*\d+\.\s*/gm, ''); // Remove numbered lists
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove excessive line breaks
  
  // Remove any remaining quotes within the text
  result = result.replace(/^["']+|["']+$/g, ''); // Remove any remaining quotes at start/end
  result = result.replace(/^`+|`+$/g, ''); // Remove any remaining backticks at start/end
  
  return result.trim();
}

// ----------- GENERAL TAB ENDPOINTS -----------

// Humanize
app.post("/humanize", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Rewrite the following text in a natural, human-like way that sounds conversational and authentic. Avoid robotic or AI-like phrasing. Return ONLY the rewritten text, nothing else.

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Humanize Error:", error);
    res.status(500).json({ error: "Humanize failed. " + error.message });
  }
});

// Paraphrase
app.post("/paraphrase", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Paraphrase the following text while keeping the meaning intact and using different wording. Return ONLY the paraphrased text, nothing else.

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Paraphrase Error:", error);
    res.status(500).json({ error: "Paraphrase failed. " + error.message });
  }
});

// Summarize
app.post("/summarize", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Summarize the following text into a concise version while keeping all key points:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Summarize Error:", error);
    res.status(500).json({ error: "Summarize failed. " + error.message });
  }
});

// Elaborate
app.post("/elaborate", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Expand and elaborate on the following text, adding more detail and explanation:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Elaborate Error:", error);
    res.status(500).json({ error: "Elaborate failed. " + error.message });
  }
});

// Grammar
app.post("/grammar", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Correct grammar, spelling, and style issues in the following text:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Grammar Error:", error);
    res.status(500).json({ error: "Grammar correction failed. " + error.message });
  }
});

// Simplify
app.post("/simplify", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Simplify the following text into easy to understand words while keeping the meaning:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Simplify Error:", error);
    res.status(500).json({ error: "Simplify failed. " + error.message });
  }
});

// Custom Role
app.post("/customrole", async (req, res) => {
  try {
    const { text, senderRole, receiverRole, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `You are rewriting a message where the **sender** has the role of "${senderRole}" 
and the **receiver** has the role of "${receiverRole}".
Optimize the phrasing so it makes sense for communication between these roles while keeping the meaning intact.

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Custom Role Error:", error);
    res.status(500).json({ error: "Custom role rewrite failed. " + error.message });
  }
});

// ----------- FORMATTING TAB ENDPOINTS -----------

// Paragraph to Bullets
app.post("/paragraph-to-bullets", async (req, res) => {
  try {
    const { text, bulletStyle, inputLang, outputLang, hinglishIntensity } = req.body;
    const styleMap = {
      'step': 'Step 1, Step 2, Step 3...',
      'roman': 'I, II, III, IV...',
      'alpha': 'a, b, c, d...',
      'numeric': '1, 2, 3, 4...',
      'firstly': 'Firstly, Secondly, Thirdly...'
    };
    const style = styleMap[bulletStyle] || 'Step 1, Step 2, Step 3...';
    
    let prompt = `Convert the following paragraph into bullet points using ${style} format:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Paragraph to Bullets Error:", error);
    res.status(500).json({ error: "Paragraph to bullets failed. " + error.message });
  }
});

// Bullets to Paragraph
app.post("/bullets-to-paragraph", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Convert the following bullet points into a flowing paragraph:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Bullets to Paragraph Error:", error);
    res.status(500).json({ error: "Bullets to paragraph failed. " + error.message });
  }
});

// Table to Dense Text
app.post("/table-to-text", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Convert the following table data into dense, readable text format:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Table to Text Error:", error);
    res.status(500).json({ error: "Table to text failed. " + error.message });
  }
});

// Dense Text to Table
app.post("/text-to-table", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Convert the following dense text into a well-formatted table:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Text to Table Error:", error);
    res.status(500).json({ error: "Text to table failed. " + error.message });
  }
});

// Checklist Format
app.post("/checklist", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Convert the following text into a checklist format with checkboxes:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Checklist Error:", error);
    res.status(500).json({ error: "Checklist conversion failed. " + error.message });
  }
});

// Word Limit Optimizer
app.post("/word-limit", async (req, res) => {
  try {
    const { text, wordLimit, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Rephrase the following text to be exactly ${wordLimit} words while keeping all important information:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Word Limit Error:", error);
    res.status(500).json({ error: "Word limit optimization failed. " + error.message });
  }
});

// Language Converter
app.post("/language-convert", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Convert the following text from ${inputLang} to ${outputLang}:`;
    
    if (outputLang === 'hinglish') {
      const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
      prompt = `Convert the following text to Hinglish with ${intensity} intensity:`;
    }
    
    prompt += `\n\nOriginal: "${text}"`;
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Language Convert Error:", error);
    res.status(500).json({ error: "Language conversion failed. " + error.message });
  }
});

// Delete All
app.post("/delete-all", async (req, res) => {
  try {
    const { text, deleteText, inputLang, outputLang, hinglishIntensity } = req.body;
    
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required" });
    }
    
    if (!deleteText || deleteText.trim() === "") {
      return res.status(400).json({ error: "Text to delete is required" });
    }
    
    // Split deleteText by commas and clean up
    const wordsToDelete = deleteText.split(',').map(word => word.trim()).filter(word => word.length > 0);
    
    let prompt = `Remove the following words/phrases from the text while keeping everything else intact: ${wordsToDelete.join(', ')}`;
    prompt += `\n\nOriginal: "${text}"`;
    prompt += `\n\nReturn ONLY the cleaned text with the specified words/phrases removed. Keep all other content exactly as it was.`;
    
    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Delete All Error:", error);
    res.status(500).json({ error: "Delete all failed. " + error.message });
  }
});

// Replace All
app.post("/replace-all", async (req, res) => {
  try {
    const { text, findText, replaceText, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Replace all content in the following text`;
    
    if (findText && replaceText) {
      prompt += ` by finding "${findText}" and replacing with "${replaceText}"`;
    } else {
      prompt += ` with new content while maintaining the same structure`;
    }
    
    prompt += `:\n\nOriginal: "${text}"`;
    
    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Replace All Error:", error);
    res.status(500).json({ error: "Replace all failed. " + error.message });
  }
});

// Prompt It
app.post("/prompt-it", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Create an optimized prompt for AI models based on the following text. Minimize tokens and optimize for AI understanding:

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Prompt It Error:", error);
    res.status(500).json({ error: "Prompt creation failed. " + error.message });
  }
});

// Custom Formatting
app.post("/custom-format", async (req, res) => {
  try {
    const { text, request, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Apply the following formatting request to the text: "${request}"

Original: "${text}"`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }
    
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Custom Format Error:", error);
    res.status(500).json({ error: "Custom formatting failed. " + error.message });
  }
});

// ----------- TONE SHIFTING TAB ENDPOINTS -----------
app.post("/tone", async (req, res) => {
  try {
    const { text, tone, inputLang, outputLang, hinglishIntensity } = req.body;
    let prompt = `Rewrite the following text in a ${tone} tone. Keep the meaning intact, but adjust the mood and phrasing.`;
    
    if (outputLang === 'hinglish') {
      const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
      prompt += ` Use Hinglish with ${intensity} intensity.`;
    }
    
    prompt += `\n\nOriginal: "${text}"`;
    res.json({ result: await callOpenAI(prompt) });
  } catch (error) {
    console.error("❌ Tone Shift Error:", error);
    res.status(500).json({ error: "Tone shift failed. " + error.message });
  }
});

// ----------- CONTEXT AWARE TAB ENDPOINTS -----------

// Context Analysis
app.post("/context-analyze", async (req, res) => {
  try {
    const { text, sender, aim, inputLang, outputLang, hinglishIntensity } = req.body;
    
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Message text is required" });
    }
    
    let prompt = `Generate 3 different response options for this message. Analyze the relationship between sender and receiver to optimize tone and approach:

Message: "${text}"`;

    if (sender && sender.trim() !== "") {
      prompt += `\nSender Context: "${sender}"`;
    }

    if (aim && aim.trim() !== "") {
      prompt += `\nConversation Aim: "${aim}"`;
      prompt += `\n\nGenerate responses that work towards achieving this aim.`;
    } else {
      prompt += `\n\nGenerate varied responses with different approaches and tones.`;
    }

    prompt += `\n\nGenerate exactly 3 responses in this format:

RESPONSE 1: [Direct and confident approach - complete message]
RESPONSE 2: [Diplomatic and considerate approach - complete message]  
RESPONSE 3: [Strategic and thoughtful approach - complete message]

Each response should be a complete message that could be sent directly. Return ONLY the response text without any additional formatting, explanations, or quotes.`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }

    const responseResult = await callOpenAI(prompt);

    // More robust parsing with fallback
    let response1 = "Response not available";
    let response2 = "Response not available";
    let response3 = "Response not available";

    try {
      // Try different parsing patterns
      const patterns = [
        /RESPONSE 1:\s*(.*?)(?=RESPONSE 2:|$)/s,
        /1\.\s*(.*?)(?=2\.|$)/s,
        /First:\s*(.*?)(?=Second:|$)/s
      ];
      
      for (const pattern of patterns) {
        const match = responseResult.match(pattern);
        if (match && match[1] && match[1].trim()) {
          response1 = match[1].trim();
          break;
        }
      }

      const patterns2 = [
        /RESPONSE 2:\s*(.*?)(?=RESPONSE 3:|$)/s,
        /2\.\s*(.*?)(?=3\.|$)/s,
        /Second:\s*(.*?)(?=Third:|$)/s
      ];
      
      for (const pattern of patterns2) {
        const match = responseResult.match(pattern);
        if (match && match[1] && match[1].trim()) {
          response2 = match[1].trim();
          break;
        }
      }

      const patterns3 = [
        /RESPONSE 3:\s*(.*?)$/s,
        /3\.\s*(.*?)$/s,
        /Third:\s*(.*?)$/s
      ];
      
      for (const pattern of patterns3) {
        const match = responseResult.match(pattern);
        if (match && match[1] && match[1].trim()) {
          response3 = match[1].trim();
          break;
        }
      }

      // If parsing failed, try to split by common delimiters
      if (response1 === "Response not available" && response2 === "Response not available" && response3 === "Response not available") {
        const lines = responseResult.split('\n').filter(line => line.trim());
        if (lines.length >= 3) {
          response1 = lines[0].trim();
          response2 = lines[1].trim();
          response3 = lines[2].trim();
        }
      }
    } catch (parseError) {
      console.error("❌ Parse Error:", parseError);
      // Fallback to raw response
      response1 = responseResult;
    }

    res.json({
      response1,
      response2,
      response3
    });
  } catch (error) {
    console.error("❌ Context Analysis Error:", error);
    res.status(500).json({ error: "Context analysis failed. " + error.message });
  }
});

// Context Analysis Insights
app.post("/context-insights", async (req, res) => {
  try {
    const { text, sender, aim, inputLang, outputLang, hinglishIntensity } = req.body;
    
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Message text is required" });
    }
    
    let prompt = `Analyze the following message and provide insights:

Message: "${text}"`;

    if (sender && sender.trim() !== "") {
      prompt += `\nSender Context: "${sender}"`;
    }

    if (aim && aim.trim() !== "") {
      prompt += `\nConversation Aim: "${aim}"`;
    }

    prompt += `\n\nProvide analysis in this exact format:

SENDER_INTENT: [What the sender is thinking or trying to achieve]
IMPACT_ON_YOU: [What this message means for you and your situation]
PERCEPTION_IMPACT: [How your response will affect how the sender perceives you]

Keep each analysis concise (1-2 sentences) and practical.`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }

    const responseResult = await callOpenAI(prompt);

    // Parse the insights
    let senderIntent = "Analysis not available";
    let impactOnYou = "Analysis not available";
    let perceptionImpact = "Analysis not available";

    try {
      const intentMatch = responseResult.match(/SENDER_INTENT:\s*(.*?)(?=IMPACT_ON_YOU:|$)/s);
      const impactMatch = responseResult.match(/IMPACT_ON_YOU:\s*(.*?)(?=PERCEPTION_IMPACT:|$)/s);
      const perceptionMatch = responseResult.match(/PERCEPTION_IMPACT:\s*(.*?)$/s);
      
      senderIntent = intentMatch?.[1]?.trim() || "Analysis not available";
      impactOnYou = impactMatch?.[1]?.trim() || "Analysis not available";
      perceptionImpact = perceptionMatch?.[1]?.trim() || "Analysis not available";
    } catch (parseError) {
      console.error("❌ Insights Parse Error:", parseError);
    }

    res.json({
      senderIntent,
      impactOnYou,
      perceptionImpact
    });
  } catch (error) {
    console.error("❌ Context Insights Error:", error);
    res.status(500).json({ error: "Context insights failed. " + error.message });
  }
});

// ----------- MULTIPLE ANSWER TAB ENDPOINTS -----------

// Generate Variations
app.post("/generate-variations", async (req, res) => {
  try {
    const { text, inputLang, outputLang, hinglishIntensity } = req.body;
    
    let prompt = `Create 3 different versions of the following text with slight variations in tone, format, and arrangement. For each version, explain what changes you made:

Original: "${text}"

Provide:
1. Answer 1 with properties explanation
2. Answer 2 with properties explanation  
3. Answer 3 with properties explanation

Format the response as:
ANSWER1: [text]
PROPERTIES1: [explanation]

ANSWER2: [text]
PROPERTIES2: [explanation]

ANSWER3: [text]
PROPERTIES3: [explanation]

Return ONLY the answers and properties, no additional text or formatting.`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }

    const result = await callOpenAI(prompt);
    
    // Parse the result
    const answer1Match = result.match(/ANSWER1:\s*(.*?)(?=PROPERTIES1:|$)/s);
    const properties1Match = result.match(/PROPERTIES1:\s*(.*?)(?=ANSWER2:|$)/s);
    const answer2Match = result.match(/ANSWER2:\s*(.*?)(?=PROPERTIES2:|$)/s);
    const properties2Match = result.match(/PROPERTIES2:\s*(.*?)(?=ANSWER3:|$)/s);
    const answer3Match = result.match(/ANSWER3:\s*(.*?)(?=PROPERTIES3:|$)/s);
    const properties3Match = result.match(/PROPERTIES3:\s*(.*?)$/s);

    res.json({
      answer1: answer1Match?.[1]?.trim() || "Answer 1 not available",
      properties1: properties1Match?.[1]?.trim() || "Properties 1 not available",
      answer2: answer2Match?.[1]?.trim() || "Answer 2 not available",
      properties2: properties2Match?.[1]?.trim() || "Properties 2 not available",
      answer3: answer3Match?.[1]?.trim() || "Answer 3 not available",
      properties3: properties3Match?.[1]?.trim() || "Properties 3 not available"
    });
  } catch (error) {
    console.error("❌ Generate Variations Error:", error);
    res.status(500).json({ error: "Generate variations failed. " + error.message });
  }
});

// Regenerate Answer
app.post("/regenerate-answer", async (req, res) => {
  try {
    const { text, properties, answerNumber, inputLang, outputLang, hinglishIntensity } = req.body;
    
    let prompt = `Regenerate the following text using the specified properties:

Original: "${text}"
Properties to apply: "${properties}"

Create a new version that incorporates these specific changes.`;

    if (outputLang && outputLang !== 'english') {
      if (outputLang === 'hinglish') {
        const intensity = ['Pure English', 'Mostly English', 'Balanced', 'Mostly Hindi', 'Pure Hindi'][hinglishIntensity];
        prompt += `\n\nRespond in Hinglish with ${intensity} intensity.`;
      } else {
        prompt += `\n\nRespond in ${outputLang}.`;
      }
    }

    const result = await callOpenAI(prompt);
    res.json({ result });
  } catch (error) {
    console.error("❌ Regenerate Answer Error:", error);
    res.status(500).json({ error: "Regenerate answer failed. " + error.message });
  }
});

// ----------- LEGACY ENDPOINTS (for backward compatibility) -----------

// Keep some old endpoints for compatibility
app.post("/humanise", async (req, res) => {
  try {
    const { text } = req.body;
    res.json({ result: await callOpenAI(`Rewrite the following text in a natural, human-like way:\n\n"${text}"`) });
  } catch (error) {
    console.error("❌ Humanise Error:", error);
    res.status(500).json({ error: "Humanise failed. " + error.message });
  }
});

app.post("/condense", async (req, res) => {
  try {
    const { text } = req.body;
    res.json({ result: await callOpenAI(`Condense the following text into a shorter, concise version while keeping the meaning:\n\n"${text}"`) });
  } catch (error) {
    console.error("❌ Condense Error:", error);
    res.status(500).json({ error: "Condense failed. " + error.message });
  }
});

// ----------- SAVE DATA -----------
app.post("/save", (req, res) => {
  const userData = req.body;
  savedData.push(userData);
  res.json({ status: "success", data: userData });
});

// ----------- GET ALL SAVED DATA -----------
app.get("/data", (req, res) => {
  res.json({ status: "success", data: savedData });
});



// --- Health check route (for testing deployment) ---
app.get("/_health", (req, res) => {
  res.send("OK");
});

// ----------- START SERVER -----------
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));



