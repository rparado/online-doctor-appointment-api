import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import { sequelize, User, Doctor, Specialization, Appointment, Payment, Availability, UserProfile  } from '../models/index.js';

AdminJS.registerAdapter(AdminJSSequelize);

const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: '/admin',
  resources: [
	{ resource: User, options: { parent: { name: 'User Management' } } },
	{ resource: Doctor, options: { parent: { name: 'Doctors' } } },
	{ resource: Specialization, options: { parent: { name: 'Doctors' } } },
	{ resource: Appointment, options: { parent: { name: 'Appointments' } } },
	{ resource: Payment, options: { parent: { name: 'Payments' } } },
	{ 
	  
		resource: Availability, 
		options: { 
			parent: { name: 'Doctors' }, 
			properties: {
				doctorId: {
				  reference: 'Doctors',
				  isVisible: { list: true, filter: true, show: true, edit: true },
				  availableValues: async () => {
					try {
					  console.log("🚀 Fetching doctors...");
					  
					  // Fetch doctors with their names via UserProfile
					  const doctors = await Doctor.findAll({
						include: [{
							model: UserProfile,    // Include UserProfile to get the doctor's name
							attributes: ['fullname']
						  }]
					  });
			  
					  // Log the fetched doctors to check the data structure
					  console.log("✅ Doctors found:", doctors.map(d => ({
						doctorId: d.id,
						name: d.User?.UserProfile?.fullname || 'No Name',
					  })));
			  
					  // Return the doctors as value-label pairs for the dropdown
					  const availableValues = doctors.map(doctor => ({
						value: doctor.id,  // The value to store (doctor ID)
						label: doctor.User?.UserProfile?.fullname || 'No Name',  // The label to display (doctor name)
					  }));
			  
					  // Log the availableValues to make sure it is correct
					  console.log("Available values for doctorId:", availableValues);
			  
					  return availableValues;
					} catch (error) {
					  console.error("❌ Error fetching doctors:", error);
					  return [];  // Return an empty array in case of an error
					}
				  }
				},
			}
			  
		},
	},
  ],
});

const adminRouter = AdminJSExpress.buildRouter(adminJs);

export default adminRouter;
