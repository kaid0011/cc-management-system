// File path: supabase/api/invoices.js

import { supabase } from '../config.js';

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
