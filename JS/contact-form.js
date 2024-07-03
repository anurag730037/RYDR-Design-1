document.addEventListener('DOMContentLoaded', () => {

var connectBtn = document.getElementById("contact-submit");
connectBtn.addEventListener('click', (event) => {
    event.preventDefault();

    var apiUrl = 'https://httpbin.org/post'

    var name = document.getElementById('connect-name').value;
    var phone_no = document.getElementById('connect-phone').value;
    var email = document.getElementById('connect-email').value;
    var message = document.getElementById('connect-message').value;

    // Validate form data
    if (!name || !phone_no || !email || !message) {
        alert('Please fill out all fields before submitting.');
        return;
    }


    var formData = {
        name: name,
        contactnumber: phone_no,
        email: email,
        message: message
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network Response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            alert('Your message has been sent successfully !');
            
            // Manually reset the fields
            document.getElementById('connect-name').value = '';
            document.getElementById('connect-phone').value = '';
            document.getElementById('connect-email').value = '';
            document.getElementById('connect-message').value = '';

        })

        .catch(error => {
            alert('There was a problem with your submission: ' + error.message);
        })

})
});


