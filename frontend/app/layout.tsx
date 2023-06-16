import './globals.css'


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
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <title>WCS</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="rootLayout">
          {children}
        </div>
      </body>
    </html>
  )
}
