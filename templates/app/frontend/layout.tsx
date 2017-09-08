import createElement from 'inferno-create-element'

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <title>APP_NAME</title>
      </head>
      <body>
        <div id='root'>{children}</div>
      </body>
    </html>
  );
}