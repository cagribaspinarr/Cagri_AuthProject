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

// AUTH-5: Kullanıcı Giriş (Login) API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-posta ve şifre zorunludur.' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
  }

  return res.status(200).json({
    message: 'Giriş başarılı.',
    token: `mock-jwt-token-${user.id}`,
    user: { id: user.id, username: user.username, email: user.email }
  });
});

// AUTH-6: Şifre Sıfırlama API
app.post('/api/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'E-posta ve yeni şifre zorunludur.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Yeni şifre en az 6 karakter olmalıdır.' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı.' });
  }

  user.password = newPassword;

  return res.status(200).json({
    message: 'Şifre başarıyla güncellendi.'
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
}

module.exports = app;