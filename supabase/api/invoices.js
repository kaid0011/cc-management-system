import { supabase } from '../config.js';

export async function fetchAllInvoices() {
  try {
    const { data, error } = await supabase.from('invoices').select('*');
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching invoices:', error.message);
    throw error;
  }
}

export async function fetchInvoiceDetails(orderNo) {
  try {
    let { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('order_no', orderNo)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error(`No invoice found with order_no: ${orderNo}`);
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching invoice details:', error.message);
    throw error;
  }
}

export async function fetchInvoiceDetailsByInvoiceNo(invoiceNo) {
  try {
    let { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_no', invoiceNo)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error(`No invoice found with invoice_no: ${invoice_no}`);
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching invoice details:', error.message);
    throw error;
  }
}

export async function fetchTransactionsByInvoiceId(invoiceId) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('invoice_id', invoiceId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    throw error;
  }
}

export async function getNextInvoiceNo() {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_no')
      .order('invoice_no', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { 
      throw error;
    }

    let nextInvoiceNo = 1;
    if (data && data.invoice_no) {
      nextInvoiceNo = parseInt(data.invoice_no, 10) + 1;
    }

    return nextInvoiceNo.toString().padStart(8, '0');
  } catch (error) {
    console.error('Error getting next invoice number:', error.message);
    throw error;
  }
}

export async function updateInvoiceStatusAndDateById(invoiceId, status, invoiceDateTime, invoiceNo) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status, invoice_date_time: invoiceDateTime, invoice_no: invoiceNo })
      .eq('id', invoiceId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating invoice status and date:', error);
    throw error;
  }
}

export const updateInvoiceAndTransactionsInDatabase = async (invoice, transactions) => {
  const { id, invoice_no, invoice_date_time, ready_by, status } = invoice;

  const invoiceUpdate = {
    invoice_no,
    invoice_date_time,
    ready_by,
    status
  };

  try {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .update(invoiceUpdate)
      .eq('id', id);

    if (invoiceError) {
      console.error('Error updating invoice:', invoiceError);
      throw invoiceError;
    }

    if (transactions && transactions.length > 0) {
      for (const transaction of transactions) {
        const { id: transactionId, price } = transaction;

        const transactionUpdate = {
          price,
        };

        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .update(transactionUpdate)
          .eq('id', transactionId);

        if (transactionError) {
          console.error('Error updating transaction:', transactionError);
          throw transactionError;
        }
      }
    }

    return { invoiceData, transactions };

  } catch (error) {
    console.error('Error updating invoice and transactions:', error);
    throw error;
  }
};

export async function fetchTransactionsByInvoiceNo(invoiceNo) {
  try {
    // Fetch the invoice details first to get its id
    const { data: invoice } = await supabase
      .from('invoices')
      .select('id')
      .eq('invoice_no', invoiceNo)
      .single();

    if (!invoice) {
      throw new Error(`Invoice with invoice_no ${invoiceNo} not found`);
    }

    // Now fetch transactions using the invoice id
    return await fetchTransactionsByInvoiceId(invoice.id);
  } catch (error) {
    console.error('Error fetching transactions by invoice no:', error);
    throw error;
  }
}

export async function fetchCustomerDetailsByInvoiceId(invoiceId) {
  try {
    let { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("invoice_id", invoiceId)
      .single();

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw error;
  }
}