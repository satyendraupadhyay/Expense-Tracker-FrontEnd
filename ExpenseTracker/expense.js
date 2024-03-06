const expense = document.getElementById('expense');
expense.addEventListener('submit', (event) => {
    event.preventDefault();

    const expenseDetails = {
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value,
    }
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/expense/add-expense', expenseDetails, { headers: {"Authorization": token } })
    .then(res => {
        console.log(res);
        showUser(res.data.newExpenseDetail);
    })
    .catch((err) => {
        document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>";
        console.log(err);
    })

})

function showUser(productDetails) {
    let parent = document.getElementById('items');
    var itemID = productDetails.id;

        let child = document.createElement('li');
        let btn = document.createElement('button');
        btn.textContent = "Delete";
        
        btn.addEventListener('click', async function() {
            try {
                await axios.delete(`http://localhost:3000/expense/delete-expense/${itemID}`);
                parent.removeChild(child);
            } catch (err) {
                console.log(err);
            }
        });

        child.textContent = `Amount: ${productDetails.amount} - Description: ${productDetails.description} - Category: ${productDetails.category} `;
        child.appendChild(btn);
        parent.appendChild(child);
    
}

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.get("http://localhost:3000/expense/get-expense", { headers: {"Authorization": token } });
        res.data.forEach(user => showUser(user));
        console.log(res);
    } catch (err) {
        console.error(err);
    }
});