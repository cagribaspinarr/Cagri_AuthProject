const express = require('express');
const app = express();
app.use(express.json());

const users = [];

// AUTH-4: Kullanıcı Kayıt (Register) API
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Tüm alanlar zorunludur.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
  }

  const newUser = { id: users.length + 1, username, email, password };
  users.push(newUser);

  return res.status(201).json({
    message: 'Kullanıcı başarıyla kaydedildi.',
    user: { id: newUser.id, username: newUser.username, email: newUser.email }
  });
});

module.exports = app;