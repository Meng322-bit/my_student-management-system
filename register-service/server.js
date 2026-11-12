const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const studentSchema = new mongoose.Schema({
  student_id: { type: Number, unique: true },
  student_name: { type: String, required: true },
  student_mobile: { type: String, required: true },
  student_email: { type: String, required: true, unique: true },
  student_password: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

app.post('/register', async (req, res) => {
  try {
    const { student_name, student_mobile, student_email, student_password } = req.body;
    if (!student_name || !student_mobile || !student_email || !student_password)
      return res.status(400).json({ message: 'All fields are required' });

    if (await Student.findOne({ student_email }))
      return res.status(409).json({ message: 'Email already registered' });

    const last = await Student.findOne().sort({ student_id: -1 });
    const student_id = last ? last.student_id + 1 : 1;
    const hashed = await bcrypt.hash(student_password, 10);

    await Student.create({ student_id, student_name, student_mobile, student_email, student_password: hashed });
    res.status(201).json({ message: 'Student registered', student_id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.listen(5001, () => console.log('Register service on 5001'));