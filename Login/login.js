const login = document.getElementById('login');

login.addEventListener('submit', (event) => {
    event.preventDefault();

    const loginDetails = {
      email: event.target.email.value,
      password: event.target.password.value
    }
        axios.post('http://localhost:3000/user/login', loginDetails)
        .then(res => alert(res.data.message))
        .catch(err => {
          console.log(JSON.stringify(err));
          document.body.innerHTML += `<div style="color:red;">${err.message}`
        })
        
});






// const login = document.getElementById('login');
// login.addEventListener('submit', (event) => {
//     event.preventDefault();

//     const email = event.target.email.value;
//     const password = event.target.password.value;

//     axios.get("http://localhost:3000/user/get-signup")
//       .then(res => {
//         const dataExists = res.data.some(item => item.email === email);
//         if (dataExists) {
//           if (res.data.some(item => item.password === password)){
//             alert("User Login successful");
//             console.log(res.data.password);
//           }
//           else {
//             alert("User not authorized");
//           }
//         } else {
//           alert("User not found");
//         }
//       })
//       .catch(error => {
//         console.error("Error:", error);
//       });
//   });