document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("sidebar-toggle");
    const body = document.body;

    toggleButton.addEventListener("click", function () {
      body.classList.toggle("sidebar-open");

      const sidebar = document.querySelector("app-sidebar");
      if (sidebar && typeof sidebar.toggle === "function") {
        sidebar.toggle();
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('transaction-form');
    const card = document.querySelector('transaction-card');
    const analytics = document.querySelector('expense-analytics');
    const categories = document.querySelector('main-categories');
    const balanceCard = document.querySelector('financial-summary-card[type="balance"]');
    const incomeCard = document.querySelector('financial-summary-card[type="income"]');
    const expensesCard = document.querySelector('financial-summary-card[type="expenses"]');
    const savingsCard = document.querySelector('financial-summary-card[type="savings"]');
    
    // Initialize with some transactions
    const transactions = [
      { id: "1", description: "Salário", amount: 3500, type: "income", category: "Salário", date: "2023-05-01" },
      { id: "2", description: "Freelance", amount: 1050, type: "income", category: "Freelance", date: "2023-05-10" },
      { id: "3", description: "Aluguel", amount: 1200, type: "expense", category: "Moradia", date: "2023-05-05" },
      { id: "4", description: "Supermercado", amount: 450, type: "expense", category: "Alimentação", date: "2023-05-08" },
      { id: "5", description: "Uber", amount: 120, type: "expense", category: "Transporte", date: "2023-05-12" },
      { id: "6", description: "Cinema", amount: 80, type: "expense", category: "Lazer", date: "2023-05-15" },
      { id: "7", description: "Farmácia", amount: 150, type: "expense", category: "Saúde", date: "2023-05-18" },
      { id: "8", description: "Material de escritório", amount: 70, type: "expense", category: "Outros", date: "2023-05-20" }
    ];
    
    card.transactions = transactions;
    
    // Update dashboard components based on transactions
    function updateDashboard() {
      // Calculate totals
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const balance = totalIncome - totalExpenses;
      const savings = balance * 0.2; // Example: 20% of balance goes to savings
      
      // Set custom values for cards
      balanceCard._value = balance;
      incomeCard._value = totalIncome;
      expensesCard._value = totalExpenses;
      savingsCard._value = savings;
      
      // Re-render cards
      balanceCard.render();
      incomeCard.render();
      expensesCard.render();
      savingsCard.render();
      
      // Group expenses by category
      const expenseCategories = {};
      
      transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          const category = t.category || 'Outros';
          if (!expenseCategories[category]) {
            expenseCategories[category] = 0;
          }
          expenseCategories[category] += t.amount;
        });
      
      // Convert to array format for the components
      const categoryColors = {
        'Moradia': '#a6ce39',
        'Alimentação': '#ff8c42',
        'Transporte': '#1e90ff',
        'Lazer': '#ffcc00',
        'Saúde': '#00b894',
        'Outros': '#ff7043'
      };
      
      const categoriesArray = Object.keys(expenseCategories).map(name => ({
        name,
        value: expenseCategories[name],
        color: categoryColors[name] || '#999999'
      }));
      
      // Update analytics and categories components
      analytics.categories = categoriesArray;
      categories.categories = categoriesArray;
    }
    
    // Initial update
    updateDashboard();
    
    // Listen for new transactions
    form.addEventListener('transaction-added', (event) => {
      const newTransaction = event.detail;
      
      // Add new transaction to the list
      transactions.unshift(newTransaction);
      
      // Update the card
      card.transactions = transactions;
      
      // Update dashboard
      updateDashboard();
    });
  });