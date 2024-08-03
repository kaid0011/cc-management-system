// File path: supabase/api/invoices.js

import { supabase } from '../config.js';

// Fetch all orders with related invoices
export async function fetchAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders_pos')
      .select(`*`);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw error;
  }
}

// Fetch all orders with related invoices
export async function fetchAllInvoices() {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`*`);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw error;
  }
}

// Fetch order details by order ID
export async function fetchOrderDetails(orderId) {
  try {
    const { data, error } = await supabase
      .from('orders_pos')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error(`No order found with order: ${orderId}`);
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching order details:', error.message);
    throw error;
  }
}

// Fetch transactions by order ID
export async function fetchTransactionsByOrderId(orderId) {
  try {
    const { data, error } = await supabase
      .from('transactions_pos')
      .select('*')
      .eq('order_id', orderId);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    throw error;
  }
}

export async function fetchInstructionsByOrderId(orderId) {
  try {
    const { data, error } = await supabase
      .from('instructions_pos')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching instructions:', error);
    throw error;
  }
}

// Update order status and date by ID
export async function updateOrderStatusAndDateById(orderId, status, dateTime) {
  try {
    const { data, error } = await supabase
      .from('orders_pos')
      .update({ status, order_date_time: dateTime })
      .eq('id', orderId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating order status and date:', error);
    throw error;
  }
}

// Fetch customer details by order ID
export async function fetchCustomerDetailsByOrderId(orderId) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching customer details:', error);
    throw error;
  }
}

// Insert an invoice by order ID
export async function insertInvoiceByOrderId(orderId) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert([{ order_id: orderId, invoice_date_time: new Date().toISOString() }])
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error inserting invoice by order ID:', error.message);
    throw error;
  }
}

// Fetch invoice by order ID
export async function fetchInvoiceByOrderId(orderId) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching invoice by order ID:', error.message);
    throw error;
  }
}

// Fetch details by invoice number
export async function fetchDetailsByInvoiceNo(invoiceNo) {
  try {
    // Fetch the invoice with the given invoiceNo
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_no', invoiceNo)
      .single();

    if (invoiceError) throw invoiceError;

    // Fetch the order related to the invoice
    const { data: order, error: orderError } = await supabase
      .from('orders_pos')
      .select('*')
      .eq('id', invoice.order_id)
      .single();

    if (orderError) throw orderError;

    // Fetch transactions related to the order
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions_pos')
      .select('*')
      .eq('order_id', order.id);

    if (transactionsError) throw transactionsError;

    // Fetch transactions related to the order
    const { data: customer, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .eq('order_id', order.id);

    if (customersError) throw customersError;

    // Return the combined result
    return { invoice, order, transactions, customer };
  } catch (error) {
    console.error('Error fetching details by invoice number:', error.message);
    throw error;
  }
}