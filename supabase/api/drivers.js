import { supabase } from '../config.js';

// Fetch all drivers from the database
export const fetchAllDrivers = async () => {
  try {
    const { data: drivers, error } = await supabase
      .from('drivers')
      .select('*');
    if (error) {
      console.error('Error fetching drivers:', error.message);
      return [];
    }
    return drivers;
  } catch (error) {
    console.error('Unexpected error fetching drivers:', error.message);
    return [];
  }
};

// Create a new driver in the database
export const createDriver = async (newDriver) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .insert([newDriver]);
    if (error) {
      console.error('Error creating driver:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error creating driver:', error.message);
    return null;
  }
};

// Update an existing driver in the database
export const updateDrivers = async (driver) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update({
        name: driver.name,
        code: driver.code,
        contact_no1: driver.contact_no1
      })
      .eq('id', driver.id);
    if (error) {
      console.error('Error updating driver:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error updating driver:', error.message);
    return null;
  }
};

// Delete a driver from the database
export const deleteDrivers = async (driverId) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', driverId);
    if (error) {
      console.error('Error deleting driver:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error deleting driver:', error.message);
    return null;
  }
};
