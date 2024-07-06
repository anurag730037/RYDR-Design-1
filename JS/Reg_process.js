// const fetchCities = () => {
//     fetch('https://dmrcuat.autope.in:9000/rydr/v1/serviceableCities/city-list')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             const citySelect = document.getElementById('city');
//             citySelect.innerHTML = ''; // Clear existing options
//             data.data.forEach(city => {
//                 const option = document.createElement('option');
//                 option.value = city;
//                 option.textContent = city;
//                 citySelect.appendChild(option);
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching cities:', error);
//             alert('Error fetching cities. Please try again.');
//         });
// }

// fetchCities();



// const cityNext = () => {

//     var cityinput = document.getElementById('city');
//     var city = cityinput.value; // Get the OTP value and trim any extra spaces

//     // Construct the request body for OTP verification
//     var requestBody = {
//         CityName: city
//     };

//     // Fetch API call to verify OTP
//     fetch('https://dmrcuat.autope.in:9000/rydr/v1/driver/update-profile', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
//         },
//         body: JSON.stringify(requestBody)
//     })
//         .then(function (response) {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(function (data) {
//             console.log('City Sent successful:', data);

//         })
//         .catch(function (error) {
//             console.error('Error Sending City:', error);
//             // Handle error, e.g., display error message to the user
//             alert('Error Sending City. Please try again.');
//         });

//     document.getElementById('choose_city').style.display = 'none';
//     document.getElementById('choose_vehicle').style.display = 'block';
//     vehicleList();
// }

// vehicleList();

// var list = [];
// var headertext = '';
// var listitems = ''
// var selectedVehicle = ''

// const vehicleList = () => {
//     let listitem = `<li onclick="selectVehicle({index})" id="{ind}"
//                     class="d-flex justify-content-around align-items-center flex-row">
//                     <img class="vehicle_img" src="{imageUrl}" alt="">
//                         <span>
//                             <h4 class="vehicle_name">{vehicleName}</h4>
//                         </span>
//                     </li>`

//     let requestBody = {
//         module: "vehicle-type"
//     }

//     fetch('https://dmrcuat.autope.in:9000/rydr/v1/splash/splashScreen', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'app_token': "bKbumwUX1vs8FLr8",
//             "version": "v1"
//         },
//         body: JSON.stringify(requestBody)
//     })
//         .then(function (response) {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(function (data) {
//             console.log('Vehicle list Sent successful:', data);
//             list = data.images

//             headertext = data.data[0]?.description

//             for (let i = 0; i < list.length; i++) {
//                 listitems += listitem.replace('{imageUrl}', list[i].image).replace('{vehicleName}', list[i].name).replace('{index}', i).replace('{ind}', `name${i}`)
//             }
//             console.log('listitems> ', listitems)
//             document.getElementById('vList').innerHTML = listitems

//         })
//         .catch(function (error) {
//             console.error('Error Sending City:', error);
//             // Handle error, e.g., display error message to the user
//             alert('Error Sending City. Please try again.');
//         });
// }

// const selectVehicle = (index) => {
//     selectedVehicle = list[index].name;
//     for (let i = 0; i < list.length; i++) {
//         if (i === index) {
//             document.getElementById(`name${i}`).style.border = '2px solid #c30000'
//         } else {
//             document.getElementById(`name${i}`).style.border = '2px solid grey'
//         }
//     }
// }

// const selectVehicleNext = () => {

//     // Construct the request body for OTP verification
//     var requestBody = {
//         vehicleType: selectedVehicle
//     };

//     // Fetch API call to verify OTP
//     fetch('https://dmrcuat.autope.in:9000/rydr/v1/driver/update-profile', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
//         },
//         body: JSON.stringify(requestBody)
//     })
//         .then(function (response) {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(function (data) {
//             console.log('Vehicle Sent successful:', data);

//         })
//         .catch(function (error) {
//             console.error('Error Sending Vehicle:', error);
//             // Handle error, e.g., display error message to the user
//             alert('Error Sending Vehicle. Please try again.');
//         });
// }
