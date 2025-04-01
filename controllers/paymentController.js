import { Payment } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// Create Payment
export const createPayment = async (req, res) => {
  const { appointmentId, amount } = req.body;

  try {
    // Generate a unique transaction ID
    let transaction_id;
    let isUnique = false;

    while (!isUnique) {
      transaction_id = uuidv4(); // Generate a new UUID
      const existingTransaction = await Payment.findOne({ where: { transaction_id } });

      if (!existingTransaction) {
        isUnique = true;
      }
    }

    // Create the payment
    const newPayment = await Payment.create({
      appointmentId,
      amount,
      transaction_id,
      status: 'pending',
    });

    res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
