<template>
  <q-page class="q-pa-md">
    <q-btn class="bg-primary text-white q-mb-md" @click="printInvoice" label="Print Invoice" />
    <q-btn class="bg-secondary text-white q-mb-md q-ml-sm" @click="downloadInvoice" label="Download PDF" />
    <q-card v-if="isDataLoaded" class="invoice-container" ref="invoiceContainer">
      <q-card-section>
        <div class="banner bg-primary text-white q-pa-md">
          <div class="flex justify-between">
            <div class="text-left column justify-between">
              <div class="text-h6">COTTON CARE</div>
            </div>
            <div class="text-right">
              <div class="text-caption q-pa-none">
                <div class="text-h6 text-uppercase text-weight-bolder">
                  Invoice
                </div>
                53 Ubi Ave 1 #01-29 Paya Ubi Ind. Park Singapore 408934
              </div>
              <div class="text-caption">9029 6919 / 6747 7844</div>
              <div class="text-caption">enquire@cottoncare.com.sg</div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-between q-mb-lg">
          <div class="col-6 text-left q-gutter-y-md">
            <div>
              <div class="text-h6 text-weight-bolder">Juan Dela Cruz</div>
              <div class="text-p">
                123 Sample Ave Sample Address 2<br />
                Sample zip code
              </div>
            </div>
            <div>
              <div class="text-body1 text-weight-bold text-uppercase">
                Invoice Details
              </div>
              <div class="row">
                <div class="col-4">
                  <div class="text-p">Invoice No:</div>
                  <div class="text-p">Invoice Date:</div>
                  <div class="text-p">Order No:</div>
                  <div class="text-p">Order Date:</div>
                  <div class="text-p">Ready By:</div>
                </div>
                <div class="col">
                  <div class="text-p">{{ invoiceDetails.invoice_no }}</div>
                  <div class="text-p">{{ formattedInvoiceDate }}</div>
                  <div class="text-p">{{ invoiceDetails.order_no }}</div>
                  <div class="text-p">{{ formattedOrderDate }}</div>
                  <div class="text-p">{{ formattedReadyBy }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6 text-right q-gutter-y-md">
            <div>
              <q-card flat class="add bg-blue-grey-11 q-pa-sm">
                <div class="text-body1 text-weight-bold text-uppercase">
                  Collection Address
                </div>
                <div class="text-p">
                  123 Sample Ave Sample Address 2 Sample zip code
                </div>
                <div class="text-p">Collected By: Sample Collector</div>
                <div class="text-p">Collected By: 01/01/24, 10:00AM</div>
              </q-card>
            </div>

            <div>
              <q-card flat class="add bg-blue-grey-11 q-pa-sm">
                <div class="text-body1 text-weight-bold text-uppercase">
                  Delivery Address
                </div>
                <div class="text-p">
                  123 Sample Ave Sample Address 2 Sample zip code
                </div>
                <div class="text-p">Collected By: Sample Collector</div>
                <div class="text-p">Collected By: 01/01/24, 10:00AM</div>
              </q-card>
            </div>
          </div>
        </div>
        <q-table
          :rows="processedTransactions"
          :columns="columns"
          row-key="id"
          flat
          hide-bottom
          separator="cell"
        >
          <template v-slot:body-cell-price="props">
            <q-td :props="props"> ${{ props.row.price.toFixed(2) }} </q-td>
          </template>
          <template v-slot:body-cell-subtotal="props">
            <q-td :props="props">
              ${{ (props.row.price * props.row.quantity).toFixed(2) }}
            </q-td>
          </template>
        </q-table>

        <q-card-section class="text-right q-mt-md q-pa-none">
          <div class="row">
            <div class="col-7 text-left">
              <q-card flat class="bank-details bg-blue-grey-11 q-pa-sm">
                <div>
                  <div class="text-p text-weight-bold text-uppercase">
                    Bank Details
                  </div>
                  <div class="text-caption row">
                    <div class="col-4">
                      <div>Account Name:</div>
                      <div>Bank Name:</div>
                      <div>Account No:</div>
                      <div>Bank/Branch Code:</div>
                      <div>PayNow UEN No:</div>
                    </div>
                    <div class="col">
                      <div>COTTON CARE DRYCLEANERS PTE LTD</div>
                      <div>OCBC</div>
                      <div>5881-0542-9001</div>
                      <div>7339/588</div>
                      <div>201205607R</div>
                    </div>
                  </div>
                  <div class="text-caption q-mt-sm">
                    NOTE: For transaction reference, please indicate your
                    handphone no. +65 _____________
                  </div>
                </div>
              </q-card>
              <div class="q-mt-md">
                <div class="text-caption">
                  (Prepaid credits are available for purchase on our website)
                </div>
                <div class="text-caption">
                  ***For cheque payments, please make cheque payable to 'Cotton
                  Care Drycleaners Pte Ltd'***
                </div>
              </div>
            </div>
            <div class="col-5 q-gutter-y-md">
              <div>
                <div class="text-body1 text-weight-bold text-uppercase q-mb-sm">
                  Payment Summary
                </div>
                <div class="row justify-end">
                  <div class="text-left">
                    <div>Sub Total</div>
                    <div>Deposit</div>
                    <div>Remaining Credit</div>
                    <div>Total Due</div>
                  </div>
                  <div class="col-6 text-start">
                    <div>${{ subtotal.toFixed(2) }}</div>
                    <div>${{ deposit.toFixed(2) }}</div>
                    <div>${{ remainingCredits.toFixed(2) }}</div>
                    <div>${{ totalDue.toFixed(2) }}</div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  class="text-body1 text-weight-bold text-uppercase q-mb-sm"
                  style="line-height: 1rem"
                >
                  Subtotal after discounts, credits, and express
                </div>
                <div class="row justify-end">
                  <div class="text-left">
                    <div>Outstanding</div>
                    <div>Outstanding Paid</div>
                    <div>Balance</div>
                  </div>
                  <div class="col-6 text-start">
                    <div>${{ outstanding.toFixed(2) }}</div>
                    <div>${{ outstandingPaid.toFixed(2) }}</div>
                    <div>${{ balance.toFixed(2) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-mt-xl">
          <div>
            <div class="text-caption text-uppercase text-weight-bold q-mb-xs">
              Conditions of Services
            </div>
            <div class="text-tiny text-left">
              <ol class="q-pl-md q-my-none">
                <li>
                  All articles are accepted at owner’s risk. The company shall
                  not be responsible for shrinkage, fading, fastness of colour,
                  defect due to manufacture, buttons or ornaments that cannot
                  withstand cleaning or pressing or water & tear due to the
                  process of cleaning.
                </li>
                <li>
                  Stain removal is done at owner’s risk with additional charges
                  and is NOT guaranteed.
                </li>
                <li>
                  If any article is lost or damaged through our negligence or in
                  the event of fire, our liability shall be limited from 5 to 10
                  times the regular service charge for each article. The total
                  claim for all articles shall be deemed not to exceed $100.00
                  per order. In the event of a claim for any damaged item/s,
                  that item/s shall be retained by the company.
                </li>
                <li>
                  Customers are advised to check the articles at the time of
                  return. The company will not bear any responsibility once the
                  articles have been returned for more than 24 hours.
                </li>
                <li>
                  The company shall not be liable for any loss or damage due to
                  storage of any unclaimed article more than 14 days from Return
                  Date. Any unclaimed article shall be disposed after 3 months.
                </li>
                <li>
                  There is a minimum charge of $30 per laundry collection and a
                  minimum charge of $180 for curtains removal and installation.
                </li>
                <li>
                  The company reserves the right to impose a surcharge of S$10
                  for any extra trips made outside of normal collection &
                  delivery.
                </li>
                <li>
                  Customers are reminded that it is an offense under the law to
                  send bedding, clothing, or any articles which have been in
                  contact with infectious disease to a public house.
                </li>
              </ol>
            </div>
          </div>
          <div class="q-mt-lg text-p text-weight-bolder text-uppercase">
            ***This is computer generated invoice. No signatory is required.***
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-spinner v-else color="primary" size="40px" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import {
  fetchInvoiceDetailsByInvoiceNo,
  fetchTransactionsByInvoiceNo,
} from "@/../supabase/api/invoices.js";

const route = useRoute();
const router = useRouter();

const invoiceDetails = ref(null);
const transactions = ref([]);
const isDataLoaded = ref(false);

const formattedOrderDate = ref("");
const formattedInvoiceDate = ref("");
const formattedReadyBy = ref("");

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const fetchData = async () => {
  try {
    const invoiceNo = route.params.invoice_no;

    const [invoiceData, transactionsData] = await Promise.all([
      fetchInvoiceDetailsByInvoiceNo(invoiceNo),
      fetchTransactionsByInvoiceNo(invoiceNo),
    ]);

    invoiceDetails.value = invoiceData;
    transactions.value = transactionsData.map((transaction) => ({
      ...transaction,
      quantity: transaction.quantity || 1,
    }));

    formattedOrderDate.value = formatDate(invoiceDetails.value.order_date_time);
    formattedInvoiceDate.value = formatDate(
      invoiceDetails.value.invoice_date_time
    );
    formattedReadyBy.value = formatDate(invoiceDetails.value.ready_by);

    isDataLoaded.value = true;

    if (route.query.print) {
      await nextTick();
      printInvoice();
    }
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    router.push({ name: "Invoice Management" });
  }
};

onMounted(fetchData);

const combineTransactions = (transactions) => {
  const combined = {};

  transactions.forEach((transaction) => {
    const key = `${transaction.item_name}-${transaction.type}`;
    if (!combined[key]) {
      combined[key] = { ...transaction, quantity: 0, subtotal: 0 };
    }
    combined[key].quantity += transaction.quantity;
    combined[key].subtotal += transaction.price * transaction.quantity;
  });

  return Object.values(combined);
};

const processedTransactions = computed(() =>
  combineTransactions(transactions.value)
);

const columns = [
  {
    name: "tag_no",
    align: "left",
    label: "Tag No.",
    field: (row) => row.tag_no,
  },
  {
    name: "item_name",
    align: "left",
    label: "Item(s)",
    field: (row) => row.item_name,
  },
  {
    name: "type",
    align: "left",
    label: "Type",
    field: (row) => row.type,
  },
  {
    name: "price",
    align: "right",
    label: "Price",
    field: (row) => row.price,
  },
  {
    name: "quantity",
    align: "right",
    label: "Quantity",
    field: (row) => row.quantity,
  },
  {
    name: "subtotal",
    align: "right",
    label: "Subtotal",
    field: (row) => row.subtotal,
  },
];

const subtotal = computed(() =>
  processedTransactions.value.reduce(
    (acc, transaction) => acc + transaction.subtotal,
    0
  )
);
const totalDue = computed(() => subtotal.value);
const deposit = ref(0);
const remainingCredits = ref(0);
const outstanding = ref(0);
const outstandingPaid = ref(0);
const balance = ref(0);

const printInvoice = async () => {
  const invoiceElement = document.querySelector('.invoice-container');
  const canvas = await html2canvas(invoiceElement);
  const imgData = canvas.toDataURL('image/png');

  const imgWindow = window.open('', '_self');
  imgWindow.document.write('<img src="' + imgData + '" />');
  imgWindow.document.close();
  imgWindow.focus();
  imgWindow.print();
  imgWindow.close();
};

const downloadInvoice = async () => {
  const invoiceElement = document.querySelector('.invoice-container');
  const canvas = await html2canvas(invoiceElement);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const currentDateTime = new Date();
  const year = String(currentDateTime.getFullYear()).slice(-2);
  const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
  const day = String(currentDateTime.getDate()).padStart(2, '0');
  const hours = String(currentDateTime.getHours()).padStart(2, '0');
  const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
  const fileName = `invoice-${year}${month}${day}${hours}${minutes}.pdf`;

  pdf.save(fileName);
};
</script>

<style scoped>
.invoice-container {
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.banner {
  background-color: #027be3;
  color: white;
}
</style>
