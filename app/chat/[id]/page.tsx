import React from 'react'
import VocabGrammCheck from '../../../components/VocabGrammCheck'


function ChatPage() {
  return (
    <div className='flex'>
        <div className='p-5'>
         <VocabGrammCheck />
        </div>
        
        {/* <VocabGrammCheck key={id} id={id}/> */}
    </div>
    
  )
}

export default ChatPage


// type Props = {
//     id:string;
// };

// function ChatRow({id}: Props) {

//   const pathname = usePathname();
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [active, setActive] = useState(false);

//   const [messages] = useCollection(
//         collection(db, "users", session?.user?.email!, "chats", id, "messages")
//   );

//   // dynamically check if the pathname has an id - chat being clicked on
//   useEffect(() => {
//     if (!pathname) return;
//     setActive(pathname.includes(id));
//     }, [pathname]);

//   // delte chat
//   const removeChat = async() => {
//     await deleteDoc(
//         doc(db, "users", session?.user?.email!, "chats", id)
//     )

//     router.push(`/`);
//   }
  
  
//   return (
//     <Link href={`chat/${id}`} className={`chatRow justify-center border-gray-700 border ${active && "bg-gray-700/50"}`}>
//         <div className='flex space-x-1  '>   
//             <ChatBubbleLeftIcon className='h-5 w-5 text-white'/>
//             <p className=' hidden truncate md:block md:inline-text md:text-white justify-center text-center'>
//                 {/* Pull the last bit of that chat, or just say 'New Chat' */}
//                 {messages?.docs[messages?.docs.length - 1]?.data().text || "New Chat"}
//             </p>
//             <TrashIcon onClick={removeChat} className='h-5 w-5 text-gray-700 hover:text-red-700'/>
//         </div>
//     </Link>
    
//   )
// }

// export default ChatRow