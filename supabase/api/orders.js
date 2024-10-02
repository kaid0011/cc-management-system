// File path: supabase/api/orders.js

import { supabase } from '../config.js';

// Utility function to perform database queries with error handling
async function queryDatabase(tableName, conditions, single = false, columns = '*') {
  try {
    let query = supabase.from(tableName).select(columns);

    // Apply conditions if provided
    if (conditions) {
      for (const [column, value] of Object.entries(conditions)) {
        query = query.eq(column, value);
      }
    }

    // Fetch single record if specified
    if (single) {
      query = query.single();
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error querying ${tableName}:`, error.message);
    throw error;
  }
}

// Function to update a collection's contact person
export async function updateCollectionContactPerson(collectionId, contactPersonId) {
  try {
    const { data, error } = await supabase
      .from('collections')
      .update({ contact_person_id: contactPersonId })
      .eq('id', collectionId)
      .select(); // Use select to return updated data

    if (error) {
      throw error;
    }

    console.log(`Updated collection ${collectionId} with contact person ${contactPersonId}`, data);
  } catch (error) {
    console.error('Error updating collection contact person:', error.message);
    throw error;
  }
}

// Function to update a delivery's contact person
export async function updateDeliveryContactPerson(deliveryId, contactPersonId) {
  try {
    const { data, error } = await supabase
      .from('deliveries')
      .update({ contact_person_id: contactPersonId })
      .eq('id', deliveryId)
      .select(); // Use select to return updated data

    if (error) {
      throw error;
    }

    console.log(`Updated delivery ${deliveryId} with contact person ${contactPersonId}`, data);
  } catch (error) {
    console.error('Error updating delivery contact person:', error.message);
    throw error;
  }
}

// Fetch collection details by collection ID
export async function fetchCollectionDetails(collectionId) {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        date_from,
        date_to,
        status,
        area,
        remarks,
        contact_persons (*),
        drivers (name)  // Select driver's name
      `)
      .eq('id', collectionId)
      .single();

    if (error) {
      throw error;
    }

    return {
      collection: {
        ...data,
        driver_name: data.drivers?.name || "N/A", // Add driver's name with fallback
      },
      contact_person: data.contact_persons || {},
    };
  } catch (error) {
    console.error('Error fetching collection details:', error.message);
    throw error;
  }
}

// Fetch delivery details by delivery ID
export async function fetchDeliveryDetails(deliveryId) {
  try {
    const { data, error } = await supabase
      .from('deliveries')
      .select(`
        date_from,
        date_to,
        status,
        area,
        remarks,
        contact_persons (*),
        drivers (name)  // Select driver's name
      `)
      .eq('id', deliveryId)
      .single();

    if (error) {
      throw error;
    }

    return {
      delivery: {
        ...data,
        driver_name: data.drivers?.name || "N/A", // Add driver's name with fallback
      },
      contact_person: data.contact_persons || {},
    };
  } catch (error) {
    console.error('Error fetching delivery details:', error.message);
    throw error;
  }
}

// Fetch list of all drivers
export async function fetchAllDrivers() {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('id, name'); // Fetch driver ID and name

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching drivers:', error.message);
    throw error;
  }
}

// Fetch all orders with related invoices
export async function fetchAllOrders() {
  return await queryDatabase('orders');
}

// Fetch basic order details by order ID
export async function fetchOrderDetails(orderId) {
  const data = await queryDatabase('orders', { id: orderId }, true);
  if (!data) {
    throw new Error(`No order found with order ID: ${orderId}`);
  }
  return data;
}

// Fetch customer details by customer ID
export async function fetchCustomerDetails(customerId) {
  return await queryDatabase('customers', { id: customerId }, true);
}

// Fetch transactions by order ID
export async function fetchTransactionsByOrderId(orderId) {
  return (await queryDatabase('transactions', { order_id: orderId })) || [];
}

// Fetch instructions by order ID
export async function fetchInstructionsByOrderId(orderId) {
  return (await queryDatabase('instructions', { order_id: orderId })) || [];
}

// Fetch contact persons by customer ID
export async function fetchContactPersonsByCustomerId(customerId) {
  return (await queryDatabase('contact_persons', { customer_id: customerId })) || [];
}

export async function updateCollectionDetails(collectionId, updateData) {
  try {
    const { data, error } = await supabase
      .from('collections')
      .update(updateData)
      .eq('id', collectionId)
      .select(); // Use select to return updated data

    if (error) {
      throw error;
    }

    console.log(`Updated collection ${collectionId} with data:`, data);
    return data;
  } catch (error) {
    console.error('Error updating collection details:', error.message);
    throw error;
  }
}

export async function updateDeliveryDetails(deliveryId, updateData) {
  try {
    const { data, error } = await supabase
      .from('deliveries')
      .update(updateData)
      .eq('id', deliveryId)
      .select(); // Use select to return updated data

    if (error) {
      throw error;
    }

    console.log(`Updated delivery ${deliveryId} with data:`, data);
    return data;
  } catch (error) {
    console.error('Error updating delivery details:', error.message);
    throw error;
  }
}