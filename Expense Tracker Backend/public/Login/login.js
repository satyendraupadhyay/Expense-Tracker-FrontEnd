const login = document.getElementById('login');

login.addEventListener('submit', (event) => {
    event.preventDefault();

    const loginDetails = {
      email: event.target.email.value,
      password: event.target.password.value
    }
        axios.post('http://16.16.74.234:3000/user/login', loginDetails)
        .then(res => {
          alert(res.data.message);
          
          if (res.data.success) {
          localStorage.setItem('token', res.data.token);
          window.location.href = '../ExpenseTracker/index.html';
        }
          
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          const errorMessage = err.response ? err.response.data.message : 'Something went wrong';
          document.body.innerHTML += `<div style="color:red;">${errorMessage}</div>`;
        })
        
});

function forgotpassword() {
  window.location.href = "../ForgotPassword/index.html"
}