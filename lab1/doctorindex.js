const express = require('express')
const mongoose = require('mongoose')
const DoctorModel = require('./lab1/Doctors')
const cors = require('cors')

const app = express()
const port = 3001
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/DrAppointment', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));

app.post('/register', async (req, res) => {
  DoctorModel.create(req.body)
  .then(doctors => res.json(doctors))
  .catch(err => res.json(err))

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


