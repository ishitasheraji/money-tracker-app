// Simple and easy-to-follow expense tracker JS

// ...existing code...
let expenses = []; // list of {id, category, amount, date}

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
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
    return Number(value).toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

// Add an expense
function addExpense(category, amount, date) {
    const id = Date.now();
    expenses.push({ id, category, amount: Number(amount), date });
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

        const catCell = document.createElement('td');
        catCell.textContent = exp.category;
        row.appendChild(catCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = formatCurrency(exp.amount);
        row.appendChild(amountCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = exp.date;
        row.appendChild(dateCell);

        const delCell = document.createElement('td');
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete-btn';
        delBtn.addEventListener('click', () => {
            if (confirm('Delete this expense?')) {
                deleteExpense(exp.id);
            }
        });
        delCell.appendChild(delBtn);
        row.appendChild(delCell);

        expenseTableBody.appendChild(row);
    }

    totalAmountCell.textContent = formatCurrency(totalAmount);
}

// Add button handler
addBtn.addEventListener('click', () => {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (!category) {
        alert('Please select a category');
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

    addExpense(category, amount, date);

    // clear inputs
    categorySelect.value = '';
    amountInput.value = '';
    dateInput.value = '';
});

// Initialize
loadExpenses();
renderExpenses();
// ...existing code...