'use client'

import { ArrowDownCircleIcon, ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { addDoc, collection, deleteDoc, doc, DocumentData, query, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import React, { useRef, useState, ChangeEvent, FormEvent } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';


const inspireMeQuestions = [
    {
        question: "User input",
        choices: [],
    },
    {
        question: "How may I help you today? :)",
        choices: ["Write a story", "Write a dialogue", "Text input"],
    },
    {
        question: "What is your student's age group?",
        choices: ["Preschool", "Elementary School", "Middle School", "High School", "College"],
    },
    {
        question: "Any grammar you'd like to highlight in your teaching?",
        choices: ["Past tense", "Future tense", "Attribution Clause", "Text input"]
    },
  ];
  

interface FormData {
    question: string;
    answer: string;
    choices: string[];
  }

function InSpireMePastMsg() {

    const [answers, setAnswers] = useState(new Array(inspireMeQuestions.length).fill(null));
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const textInputRef = useRef<HTMLInputElement>(null);

    const initialFormData: FormData[] = inspireMeQuestions.map(({ question, choices }) => ({
        question: question,
        answer: "",
        choices: choices || undefined, // Use undefined if choices is not defined
      }));
    
    const [formData, setFormData] = useState(initialFormData);

    
    function handleChange(index: number, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
        const newFormData = [...prevFormData];
        newFormData[index] = { ...newFormData[index], [name]: value };
        return newFormData;
    });
    }
    
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // do something with formData, e.g. send it to a server
    console.log(formData);
    }

    function handleTextInput(event: React.KeyboardEvent<HTMLInputElement>) {
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


    return (
        <form onSubmit={handleSubmit}>
            {formData.map((data, index) => 
                (index == 0) ? (
                    <div>
                        <label htmlFor="textInput" className="mr-2">What topics would you like to be Inspired on?</label>
                        <input
                            type="text"
                            id="textInput"
                            ref={textInputRef}
                            onKeyDown={handleTextInput}
                            className='w-48 rounded-lg'
                            placeholder="Type some text"
                        />
                    </div>
                ) : (
                    <div key={index}>
                        <label htmlFor={`answer-${index}`}>{data.question}</label>
                        {data.choices ? (
                        <select
                            id={`answer-${index}`}
                            name="answer"
                            value={data.answer}
                            onChange={(event) => handleChange(index, event)}
                        >
                            <option value="">Select an option</option>
                            {data.choices.map((choice, i) => (
                            <option key={i} value={choice}>
                                {choice}
                            </option>
                            ))}
                        </select>
                        ) : (
                        <input
                            type="text"
                            id={`answer-${index}`}
                            name="answer"
                            value={data.answer}
                            onChange={(event) => handleChange(index, event)}
                        />
                        )}
                    </div>
                    )
            )}
            <button type="submit">Submit</button>
      </form>
    );
}

export default InSpireMePastMsg;