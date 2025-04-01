import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import { sequelize, User, Doctor, Specialization, Appointment, Payment, Availability } from '../models/index.js';

AdminJS.registerAdapter(AdminJSSequelize);
const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: '/admin',
});
const adminRouter = AdminJSExpress.buildRouter(adminJs);
// const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
//   authenticate: async (email, password) => {
//     // Find user with email
//     const user = await User.findOne({ where: { email } });

//     // Check if user exists and password is correct
//     if (user && await bcrypt.compare(password, user.password)) {
//       return user; // Successful login
//     }
//     return false; // Authentication failed
//   },
//   cookiePassword: process.env.SESSION_SECRET || 'supersecret',
// }, null, {
//   resave: false,
//   saveUninitialized: true,
//   secret: 'some-secret-password',
//   cookie: { secure: process.env.NODE_ENV === 'production' },
//   name: 'adminjs',
// });
export default adminRouter;