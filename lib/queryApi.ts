import openai from './chatgpt'

const queryGPT = async (prompt: string, chatId:string, model: string) => {

    // const res = await openai.createCompletion({
    //     model: model,
    //     prompt: prompt,
    //     temperature: 0.9, // wanna be more creative (0.9) or more logical (0.1)
    //     max_tokens: 1000,
    //     top_p: 1,
    //     frequency_penalty: 0,
    //     presence_penalty: 0,
    // })
    // .then((res) => res.data.choices[0].text)
    // .catch(
    //     (err) => 
    //     `Smart Lingo was unable to find an answer for that! (Error: ${err.message})`
    // );
    
    // can use chatId to use contextual chat

    // set up params for openai responses
    // (model === "gpt-3.5-turbo" || model === "gpt-3.5-turbo-0301") 

    

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
            messages: [
                { 
                    role: "system", content: `You are a language teacher.` 
                },
                {
                    role: "user",
                    content: "I am a 6-year old student in Australia, learning Spanish.",
                },
                {
                    role: "assistant",
                    content: "Nice to meet you! I am your smart assistant! Ask me any questions!",
                },
                { 
                    role: "user", content: prompt 
                },
            ],
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