const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDb = require("./routes/config/db");
const app = express();
const PORT = process.env.PORT || 3000;
// const connectDb = require('./config/db');

const indexRouter = require('./routes/main');
const postRouter = require('./routes/posts');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cors());

app.use('/', indexRouter);
app.use('/posts', postRouter);

connectDb().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is working on ${PORT} port!`);
    })
}).catch((err)=>{
    console.log('Error', JSON.stringify(err));
})


