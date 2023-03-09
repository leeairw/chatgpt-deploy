import { SessionProvider } from '../components/SessionProvider';
import SideBar from '../components/SideBar';
import { getServerSession } from 'next-auth';
import '../styles/globals.css';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import LogIn from '../components/LogIn';
import ClientProvider from '../components/ClientProvider';
import { collection, orderBy, query } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"
import { db } from '../firebase';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);
  console.log(session)
  // const [chats, loading, error] = useCollection(
  //   session && 
  //   query(
  //       collection(db, "users", session.user?.email!, "chats"),
  //       orderBy("createdAt", "desc")
  //   )
  // );

  // console.log("Chats Collection: ", chats?.docs.length)

  

  return (
    <html>
      <head />
      <body>
        <SessionProvider session={session}>
          {!session ? (
            <LogIn />
          ) : (
            <div className='flex'>
              {/* Sidebar */}
              <div className={`h-screen overflow-y-auto `}>
                <SideBar />
              </div>

              {/* ClientProvider - Notification */}
              <ClientProvider />

              {/* Main Conversation Page */}
              <div className='bg-gradient-to-br from-purple-300 to-yellow-300 flex-1'>{children}</div>
          </div> 
          )} 
        </SessionProvider>  
      </body>
    </html>
  )
}
