const signup = document.getElementById('sign-up');
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

    axios.get("http://16.16.74.234:3000/user/get-signup")
    .then(res => {
      const dataExists = res.data.some(item => item.email === email);
      if (dataExists) {
        document.body.innerHTML = document.body.innerHTML + "<h4>Error: User already exists</h4>"
      } else {
        axios.post("http://16.16.74.234:3000/user/signup", obj)
        .then((response) => {
            console.log(response);
            showUser(response.data.newSmDetail);
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>"
            console.log(err);
        })

      }
    })
    .catch();

        
})
