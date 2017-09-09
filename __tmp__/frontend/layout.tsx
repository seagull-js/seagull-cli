import createElement from 'inferno-create-element'

// this is what your index.html looks like
export default function Layout({ children }) {
  return (
    <html>
      <head>
        <title>__tmp__</title>
      </head>
      <body>
        <div id='root'>{children}</div>
      </body>
    </html>
  );
}