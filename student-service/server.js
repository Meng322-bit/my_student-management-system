const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const studentSchema = new mongoose.Schema({
  student_id: Number,
  student_name: String,
  student_mobile: String,
  student_email: String,
  student_password: String
});
const Student = mongoose.model('Student', studentSchema);

// UPDATE student mobile number and/or password
app.put('/students/:id', async (req, res) => {
  try {
    const update = {};
    if (req.body.student_mobile) update.student_mobile = req.body.student_mobile;
    if (req.body.student_password) update.student_password = await bcrypt.hash(req.body.student_password, 10);

    if (Object.keys(update).length === 0)
      return res.status(400).json({ message: 'Provide student_mobile or student_password' });

    const student = await Student.findOneAndUpdate(
      { student_id: Number(req.params.id) },
      update,
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student updated successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.listen(5002, () => console.log('Student service on 5002'));