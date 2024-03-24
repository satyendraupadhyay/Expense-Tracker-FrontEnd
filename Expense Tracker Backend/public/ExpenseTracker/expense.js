const token = localStorage.getItem('token');

const pagination = document.getElementById('pagination');

const expense = document.getElementById('expense');
expense.addEventListener('submit', (event) => {
    event.preventDefault();

    const expenseDetails = {
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value,
    }
    const token = localStorage.getItem('token');
    axios.post('http://16.16.74.234:3000/expense/add-expense', expenseDetails, { headers: { "Authorization": token } })
        .then(res => {
            console.log(res);
            showUser(res.newExpenseDetail);
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>";
            console.log(err);
        })

})

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = 'hidden';
    document.getElementById('message').innerHTML = "You are a premium user";
}

document.getElementById('rzp-button1').onclick = async (e) => {
    const response = await axios.get("http://16.16.74.234:3000/purchase/premiummembership", { headers: { "Authorization": token } });
    console.log(response);
    var options = {
        "key": response.data.id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post('http://16.16.74.234:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { "Authorization": token } })

            alert('You are a premium user now');

            document.getElementById('rzp-button1').style.visibility = 'hidden';
            document.getElementById('message').innerHTML = "You are a premium user";
            localStorage.setItem('isadmin', res.data.token);



        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response);
        alert('Something went wrong');
    })
}

document.getElementById('leaderboard').onclick = async (e) => {
    const parentLB = document.getElementById('leaderboard-div');
    const childLB = document.createElement('h2');
    childLB.textContent = 'Leaderboard:';
    parentLB.appendChild(childLB);

    try {
        const res = await axios.get("http://16.16.74.234:3000/premium/showleaderboard");

        res.data.forEach(user => showPremium(user));
        console.log(res.data);
    } catch (err) {
        console.log(err);
    }
}

function showPremium(user) {
    const parent = document.getElementById('leaderboard-ul');
    const child = document.createElement('li');
    child.textContent = `Name - ${user.name} | Total Expense - ${user.totalExpenses}`;
    parent.appendChild(child);
}

function download() {
    axios.get('http://16.16.74.234:3000/user/download', { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response)
            if (response.status === 200) {
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = 'myexpense.csv';
                a.click();
                showFilesFront(response.data.showFiles)
            } else {
                throw new Error(response.data.message)

            }

        })
        .catch((err) => {
            // showError(err)
            console.log(err);
        });
}

function showFilesFront(data) {
    const parent = document.getElementById('files');
    const child = document.createElement('li');

    const sChild = document.createElement('a');
    sChild.href = data.fileURL;
    sChild.textContent = `File ${data.id}`

    child.appendChild(sChild);
    parent.appendChild(child);
}

const showFiles = async () => {
    try {
        const res = await axios.get("http://16.16.74.234:3000/expense/files", { headers: { "Authorization": token } });
        res.data.forEach(user => showFilesFront(user));
    } catch (err) {
        console.error(err);
    }
}
    

// Function to show pagination controls
function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, limit=5 }) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Create and append button for previous page if available
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.textContent = "Previous";
        btn2.addEventListener('click', () => getExpenses(previousPage, limit));
        pagination.appendChild(btn2);
    }

    // Create and append button for current page
    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener('click', () => getExpenses(currentPage, limit));
    pagination.appendChild(btn1);

    // Create and append button for next page if available
    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.textContent = "Next";
        btn3.addEventListener('click', () => getExpenses(nextPage, limit));
        pagination.appendChild(btn3);
    }
}

// Function to display user details
function showUser(productDetails) {
    const parent = document.getElementById('items');
    if (!parent) {
        console.error("Parent element 'items' not found.");
        return;
    }
    parent.innerHTML = ''; // Clear existing items before rendering new ones

    productDetails.forEach((product) => {
        const itemID = product.id;
        const amount = product.amount;
        const child = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = "Delete";

        // Event listener to delete item
        btn.addEventListener('click', async function () {
            try {
                await axios.delete(`http://16.16.74.234:3000/expense/delete-expense/${itemID}`, { headers: { "Authorization": token } });
                // Remove deleted item from UI
                parent.removeChild(child);
            } catch (err) {
                console.error("Error deleting expense:", err);
            }
        });

        // Display product details
        child.textContent = `Amount: ${amount} - Description: ${product.description} - Category: ${product.category} `;
        child.appendChild(btn);
        parent.appendChild(child);
    });
}


// Function to fetch expenses on page load
const getExpenses = async (page, limit=5) => {
    if(localStorage.getItem('limit')){
        limit = localStorage.getItem('limit');
    }
    try {
        const res = await axios.get(`http://16.16.74.234:3000/expense/get-expense?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        showUser(res.data.expenses);
        showPagination(res.data);
    } catch (err) {
        console.log(err);
    }
}

function setPaginationLimit(){
    const paginationLimit = document.getElementById('paginationLimit');
    paginationLimit.addEventListener('change', () => {
        localStorage.setItem('limit', paginationLimit.value);
        window.location.reload();
    });
}

window.addEventListener("DOMContentLoaded", () => {
    showFiles();
    getExpenses();
    setPaginationLimit();
})
