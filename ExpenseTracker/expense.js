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

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = 'hidden';
    document.getElementById('message').innerHTML = "You are a premium user";
}

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    console.log(decodeToken);
    const isadmin = decodeToken.ispremiumuser;
    if (isadmin) {
        showPremiumuserMessage();
    }
    try {
        const res = await axios.get("http://localhost:3000/expense/get-expense", { headers: {"Authorization": token } });
        res.data.forEach(user => showUser(user));
        console.log(res);
    } catch (err) {
        console.error(err);
    }
});

document.getElementById('rzp-button1').onclick = async (e) => {
    const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:3000/purchase/premiummembership", { headers: {"Authorization": token } });
    console.log(response);
    var options = {
        "key": response.data.id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: {"Authorization": token } })

            alert('You are a premium user now');

            document.getElementById('rzp-button1').style.visibility = 'hidden';
            document.getElementById('message').innerHTML = "You are a premium user";
            localStorage.setItem('isadmin', res.data.token);

            
            
        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function(response) {
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
        const res = await axios.get("http://localhost:3000/premium/showleaderboard");

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

function download(){
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}

