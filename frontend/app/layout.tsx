import '../styles/globals.scss'
import Navbar from './components/navbar/Navbar'

export const metadata = {
  title: 'WCS App',
  description: '',
}

type IAppLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: IAppLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>WCS</title>
      </head>
      <body>
        <header>
          <nav>
            <Navbar/>
          </nav>
        </header>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="rootLayout">
          {children}
        </div>
      </body>
    </html>
  )
}
