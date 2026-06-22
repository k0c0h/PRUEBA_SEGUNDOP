const { signToken } = require('./src/services/jwt.service');

const token = signToken({
  id: 'usr_001',
  name: 'Estudiante Alpha'
});

console.log(token);