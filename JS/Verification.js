// JavaScript
var mobileNumber; // Define mobileNumber globally

const GETOTP = () => {
    var mobileNumberInput = document.getElementById('mobilenumber');
    mobileNumber = mobileNumberInput.value.trim(); // Update global mobileNumber

    if (mobileNumber.length !== 10) {
        mobileNumberInput.classList.add('error');
        return; // Exit function if mobile number is invalid
    }

    mobileNumberInput.classList.remove('error');

    // Construct the payload for the API request
    var requestBody = {
        mobileNumber: mobileNumber,
        memberType: 'rydr'
    };

    // API call to send OTP using Fetch
    fetch('https://dmrcuat.autope.in:9000/rydr/v1/driver/verify-mobile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('OTP sent successfully:', data);
            // Hide the getotp section and show the submitotp section
            document.getElementById('getotpSection').style.display = 'none';
            document.getElementById('heading').style.display = 'none';
            document.getElementById('submitotpSection').style.display = 'block';
        })
        .catch(error => {
            console.error('Error sending OTP:', error);
            // Handle error, e.g., display error message to the user
            alert('Error sending OTP. Please try again.');
        });
}


// Fetch Cities Was Here
const fetchCities = () => {
    fetch('https://dmrcuat.autope.in:9000/rydr/v1/serviceableCities/city-list')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const citySelect = document.getElementById('city');
            citySelect.innerHTML = ''; // Clear existing options
            data.data.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching cities:', error);
            alert('Error fetching cities. Please try again.');
        });
}

const SUBMITOTP = () => {
    var otpInput = document.getElementById('otp');
    var otp = otpInput.value.trim(); // Get the OTP value and trim any extra spaces

    // Construct the request body for OTP verification
    var requestBody = {
        mobileNumber: mobileNumber,
        otp: otp,
        deviceModel: "Redmi 6",
        lat: "77.1",
        long: "76.1",
        memberType: "rydr"
    };

    // Fetch API call to verify OTP
    fetch('https://dmrcuat.autope.in:9000/rydr/v1/otp/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            console.log('OTP verification successful:', data);
            // Store data in local storage
            localStorage.setItem('accessToken', data?.data?.accessToken);
            localStorage.setItem('memberId', data?.data?.user?.memberId);
            localStorage.setItem('memberType', data?.data?.user?.memberType);
            localStorage.setItem('mobileNumber', data?.data?.user?.mobileNumber);


            document.getElementById('submitotpSection').style.display = 'none';



            if (data?.data?.user?.cityName && data.data.user.cityName.length > 0 && data?.data?.user?.vehicleType && data.data.user.vehicleType.length > 0) {

                window.location.href = 'registration.html';
                // document.getElementById('choose_city').style.display = 'none';
                // document.getElementById('choose_vehicle').style.display = 'none';

                // document.getElementById('verifyDocument').style.display = 'block';

            } else if (!data.data.user.cityName) {
                // Fetch cities and show choose city section
                window.location.href = 'SelectCities.html';
                // fetchCities();
                // document.getElementById('choose_city').style.display = 'block';
                // document.getElementById('choose_vehicle').style.display = 'none';
            }
            else if (!data.data.user.vehicleType) {
                // Fetch cities and show choose city section
                window.location.href = 'SelectVehicle.html';

                // document.getElementById('choose_city').style.display = 'none';
                // document.getElementById('choose_vehicle').style.display = 'block';
            }


        })
        .catch(function (error) {
            console.error('Error verifying OTP:', error);
            // Handle error, e.g., display error message to the user
            alert('Error verifying OTP. Please try again.');
        });
}

