// lib/fetchPageContent.ts
import axios from 'axios'
import * as cheerio from 'cheerio'

export const fetchPageContent = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const text = $('p').map((i, el) => $(el).text()).get().join('\n')
    return text
  } catch (error) {
    console.error('Failed to fetch or parse site:', error)
    return 'Could not load content.'
  }
}
