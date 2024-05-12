const express = require('express')
const mongoose = require('mongoose')
const PatientModel = require('./Patients')
const DoctorModel = require('./Doctors')
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

app.get('/', (req, res) => {
  PatientModel.find()
    .then(user => res.json(user))
    .catch(err => res.json(err))
})



// login
app.get('/doctors/:id', async (req, res) => {
  const id = req.params.id
  DoctorModel.create({_id:id})
  .then(post => res.json(post))
  .catch(err => res.json(err))

});

app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
      const user = await DoctorModel.findOne({ name });

      if (!user) {
          return res.status(401).json({ message: "User not found" });
      }
      if (user.password !== password) {
          return res.status(401).json({ message: "Invalid password" });
      }

      res.status(200).json({ message: "Login successful", userId: user._id, name:user.name});
  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "An error occurred during login" });
  }
});

// for the appointments
app.post('/register', (req, res) => {
  DoctorModel.create(req.body)
      .then(user => {
          console.log("User created successfully:", user);
          res.json(user);
      })
      .catch(err => {
          console.error("Error creating user:", err);
          res.status(500).json({ error: "Failed to create user" });
      });
});

app.get('/get/:id', (req, res) => {
  const id = req.params.id
  PatientModel.findById({_id : id})
    .then (post => res.json(post))
    .catch (err => console.log(err))
})

app.post('/create', (req, res) => {
  PatientModel.create(req.body)
  .then(user => res.json(user))
  .catch(err => res.json(err))
})

app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = {
    patientname: req.body.patientname,
    age: req.body.age,
    gender: req.body.gender,
   // contactn: req.body.contactn,
    email: req.body.email,
    preferred_clinic: req.body.preferred_clinic,
    appointment_date: req.body.appointment_date,
    appointment_time: req.body.appointment_time,
    reason: req.body.reason,
    status: req.body.status,
    note: req.body.note
  };

  PatientModel.findByIdAndUpdate(id, updatedData, { new: true })
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

app.delete('/deleteuser/:id', (req, res) => {
  const id = req.params.id;

  PatientModel.findByIdAndDelete({_id : id})
    .then (response => res.json(response))
    .catch(err => res.json(err))

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


