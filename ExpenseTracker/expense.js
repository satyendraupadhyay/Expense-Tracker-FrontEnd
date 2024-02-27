const expense = document.getElementById('expense');
expense.addEventListener('submit', (event) => {
    event.preventDefault();

    const expenseDetails = {
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value
    }

    axios.post('http://localhost:3000/expense/add-expense', expenseDetails)
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

// GET the saved User Details from crudcrud.
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await axios.get("http://localhost:3000/expense/get-expense");
        for (var i = 0; i < res.data.length; i++) {
            showUser(res.data[i]);
        }
        console.log(res);
    } catch (err) {
        console.error(err);
    }
});