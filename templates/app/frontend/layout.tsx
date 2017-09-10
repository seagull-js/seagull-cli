import createElement from 'inferno-create-element'

// this is what your index.html looks like
export default function Layout({ children }) {
  return (
    <html>
      <head>
        <title>APP_NAME</title>
      </head>
      <body>
        <div id='root'>{children}</div>
        <script src='/assets/bundle.js'></script>
      </body>
    </html>
  );
}