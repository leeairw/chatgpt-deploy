// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { adminDb } from '../../firebaseAdmin';
import queryGPT from '../../lib/queryApi'
import admin from "firebase-admin";
// import { ChatContext, ChatContextType } from '../../components/ChatContext';
// import { useContext } from 'react';

type Data = {
  answer: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session, chatHistory } = req.body
  const prompt_text = prompt.text

  if (!prompt_text) {
    res.status(400).json({ answer: "Please input something :)"});
    return;
  }

  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat ID!" });
    return;
  }

  // ChatGPT Query: Talk to ChatGPT
  const response = await queryGPT(prompt_text, chatId, model, chatHistory);
  console.log("Response from queryGPT: ", response)
  // addChatHistory("assistant", response)

  const message: Message = {
    text: response || "Smart Lingo was unable to respond to that :(",
    // firebaseAdmin
    createdAt: admin.firestore.Timestamp.now(),
    user: {
        _id: 'SmartLingo',
        name: prompt.user.name,
        type: prompt.user.type + "Response",
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

  return message.text;
}
