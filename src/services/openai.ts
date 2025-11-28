import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Note: In production, API calls should go through a backend
});

export interface RecognizedItem {
  name: string;
  quantity: string;
  expires?: string;
  confidence?: number;
}

/**
 * Recognize food items from an image using GPT-4 Vision
 */
export async function recognizeImageFromFile(file: File): Promise<RecognizedItem> {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    const mimeType = file.type;

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a helpful food inventory assistant that helps families reduce food waste and meal planning stress. 
Analyze images of food items and extract:
- Item name (e.g., "Milk", "Eggs", "Bread", "Hot Dogs")
- Quantity (e.g., "1 carton", "12", "1 loaf", "6 hot dogs")
- Expiration date if visible (format: YYYY-MM-DD)

IMPORTANT: Return ONLY a valid JSON object. Do not include any markdown, code blocks, or extra text. Just the raw JSON:
{
  "name": "item name",
  "quantity": "quantity string",
  "expires": "YYYY-MM-DD or empty string if not visible"
}

If multiple items are visible, focus on the most prominent one. Help users avoid duplicate shopping and reduce food waste.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content || '{}';
    let jsonString = content.trim();

    // Remove markdown code blocks if present
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      console.error('JSON parse error. Content:', content);
      // Try to extract JSON from the response
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    return {
      name: parsed.name || 'Unknown Item',
      quantity: parsed.quantity || '1',
      expires: parsed.expires && parsed.expires !== '' ? parsed.expires : undefined,
      confidence: 0.9,
    };
  } catch (error: any) {
    console.error('Image recognition error:', error);
    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your OpenAI API key.');
    } else if (error.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error.message ? new Error(`Recognition failed: ${error.message}`) : new Error('Failed to recognize image. Please try again.');
  }
}

/**
 * Process speech input using Whisper and GPT-4
 */
export async function processSpeechInput(audioBlob: Blob): Promise<RecognizedItem> {
  try {
    // Convert blob to file for OpenAI
    const audioFile = new File([audioBlob], 'audio.webm', { type: audioBlob.type || 'audio/webm' });

    // Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    });

    const transcriptText = transcription.text;

    // Parse the transcript using GPT-4
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful food inventory assistant that understands the stress of meal planning and food waste. 
Parse spoken text about food items and extract:
- Item name (e.g., "Milk", "Eggs", "Bread")
- Quantity (e.g., "1 carton", "12", "1 loaf")
- Expiration date if mentioned (format: YYYY-MM-DD)

Examples:
- "Add 2 cartons of milk" -> {"name": "Milk", "quantity": "2 cartons", "expires": ""}
- "I have 12 eggs expiring on December 25th" -> {"name": "Eggs", "quantity": "12", "expires": "2024-12-25"}
- "Add bread" -> {"name": "Bread", "quantity": "1", "expires": ""}
- "We bought chicken" -> {"name": "Chicken", "quantity": "1", "expires": ""}

Return ONLY a JSON object with this structure:
{
  "name": "item name",
  "quantity": "quantity string",
  "expires": "YYYY-MM-DD or empty string if not mentioned"
}

Help families track what they have to reduce duplicate shopping and food waste.`,
        },
        {
          role: 'user',
          content: transcriptText,
        },
      ],
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content || '{}';
    let jsonString = content.trim();

    // Remove markdown code blocks if present
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      console.error('JSON parse error. Content:', content);
      // Try to extract JSON from the response
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    return {
      name: parsed.name || 'Unknown Item',
      quantity: parsed.quantity || '1',
      expires: parsed.expires && parsed.expires !== '' ? parsed.expires : undefined,
      confidence: 0.9,
    };
  } catch (error: any) {
    console.error('Speech processing error:', error);
    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your OpenAI API key.');
    } else if (error.message?.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error.message ? new Error(`Processing failed: ${error.message}`) : new Error('Failed to process speech. Please try again.');
  }
}

/**
 * Helper function to convert File to base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

