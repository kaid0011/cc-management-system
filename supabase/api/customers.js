import { supabase } from '../config.js';

// Fetch all customers
export async function fetchAllCustomers() {
  let { data: customers, error } = await supabase
    .from('customers')
    .select('*');
  if (error) throw new Error(error.message);
  return customers;
}

// Create a new customer
export async function createCustomer(customer) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer]);
  if (error) throw new Error(error.message);
  return data;
}

// Update an existing customer
export async function updateCustomers(customer) {
  const { data, error } = await supabase
    .from('customers')
    .update(customer)
    .match({ id: customer.id });
  if (error) throw new Error(error.message);
  return data;
}

// Delete a customer
export async function deleteCustomers(customerId) {
  const { data, error } = await supabase
    .from('customers')
    .delete()
    .match({ id: customerId });
  if (error) throw new Error(error.message);
  return data;
}
