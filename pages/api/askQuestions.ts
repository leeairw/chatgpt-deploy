// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { adminDb } from '../../firebaseAdmin';
import queryGPT from '../../lib/queryApi'
import admin from "firebase-admin";

type Data = {
  answer: string;
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

  // ChatGPT Query: Talk to ChatGPT
  const response = await queryGPT(prompt, chatId, model);

  const message: Message = {
    text: response || "Smart Lingo was unable to respond to that :(",
    // firebaseAdmin
    createdAt: admin.firestore.Timestamp.now(),
    user: {
        _id: 'SmartLingo',
        name: 'SmartLingo',
        avatar: "https://www.giantbomb.com/a/uploads/scale_medium/0/6087/2437349-pikachu.png",
    }
  }

  await adminDb
  .collection('users')
  .doc(session?.user?.email)
  .collection("chats")
  .doc(chatId)
  .collection("messages")
  .add(message);

  res.status(200).json({ answer: message.text });
}
