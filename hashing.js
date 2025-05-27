import bcrypt from 'bcrypt';

const saltRounds = 10;

const users = [
  { email: 'me@admin.com', password: 'admin123', role: 'admin' },
];

users.forEach(user => {
  const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
  console.log(`INSERT INTO users (email, password, role, created_at, updated_at) 
  VALUES ('${user.email}', '${hashedPassword}', '${user.role}', NOW(), NOW());`);
});
