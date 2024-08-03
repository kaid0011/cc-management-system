import { supabase } from '../config.js';

// Fetch contact persons by customer ID
export async function fetchContactPersonsByCustomerId(customerId) {
  let { data, error } = await supabase
    .from('contact_persons')
    .select('*')
    .eq('customer_id', customerId);
  if (error) throw new Error(error.message);
  return data;
}

// CRUD functions for contact persons
export async function createContactPerson(contactPerson) {
  const { data, error } = await supabase
    .from('contact_persons')
    .insert([contactPerson]);
  if (error) throw new Error(error.message);
  return data;
}

export async function updateContactPersons(contactPerson) {
  const { data, error } = await supabase
    .from('contact_persons')
    .update(contactPerson)
    .match({ id: contactPerson.id });
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteContactPersons(contactPersonId) {
  const { data, error } = await supabase
    .from('contact_persons')
    .delete()
    .match({ id: contactPersonId });
  if (error) throw new Error(error.message);
  return data;
}
