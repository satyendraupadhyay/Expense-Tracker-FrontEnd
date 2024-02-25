const signup = document.getElementById('user');
signup.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const obj = {
        name,
        email,
        password
    }

        axios.post("http://localhost:3000/user/signup", obj)
        .then((response) => {
            console.log(response);
            showUser(response.data.newSmDetail);
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>"
            console.log(err);
        })
})

function showUser(){
    
}