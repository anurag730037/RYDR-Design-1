
document.addEventListener("DOMContentLoaded", function () {
    const customersButton = document.getElementById("customers-button");
    const driversButton = document.getElementById("drivers-button");
    const custPart = document.getElementById("cust-part");
    const driverPart = document.getElementById("driver-part");

    customersButton.addEventListener("click", function () {
        custPart.classList.add("active");
        driverPart.classList.remove("active");
        customersButton.classList.add("active");
        driversButton.classList.remove("active");
    });

    driversButton.addEventListener("click", function () {
        driverPart.classList.add("active");
        custPart.classList.remove("active");
        driversButton.classList.add("active");
        customersButton.classList.remove("active");
    });

    // Initialize the view to show customers part by default
    customersButton.click();
});

