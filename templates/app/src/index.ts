import App from 'seagull'

const app = new App('APP_NAME')
app.get('/hello', async (req) => 'world')

module.exports = app