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

    axios.get("http://localhost:3000/user/get-signup")
    .then(res => {
      const dataExists = res.data.some(item => item.email === email);
      if (dataExists) {
        document.body.innerHTML = document.body.innerHTML + "<h4>Error: User already exists</h4>"
      } else {
        axios.post("http://localhost:3000/user/signup", obj)
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

function showUser(){

}

const login = document.getElementById('lg-btn');
login.addEventListener('click', (event) => {
  event.preventDefault();
  container.style.display = 'none';
  const parent = document.getElementById('container2');
  const lgForm = document.createElement('form');

  const lgEmailLb = document.createElement('label');
  lgEmailLb.textContent = "Email:";
  lgForm.appendChild(lgEmailLb);

  const lgEmailIn = document.createElement('input');
  lgEmailIn.setAttribute('type', 'email');
  lgForm.appendChild(lgEmailIn);

  const lgPassLb = document.createElement('label');
  lgPassLb.textContent = "Password:";
  lgForm.appendChild(lgPassLb);

  const lgPassIn = document.createElement('input');
  lgPassIn.setAttribute('type', 'password');
  lgForm.appendChild(lgPassIn);

  const lgBtn = document.createElement('button');
  lgBtn.setAttribute('type', 'submit');
  lgBtn.textContent = "login";
  lgForm.appendChild(lgBtn);

  parent.appendChild(lgForm);

  lgForm.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();

    const email = lgEmailIn.value;
    const password = lgPassIn.value;

    axios.get("http://localhost:3000/user/get-signup")
      .then(res => {
        const dataExists = res.data.some(item => item.email === email && item.password === password);
        if (dataExists) {
          alert("Login successful");
        } else {
          alert("Invalid email or password");
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });
});
