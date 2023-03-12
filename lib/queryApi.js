import openai from './chatgpt'

// import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";



const queryGPT = async (prompt, chatId, model, chatHistory) => {
// const queryGPT = async (prompt: string, chatId:string, model: string) => {

    // const { chatHistory, addChatHistory } = useContext(ChatContext);
    // console.log("chatHistory imported in queryAPI: ", chatHistory)

    // Typescript version -- need to figure out types, hence commented out for now
    // const { chatHistory, addChatHistory } = useContext<ChatContextType>(ChatContext);
    // console.log("chatHistory imported in queryAPI: ", chatHistory)
    // type ChatDataType = { role: string, content: string }[];
    // type ChatCompletionRequestMessage = {
    //     role: string;
    //     content: string;
    //   }[]
    const contextArray = [
        { 
            role: "system", content: `You are a language teacher assistant. You will be helping me to teach my student well.` 
        },
        {
            role: "user",
            content: "I am a 6-year old student in Australia, learning Spanish.",
        },
        {
            role: "assistant",
            content: "Nice to meet you! I am your smart assistant! Ask me any questions!",
        }
    ]
    const previousChatArray  = 
        contextArray
        .concat(chatHistory)
        .concat([{
            role: "user",
            content: prompt,
    }])
    

    if (model != "gpt-3.5-turbo" && model != "gpt-3.5-turbo-0301") 
    {
        const res = await openai.createCompletion({
            model: model,
            prompt: prompt,
            temperature: 0.9, // wanna be more creative (0.9) or more logical (0.1)
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
        .then((res) => {
            const res_text = res.data.choices[0].text; 
            return res_text;})
        .catch(
            (err) => 
            `Smart Lingo was unable to find an answer for that! (Error: ${err.message})`
        );

        console.log("OpenAI Response for non-chatGPT models: ", res);
        return res;
      } 
      
      else {
        const res = await openai.createChatCompletion({
            model: model,
            messages: previousChatArray,
        })
        .then((res) => {
            // res.data.choices[0].message
            const res_text = res.data.choices[0].message?.content; 
            return res_text;}
        )
        .catch(
            (err) => 
            `Smart Lingo was unable to find an answer for that! (Error: ${err.message})`
        )
        console.log("OpenAI Response for ChatGPT models: ", res);
        return res;
      }    
}


export default queryGPT; 