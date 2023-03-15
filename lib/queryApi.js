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
            role: "system", content: `You are a Chinese language teacher. You will be helping me to learn Chinese well. You will talk in a casual way, with a little bit humor sometimes!` 
        },
        // {
        //     role:"system", content: "You are a high school history teacher and you will debate with me as a student on history topics. You talk humorously and you are easy to understand."
        // },
        // {
        //     role:"system", content: "Pretend to talk like Donald Trump and you will debate with me on your previous policies." 
        // },
        // {
        //     role:"system", content:""
        // },
        {
            role: "user",
            content: "I am a 17-year old high school student in Japan, learning Chinese.",
        },
        {
            role: "assistant",
            content: "Nice to meet you! I am your Chinese language teacher! Ask me any questions!",
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