// pages/api/ask.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchPageContent } from '../../lib/fetchPageContent'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { url, question } = req.body
  const context = await fetchPageContent(url)

  const prompt = `Use this website context to answer:\n\n${context}\n\nQuestion: ${question}\nAnswer:`

  try {
    const openRouterResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an assistant representing dental clinc. Do not refer to yourself by any name or the company and just provide the user the information they want, be clear and concise' },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'Content-Type': 'application/json',
        },
      }
    )

    const reply = openRouterResponse.data.choices[0].message.content
    res.status(200).json({ answer: reply })
    } catch (error: any) {
        console.error("❌ OpenRouter API Error:");
        if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        } else {
        console.error("Message:", error.message);
        }
    
        res.status(500).json({ answer: 'Failed to get a response' });
    }
  
}