// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import queryGPT from '../../lib/queryApi'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session } = req.body
  
  if (!prompt) {
    res.status(400).json({ answer: "Please input something :)"});
    return;
  }

  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat ID!" });
    return;
  }

  // ChatGPT Query
  const response = await queryGPT(prompt, chatId, model)

  const message: Message = {
    text: response || "Smart Lingo was unable to respond to that :(",
    
  }

  res.status(200).json({ name: 'Sean' });
}
