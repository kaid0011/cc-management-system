import { supabase } from '../config.js';

// Insert a new order
export const insertOrder = async (
    order_no,
    order_date_time,
    ready_by,
    status,
    image
  ) => {
    const { data, error } = await supabase
      .from("orders")
      .insert([{ order_no, order_date_time, ready_by, status, image}])
      .select();
  
    if (error) {
      throw error;
    }
  
    return data[0];
  };
  
  // Insert a new customer
  export const insertCustomer = async (customerData) => {
    const { data, error } = await supabase
      .from("customers")
      .insert([customerData])
      .select();
  
    if (error) {
      throw error;
    }
  
    return data[0];
  };
  
  // Insert multiple transactions
  export const insertTransactions = async (transactionsData) => {
    const { error } = await supabase
      .from("transactions")
      .insert(transactionsData);
  
    if (error) {
      throw error;
    }
  };
  
  // Get the maximum tag_no from the transactions table
  export const getMaxTagNo = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("tag_no")
      .order("tag_no", { ascending: false })
      .limit(1)
      .single();
  
    if (error && error.code !== "PGRST116") {
      throw error;
    }
  
    return data ? data.tag_no : 0;
  };
  
  // Get the maximum order ID
  export const getMaxOrderId = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .order("id", { ascending: false })
      .limit(1)
      .single();
  
    if (error && error.code !== "PGRST116") {
      throw error;
    }
  
    return data ? data.id : 0;
  };
  
  // Upload the photo to Supabase storage
  export const uploadPhoto = async (file) => {
    const timestamp = Date.now();
    const newFileName = `photo_${timestamp}.jpg`;
  
    const { data, error } = await supabase.storage
      .from("pos_image")
      .upload(newFileName, file);
  
    if (error) throw error;
  
    return `https://efvrcniptqvxskubaebr.supabase.co/storage/v1/object/public/pos_image/${newFileName}`;
  };
  
  // Update the order with the customer photo URL
  export const updateOrderWithPhoto = async (orderId, photoUrl) => {
    const { error } = await supabase
      .from("orders")
      .update({ image: photoUrl })
      .eq("id", orderId);
    if (error) throw error;
  };
  
  // Insert instructions
  export async function insertInstructions(instruction) {
    const { data, error } = await supabase
      .from('instructions')
      .insert([instruction]);
  
    if (error) {
      throw error;
    }
    return data;
  }
  