import openai from './chatgpt'

const queryGPT = async (prompt: string, chatId:string, model: string) => {
    
    // can use chatId to use contextual chat

    // set up params for openai responses
    // model === "gpt-3.5-turbo" || model === "gpt-3.5-turbo-0301" ? (
    // ) : (
    // )
    // const res = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [{role: "user", content: "Hello world"}],
    // })
    // .then(res => res.data.choices[0].text)
    // .catch(
    //     (err) => 
    //     `Smart Lingo was unable to find an answer for that! (Error: ${err.message})`
    // );
    const res = await openai.createCompletion({
        model: model,
        prompt: prompt,
        temperature: 0.9, // wanna be more creative (0.9) or more logical (0.1)
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