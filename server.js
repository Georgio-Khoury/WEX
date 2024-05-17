const express = require('express');
const websocketserver = require('./websocket/websocket')
require('dotenv').config();
const app = express();
const port = 3001
const bodyParser = require('body-parser');
const cors = require('cors')
const {initializeFireBase} = require('./firebase')
initializeFireBase()
app.use(cors({
    origin: ['https://wex-frontend.onrender.com','http://localhost:5173'],  // replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable credentials (cookies, authorization headers)
  }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
 app.use(express.json()); 


const CartRoute = require('./routes/CartRoutes');
app.use(CartRoute);

const ChatRoute = require('./routes/ChatRoutes');
app.use(ChatRoute);

const UserRoute = require('./routes/UserRoutes');
app.use(UserRoute);

const ProductRoute = require('./routes/ProductRoutes');
app.use(ProductRoute); 




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});