'use client'

import { ArrowDownCircleIcon, ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { addDoc, collection, deleteDoc, doc, DocumentData, query, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import React, { useRef, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

type Props = {
    messageId:string,
    chatId:string,
    message:DocumentData,
};

function PastMessage({messageId, chatId, message}:Props) {

    // General definitions
    const { data: session } = useSession();
    const isUserRequest = (message.user.type === "UserRequest");
    const isUserRequestResponse = (message.user.type === "UserRequestResponse");

    const isSmartButtonRequest = (message.user.type === "SmartButtonRequest");
    const isSmartButtonResponse = (message.user.type === "SmartButtonRequestResponse")

    const isInspireMeRequest = (message.user.type === "InspireMeRequest");

    const isQuickNoteRequest = (message.user.type === "UserNote");
    
    const [actionChosen, setActionChosen] = useState("");
    const [prevActionChosen, setPrevActionChosen] = useState("");


    // delete chat
    const removeChat = async() => {
        await deleteDoc(
            doc(db, "users", session?.user?.email!, "chats", chatId, "messages", messageId)
        )
    }

    // Update user_action based on user_choices
    const updateUserAction = async(action: string) => {
        await updateDoc(
            doc(db, 'users', session?.user?.email!, 'chats', chatId, 'messages', messageId), 
            {"user.user_action": action}
            );
        setPrevActionChosen(action)
    }
    // console.log("Current action chose: ", actionChosen)
    // console.log("You better not be SmartButtonRequest: ", message.user.type)


    // Inspire Me
    const inspireMeQuestions= [
        "How may I help you today? :)",
        "What is your student's age group?",
        "What topics would you like to get inspired on?",
        "Any grammar you'd like to highlight in your teaching?",
        "Any Vocabulary you'd like to highlight in your teaching?",
      ]

    const inspireMeChoices = [
        ["Write a story", "Write a dialogue", "Text input"],
        ["6-11", "12-17", "18-25", "26+"],
        ["Text input"],
        ["Past tense", "Future tense", "Attribution Clause", "Text input"],
        ["Text input"],
    ]

    const [answers, setAnswers] = useState(new Array(inspireMeQuestions.length).fill(null));
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const textInputRef = useRef<HTMLInputElement>(null);

    const handleChoiceSelect = (choice: string) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = choice;
        console.log('newAnswers:', newAnswers);
        setAnswers(newAnswers);
        console.log('answers:', answers);
        if (choice === 'Text input') {
          textInputRef.current?.focus();
        } else {
          if (currentQuestion < inspireMeQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          }
        }
      };

    const handleTextInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = event.currentTarget.value;
        setAnswers(newAnswers);
        if (currentQuestion < inspireMeQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            if (textInputRef.current) {
            textInputRef.current.value = '';
            }
        }
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
        }
    };

    return (
      
        <div className={`text-grey py-5 space-x-5
            ${isUserRequestResponse && "bg-gray-600/20 rounded-lg"} 
            ${isSmartButtonResponse && "bg-blue-400/20 rounded-lg mt-5"}`}
        >   
                {/* If it were a SmartButton Request&Response, we wanna highlight it differently */}
                {isSmartButtonResponse && (
                    <div className='flex justify-center items-center px-2 mx-auto'>
                        <div className='flex-grow'>
                            {(message.user.name === "Summary") && <p className='text-center text-white'>Summary</p> }
                            {(message.user.name === "VocabGrammCheck") && <p className='text-center text-white'>Check Vocab and Grammar Mistakes</p> }
                            <ArrowDownCircleIcon className='h-10 w-10 mx-auto mt-2 mb-2 text-white animate-bounce flex-grow'/>
                            <div className='flex space-x-2 px-2 max-w-2xl mx-auto'>
                                <img src={message.user.avatar} alt="" className='h-8 w-8 rounded-lg'/>
                                <p className='text-gray-600 text-sm flex-grow'>{message.text}</p>
                                <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700'/>
                            </div>
                        </div>
                    </div>
                )}

                {/* If it is an Inspire Me request */}
                {isInspireMeRequest && (
                    <div className="">
                    {inspireMeQuestions.map((question, index) => (
                      <div key={index} className={`p-6 rounded-md ${index <= currentQuestion ? 'block' : 'hidden'}`}>
                        <p className='text-center text-xl text-white pb-5'>{question}</p>
                        <div className='flex flex-row items-center justify-center'>
                          {inspireMeChoices[index].map((choice, choiceIndex) => (
                            <label key={choiceIndex} className='inline-block mr-10'>
                              {choice === 'Text input' ? (
                                <input
                                  type="text"
                                  ref={textInputRef}
                                  onKeyDown={handleTextInput}
                                  className='w-48 rounded-lg'
                                />
                              ) : (
                                <button
                                  type="button"
                                  className={`px-4 py-2 rounded-md mr-4 mb-4 text-gray-700 font-medium focus:outline-none focus:ring-2  
                                    ${answers[index] === choice ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                  onClick={() => handleChoiceSelect(choice)}
                                >
                                  {choice}
                                </button>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div>
                      <button onClick={handlePrevious} className={`px-4 py-2 rounded-md mr-4 mb-4 text-gray-700 font-medium focus:outline-none focus:ring-2 
                        ${currentQuestion === 0 ? 'hidden' : 'inline-block'}`}>
                        Previous
                      </button>
                      <p>Answers:</p>
                      <ul>
                        {answers.map((answer, index) => (
                          <li key={index}>{answer}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                    
                )}
                        
   

                {/* If not, let's just display the User-AI conversations */}
                {!isSmartButtonResponse && !isInspireMeRequest && (
                    
                    <div className='flex space-x-2 px-2 max-w-2xl mx-auto'>
                        <img src={message.user.avatar} alt="" className='h-8 w-8 rounded-lg'/>
                        <p className='text-gray-600 text-sm flex-grow'>{message.text}</p>
                        <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700'/>
                    </div>
                )}

              
          </div>
      
    )
}

export default PastMessage






                    // isInspireMeRequest && 
                    // (
                    //     // <div className={`${ (prevActionChosen==="" || actionChosen==="") && "hidden"} `}>
                    //         <div className=' flex-grow'>
                    //             <p className='text-center text-white pb-5'>{message.user.name}</p> 
                    //             {/* <ArrowDownCircleIcon className='h-10 w-10 mx-auto mt-2 mb-2 text-white animate-bounce flex-grow'/> */}
                    //             <div className='flex space-x-2 px-2 max-w-2xl mx-auto'>
                    //                 {/* <img src={message.user.avatar} alt="" className='h-8 w-8 rounded-lg'/> */}
                    //                 {message.user.user_choices?.map((action:string) => (
                    //                 <div 
                    //                     onClick={() => {setActionChosen(action); updateUserAction(action)}} 
                    //                     className={`inputButton border text-gray-600 text-sm flex-grow ${actionChosen===action && "bg-green-400/70"}`}
                    //                 >
                    //                     {action}
                    //                 </div>))
                    //                 }
                    //                 <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700'/>
                    //             </div>
                    //         {/* </div> */}
                    //     </div>
                    // )