import openai from './chatgpt'

const queryGPT = async (prompt: string, chatId:string, model: string) => {
    
    // can use chatId to use contextual chat

    // set up params for openai responses
    const res = await openai.createCompletion({
        model,
        prompt,
        temperature: 0.2, // wanna be more creative (0.9) or more logical (0.1)
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    })
    .then(res => res.data.choices[0].text)
    .catch(
        (err) => 
        `Smart Lingo was unable to find an answer for that! (Error: ${err.message})`
    );

    return res;
}


export default queryGPT; 