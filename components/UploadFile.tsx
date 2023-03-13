import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import useSWR from "swr";


type Props = {
    chatId: string;
}


function UploadButton({chatId}: Props) {
  const {data:session} = useSession();
  const { data: model, mutate: setModel } = useSWR('model', {
    fallbackData: 'gpt-3.5-turbo'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
//   const [textInput, setTextInput] = useState("")
  
  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    setIsUploaded(false);
    setSelectedFile(e.target.files ? e.target.files[0] : null);
    
  }

  const handleUploadFile = async() => {
    if (!selectedFile) return;
    setIsUploaded(true);

    const reader = new FileReader();

    reader.onload = async(e) => {
      const text = e.target?.result as string;
      console.log(text); // logs the contents of the file as text

      const textUploaded = "Please assess the file below, give me a brief summary about what it is and also let me know if you see any vocabulary or grammar mistakes. Thank you! "+text
      // Define the Message input format
        const message: Message = {
            text: textUploaded,
            createdAt: serverTimestamp(),
            user: {
                _id: session?.user?.email!,
                name: session?.user?.name!,
                type: "UserFileUpload",
                avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
            }
        }

      // Add the new message to firebase
     await addDoc(
        collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
        message 
    );

    // Toast notification to say Loading
    const notification = toast.loading('Smart Lingo is thinking...')
    await fetch('/api/askQuestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            prompt: message, chatId, model, session
        }),
    }).then(() => {
        // Toast notificaion to say successful!
        toast.success("Smart Lingo has responded!", {
            id: notification,
        })
    })

        
    };
     
    reader.readAsText(selectedFile); 
  }

  return (
    <div>
        <div className='flex flex-row items-center justify-center space-x-1'>
            <div className='uploadButton border border-black cursor-pointer'>
                <label htmlFor="file-upload" className="inline-block">
                    <span className="cursor-pointer">
                        Choose File
                    </span>
                    <input id="file-upload" type="file" onChange={handleFileInput} className="hidden" />
                </label>
            </div>
            {selectedFile && !isUploaded && (
                <button
                    className="border border-black uploadButton"
                    onClick={handleUploadFile}
                >
                    Upload
                </button>
            )}
        </div> 
        <div>
            {selectedFile && (
            <div className="text-gray-700">{selectedFile.name}</div>
            )}
        </div>
    </div>
  );
}

export default UploadButton;
