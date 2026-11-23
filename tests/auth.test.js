const request = require('supertest');
const app = require('../backend/server');

describe('Kullanıcı Kimlik Doğrulama (Auth) Modülü Entegrasyon Testleri', () => {
  const testUser = {
    username: 'cagribaspinar',
    email: 'cagri@example.com',
    password: 'Password123'
  };

  test('AUTH-4: Yeni kullanıcı kaydı başarılı olmalı (201)', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
  });

  test('AUTH-4: Aynı e-posta ile tekrar kayıt engellenmeli (409)', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(testUser);

    expect(res.statusCode).toBe(409);
  });

  test('AUTH-5: Kayıtlı kullanıcı bilgileri ile giriş başarılı olmalı (200)', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('AUTH-6: Şifre sıfırlama işlemi başarılı olmalı ve yeni şifre ile giriş yapılabilmeli', async () => {
    const newPassword = 'NewPassword456';

    const resetRes = await request(app)
      .post('/api/reset-password')
      .send({
        email: testUser.email,
        newPassword
      });

    expect(resetRes.statusCode).toBe(200);

    const loginRes = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: newPassword
      });

    expect(loginRes.statusCode).toBe(200);
  });
});