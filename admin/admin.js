import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import { sequelize, User, Doctor, Specialization, Appointment, Payment, Availability, UserProfile  } from '../models/index.js';
import uploadFeature from '@adminjs/upload';

AdminJS.registerAdapter(AdminJSSequelize);

const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: '/admin',
  resources: [
	{ resource: User, options: { parent: { name: 'User Management' } } },
	
	{ 
		resource: Doctor, 
		options: { 
			parent: { name: 'Doctors' },
			properties: {
				biography: {
				  type: 'textarea',
				  isVisible: { list: false, edit: true, filter: false, show: true },
				},
			  },
		}
	 },
	{ resource: Specialization, options: { parent: { name: 'Doctors' } } },
	{ resource: Appointment, options: { parent: { name: 'Appointments' } } },
	{ resource: Payment, options: { parent: { name: 'Payments' } } },
	{ 
	  
		resource: Availability, 
		options: { 
			parent: { name: 'Doctors' }, 
			properties: {
				startTime: {
					type: 'datetime',
					isVisible: { list: true, edit: true, filter: true, show: true },
				},
				endTime: {
					type: 'datetime',
					isVisible: { list: true, edit: true, filter: true, show: true },
				},
			  },
		},
	},
  ],
});

const adminRouter = AdminJSExpress.buildRouter(adminJs);

export default adminRouter;
