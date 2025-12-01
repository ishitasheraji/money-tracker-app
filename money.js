let expenses = []; // list of {id, category, amount, date, note}

const categorySelect = document.getElementById('category-select');
const customCategoryBtn = document.getElementById('custom-category-btn');
const customCategoryInput = document.getElementById('custom-category-input');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const noteInput = document.getElementById('note-input');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

// Load from localStorage if available
function loadExpenses() {
  const raw = localStorage.getItem('expenses');
  if (raw) {
    try {
      expenses = JSON.parse(raw);
    } catch {
      expenses = [];
    }
  }
}

// Save to localStorage
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Simple currency formatting
function formatCurrency(value) {
  return Number(value).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
}

// Add an expense
function addExpense(category, amount, date, note) {
  const id = Date.now();
  expenses.push({ id, category, amount: Number(amount), date, note });
  saveExpenses();
  renderExpenses();
}

// Delete an expense by id
function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  saveExpenses();
  renderExpenses();
}

// Render table and total
function renderExpenses() {
  expenseTableBody.innerHTML = '';
  let totalAmount = 0;

  for (const exp of expenses) {
    totalAmount += exp.amount;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exp.category}</td>
      <td>${formatCurrency(exp.amount)}</td>
      <td>${exp.date}</td>
      <td>${exp.note || ''}</td>
      <td><button class="delete-btn">Delete</button></td>
    `;

    row.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Delete this expense?')) {
        deleteExpense(exp.id);
      }
    });

    expenseTableBody.appendChild(row);
  }

  totalAmountCell.textContent = formatCurrency(totalAmount);
}

// Show custom category input when button clicked
customCategoryBtn.addEventListener('click', () => {
  customCategoryInput.style.display = 'inline-block';
  categorySelect.value = ''; // clear dropdown if using custom
});

// Add button handler
addBtn.addEventListener('click', () => {
  let category = categorySelect.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const note = noteInput.value;

  // If custom category input is visible and filled, use that
  if (customCategoryInput.style.display !== 'none' && customCategoryInput.value.trim()) {
    category = customCategoryInput.value.trim();
  }

  if (!category) {
    alert('Please select or write a category');
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  if (!date) {
    alert('Please choose a date');
    return;
  }

  addExpense(category, amount, date, note);

  // clear inputs
  categorySelect.value = '';
  amountInput.value = '';
  dateInput.value = '';
  noteInput.value = '';
  customCategoryInput.value = '';
  customCategoryInput.style.display = 'none';
});

// Initialize
loadExpenses();
renderExpenses();