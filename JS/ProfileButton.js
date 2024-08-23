window.addEventListener('DOMContentLoaded', function () {
    var token = localStorage.getItem('accessToken')
    var cityName = localStorage.getItem('cityName')
    var vehicle = localStorage.getItem('vehicleType')
    let htmlPage = ''
    var buttonName = ''

    console.log(typeof cityName)


    if (token && token.length > 0 && cityName && cityName.length > 0 && cityName !== 'undefined' && vehicle && vehicle.length > 0 && vehicle !== 'undefined') {
        // window.location.href = 'oldRegistration.html'
        htmlPage = 'oldRegistration.html'
    }
    else if (token && token.length > 0 && cityName === 'undefined') {
        // window.location.href = 'SelectCities.html'
        htmlPage = 'SelectCities.html'
    }
    else if (token && token.length > 0 && vehicle === 'undefined') {
        // window.location.href = 'SelectVehicle.html'
        htmlPage = 'SelectVehicle.html'
    }
    else if (!token) {
        // window.location.href = 'login.html'
        htmlPage = 'login.html'
    }

    if (token) {
        buttonName = `<a href="${htmlPage}">
                            <div class="log-in">Continue </div>
                        </a>`
    }
    else {
        buttonName = `<a href="login.html">
                            <div class="log-in">Log In</div>
                        </a>`
    }
    document.getElementById('loginButton').innerHTML = buttonName
})



