'use client'

import { ArrowDownCircleIcon, ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { addDoc, collection, deleteDoc, doc, DocumentData, query, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import React, { useRef, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import InSpireMePastMessage from './InSpireMePastMessage';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';


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
    
    // delete chat
    const removeChat = async() => {
        await deleteDoc(
            doc(db, "users", session?.user?.email!, "chats", chatId, "messages", messageId)
        )
    }

    // if the output has code, use an array to remember the index of code lines
    const codeIndices: number[] = [];


    console.log("AI Response in Past Message: ", message.text)

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
                            {/* <p className='text-gray-600 text-sm flex-grow'>{message.text}</p> */}
                            <div className='flex flex-col px-5'>
                                {message.text.split("\n").map((line:string, index:number) => (
                                    <div key={index} className="mb-2">
                                        {line.startsWith("```") && line.endsWith("```") ? (
                                            <SyntaxHighlighter language="python" style={darcula} showLineNumbers={true}>
                                                {line.slice(4, -4)}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <p className='text-gray-600 text-sm flex-grow'>{line}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700'/>
                        </div>
                        </div>
                    </div>
                  
                )}

                {/* If it is an Inspire Me request */}
                {isInspireMeRequest && <InSpireMePastMessage/>}

                {/* If not, let's just display the User-AI conversations */}
                {!isSmartButtonResponse && !isInspireMeRequest && (
                    
                    <div className='flex space-x-2 px-2 max-w-2xl mx-auto justify-between flex-grow'>
                        <img src={message.user.avatar} alt="" className='h-8 w-8 rounded-lg'/>
                        <div className='flex flex-col flex-grow'>
                            {message.text.split("\n").map((line: string, index: number, lines: string[]) => {
                                

                                if (line.startsWith("```")) {
                                    const language = line.slice(3).trim();
                                    const codeStart = index + 1;
                                    const codeEnd = lines.findIndex((l: string, i: number) => i > index && l.endsWith("```"));
                                    console.log("Code Start: ", codeStart)
                                    console.log("Code End: ", codeEnd)
                                    

                                    if (codeEnd === -1 ) {
                                        return (
                                            <pre key={index} className=" rounded-lg p-2 text-white">
                                                <code>{line.slice(3)}</code>
                                            </pre>
                                        );
                                    }

                                    const codeLines = lines.slice(codeStart, codeEnd);
                                    
                                    
                                    if (codeEnd - codeStart > 3 ) {
                                        for (let i = codeStart; i <= codeEnd; i++) {
                                            codeIndices.push(i);
                                        }
                                        console.log("current code indices: ", codeIndices)
                                        return (
                                            <div className='max-w-xl overflow-scroll-x'>
                                                <SyntaxHighlighter 
                                                    key={index} language={language} style={darcula} showLineNumbers={true}
                                                    className={`rounded-lg`}
                                                >
                                                {codeLines.join("\n")}
                                                </SyntaxHighlighter>
    
                                            </div>
                                        )}
                                } 
                                else {
                                    console.log("current index: ", index)
                                    if (!codeIndices.includes(index)) {
                                        return (
                                            <p key={index} className='text-gray-600 text-sm flex-grow'>
                                                {line}
                                            </p>
                                        );
                                    }
                                    
                                }
                            })}
                        </div>
                        <TrashIcon onClick={removeChat} className='shrink-0 h-5 w-5 text-gray-700 hover:text-red-700 ml-auto'/>
                    </div>


                )}

              
          </div>
      
    )
}

export default PastMessage