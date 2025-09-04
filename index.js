const express = require('express')
const app = express()
const port = 3000

app.get('/blog', (req, res) => {
//   res.send('Hello World!')
  res.json({message: "Hello World!123123"});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})