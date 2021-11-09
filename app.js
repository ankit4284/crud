if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const dbUrl = process.env.DB_URL
mongoose.connect(
  dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/register', async (req, res, next) => {
  // console.log(req.body)
  try {
    let {
      name,
      username,
      pass
    } = req.body
    const hash = await bcrypt.hash(pass, 12);
    pass=hash;
    const p = new User({
      name,
      username,
      pass
    })
     await p.save(p);
     res.send(`Done with registrating the following record \n${p}`);
  } catch (e) {
    console.log(e)
    res.status(500).send('Error.')
  }
});
app.get("/readUser",async (req, res) =>{
    const fuser= await User.find({ username: req.body.username });
    if(fuser!=null)
    res.send(fuser);
    else
    res.send("Error");
});
app.put("/updateUser", async (req, res) => {
  const fuser  = req.body.username;
  const newName = req.body.newName;
  let newUser = await User.findOneAndUpdate({username: req.body.username}, { name:newName },{new:true});
  // console.log(newUser);
  if(newUser!=null)
  res.send(`Done with updating, the new record is:\n${newUser}`);
  else
  res.send("Error");
});
app.delete("/deleteUser",async (req, res) =>{
  const fuser= await User.findOneAndDelete({ username: req.body.username });
  if(fuser!=null)
  res.send( `Done with Deleting the following record\n${fuser}`);  
  else
  res.send("Error");
});
app.listen(3000, () => {
  console.log(`serving on the port ${3000}`)
});
