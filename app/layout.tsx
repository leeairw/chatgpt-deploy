import { SessionProvider } from '../components/SessionProvider';
import SideBar from '../components/SideBar';
import { getServerSession } from 'next-auth';
import '../styles/globals.css';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import LogIn from '../components/LogIn';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);
  console.log(session)

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
            <div className='bg-[#202123] max-w-xs h-screen overflow-y-auto md:min-w-[20rem]'>
              <SideBar />
            </div>

            {/* ClientProvider - Notification */}

            {/* Main Conversation Page */}
            <div className='bg-gradient-to-br from-purple-300 to-yellow-300 flex-1'>{children}</div>
          </div> 
          )} 
        </SessionProvider>     
      </body>
    </html>
  )
}
