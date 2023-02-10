import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body>
        <div className='flex'>
          {/* Sidebar */}

          {/* ClientProvider - Notification */}

          <div className='bg-gradient-to-br from-purple-300 to-yellow-300 flex-1'>{children}</div>
        </div> 
          
      </body>
    </html>
  )
}
