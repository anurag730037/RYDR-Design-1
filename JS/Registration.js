// import { apiClient } from "./apiClient";
// const { apiClient } = require('./apiClient')

// document.addEventListener("DOMContentLoaded", function () {

document.addEventListener('DOMContentLoaded', () => {
  // Prevent default form submission for all forms
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });

  })
})


// Inintalily Check All the Docs 

var headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
};

var loading = false;

const CheckingRegistration = () => {
  var dataBody = {
    docTypes: [
      "Profile",
      "DL",
      "RC",
      "PAN",
      "AADHAR",
      // "Training",
      "Payment",
    ],
  };

  fetch("http://34.93.164.215:9000/rydr/v1/driver/checkDocStatus", {
    method: "POST",
    headers,
    body: JSON.stringify(dataBody),
  })
    .then((response) => response.json())
    .then(async (data) => {
      console.log("Success:", data.data);
      var mainData = data.data;
      for (let i = 0; i < mainData.length; i++) {
        switch (mainData[i].docType) {
          case "AADHAR":
            updateStatus(
              "headingOne",
              mainData[i].status,
              mainData[i].otherRemark ? mainData[i].otherRemark : mainData[i].remark
            );
            continue;
          case "DL":
            updateStatus(
              "headingTwo",
              mainData[i].status,
              mainData[i].otherRemark ? mainData[i].otherRemark : mainData[i].remark
            );
            continue;
          case "RC":
            updateStatus(
              "headingThree",
              mainData[i].status,
              mainData[i].otherRemark ? mainData[i].otherRemark : mainData[i].remark
            );
            continue;
          case "PAN":
            updateStatus(
              "headingFour",
              mainData[i].status,
              mainData[i].otherRemark ? mainData[i].otherRemark : mainData[i].remark
            );
            continue;
          case "Payment":
            updateStatus('headingFive', mainData[i].status)
            continue;
        }
      }

      var allStatusVerified = true;
      var paymentStatus = false;

      for (let i = 0; i < mainData.length; i++) {
        if (mainData[i].docType !== "Payment" && mainData[i].status !== 'verified') {
          allStatusVerified = false;
          break;
        }
        if (mainData[i].docType === "Payment" && mainData[i].status === 'completed') {
          paymentStatus = true;
        }
      }

      if (allStatusVerified && paymentStatus) {
        alert('Your All Document Are Verified You Can Download Our app and Start Riding')
        // window.location.href = "nextPageUrl"; // Replace "nextPageUrl" with the URL of the next page
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};


// -----------------ICON AND REMARK UPDATE--------------------------- 

const updateStatus = async (accordionId, status, remark) => {
  const accordionButton = document.querySelector(
    `#${accordionId} .accordion-button`
  );
  const iconContainer = document.querySelector(
    `#${accordionId} .icon-container`
  );
  if (
    ["headingOne", "headingSix"].includes(accordionId) &&
    status === "complete"
  ) {
    accordionButton.classList.remove("error");
    accordionButton.classList.add("success");
    iconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';

    if (accordionId === "headingOne" && status === "complete") {
      completeProfile();
    }
  } else if (status === "verified") {
    accordionButton.classList.remove("error");
    accordionButton.classList.add("success");
    iconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
  } else if (status === "under verification") {
    accordionButton.classList.remove("success");
    accordionButton.classList.add("error");
    iconContainer.innerHTML =
      '<i class="fa-regular fa-hourglass-half" style="color: #f17609;"></i>';

    if (remark && remark.length > 0) {
      document.querySelector(`#${accordionId} .remark`).innerText =
        "*" + remark;
    }
  }
  // } else {
  //     accordionButton.classList.remove('success');
  //     accordionButton.classList.add('error');
  //     iconContainer.innerHTML = '<i class="fas fa-times-circle"></i>';
  // }
};

//-------------------------------------- ICON UPDATE ENDSSS 

// *******************Editing Fields***************


const enableEditing = (fieldId, nextButtonId, btnDivId, dlDetailsId, dlDetailsConfirmId, editButtonId) => {
  console.log('Edit Click');
  document.getElementById(fieldId).readOnly = false;
  document.getElementById(nextButtonId).innerHTML = `Verify`;
  document.getElementById(nextButtonId).style.display = 'block';

  document.getElementById(btnDivId).classList.add("button_centre");
  document.getElementById(dlDetailsId).style.display = 'none';
  document.getElementById(dlDetailsConfirmId).style.display = 'none';
  document.getElementById(editButtonId).style.display = 'none';

}

// *******************Editing Fields ENDssss***************

// -----------------------Profile Section Data Update Throw APIS 

const completeProfile = () => {
  fetch("http://34.93.164.215:9000/rydr/v1/driver/details", {
    method: "GET",
    headers,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data.data);
        document.getElementById("username").value = data.data.Name;
        document.getElementById("address").value = data.data.Address;
        document.getElementById("blood_group").value = data.data.BloodGroup;
        document.getElementById("city").value = data.data.City;
        document.getElementById("dob").value = data.data.DOB;
        document.getElementById("email").value = data.data.Email;

        const allGenders = document.querySelectorAll('input[name="gender"]');

        for (let i = 0; i < allGenders.length; i++) {
          if (allGenders[i].id === data.data.Gender)
            allGenders[i].checked = true;
        }

        document.getElementById("pincode").value = data.data.PinCode;
        document.getElementById("state").value = data.data.State;
      } else {
        console.error("Error updating profile:", data);
      }
    })
    .catch((error) => {
      console.error("Network error:", error);
      // Handle network error
    });
};

// -----------------------Profile Section Data Update Through APIS ENDSSSS

CheckingRegistration();

function validateFields(fields, form) {
  let allFieldsFilled = true;
  let firstEmptyField = null;

  fields.forEach(function (field) {
    if (
      (field.type !== "radio" && field.value.trim() === "") ||
      (field.type === "radio" &&
        !form.querySelector('input[name="gender"]:checked'))
    ) {
      allFieldsFilled = false;
      field.classList.add("empty_error");
      if (!firstEmptyField) {
        firstEmptyField = field;
      }
    } else {
      field.classList.remove("empty_error");
    }
  });

  if (!allFieldsFilled && firstEmptyField) {
    firstEmptyField.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return allFieldsFilled;
}

// **************Details Confirm Functionality***************

function ConfirmDocument(Type, docNum) {

  if (document.getElementById('currentAddressField')) {
    cur_add = document.getElementById('currentAddressField').value;
  }

  console.log("Confirm Button Clicked")
  console.log(Type + '-' + docNum)
  const url = "http://34.93.164.215:9000/rydr/v1/driver/upload";

  const body = JSON.stringify({
    verificationType: 'auto',
    docType: Type,
    docNumber: docNum,
    currentAddress: cur_add,
    response
  });

  fetch(url, {
    method: "POST",
    headers,
    body,
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error('Unauthorised');
      } else if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      window.location.reload();
    })
    .catch((error) => {
      if (error.message === 'Unauthorised') {
        console.log("Clearing local storage");
        alert('Session Expired');
        window.location.href = 'login.html';
        localStorage.clear();
      } else {
        console.error('Error uploading document:', error);
        // You can handle other errors here, such as displaying an error message to the user
      }
    });
}

// --- Driving License Section ---

// document
//   .getElementById("driving-license-next")
//   .addEventListener("click", function () {
//     const dlNumberField = document.getElementById("dl_number");
//     const dlNumber = dlNumberField.value.trim();

//     if (dlNumber === "") {
//       dlNumberField.classList.add("empty_error");
//       dlNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
//       // updateAccordionIcon("headingTwo", false); // Error icon
//     } else {
//       dlNumberField.classList.remove("empty_error");

//       const DLNumber = dlNumber;
//       // loading = true
//       document.getElementById(
//         "driving-license-next"
//       ).innerHTML = `<span class="spinner-border text-danger" role="status" />`;
//       fetch("http://34.93.164.215:9000/rydr/v1/payout/verifyDL", {
//         method: "POST",
//         headers,
//         body: JSON.stringify({
//           licenseNumber: DLNumber,
//         }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.status === "VALID") {
//             // console.log('DL Sent successfully:', data);
//             console.log("data", data);
//             document.getElementById("driving-license-next").innerText =
//               "Verify";
//             //photo logic

//             document.getElementById(
//               "DL_photos"
//             ).innerHTML = `<div class='photo-input'>
//             <div class="mb-3 front-choose">
//             <label for="dl_front_photo" class="col-form-label">Front DL:</label>
//             <input type="file" class="square-input" id="dl_front_photo" name="dl_front_photo" required placeholder='front' >
//             <img id="front_photo_preview" style="display: none; width: 100px; height: 100px; object-fit: cover;" /> </input>
// .              
//           </div>
//           <div class="mb-3 back-choose">
//             <label for="dl_back_photo" class="col-form-label">Back DL:</label>
//             <input type="file" class="square-input" id="dl_back_photo" name="dl_back_photo" required placeholder='back'>
//             <img id="back_photo_preview" style="display: none; width: 100px; height: 100px; object-fit: cover;" />  </input>
//           </div></div>
//           <div class="text-center gap-2">
//             <button type="button" class="next-btn" id="submit-dl-photo">Submit Photo</button>
//           </div>`;

//             document.getElementById("driving-license-next").style.display =
//               "none";

//             /* --------DL Photo Auto Loaded----------- */

//             //   fetch(
//             //     "http://34.93.164.215:9000/rydr/v1/driver/get-document/DL",
//             //     {
//             //       method: "GET",
//             //       headers,
//             //     }
//             //   )
//             //     .then((response) => response.json())
//             //     .then((data) => {
//             //       if (data.success) {
//             //         document.getElementById("");
//             //       } else {
//             //         console.error("Error photo load:", data);
//             //       }
//             //     })
//             //     .catch((error) => {
//             //       console.error("Network error:", error);
//             //       // Handle network error
//             //     });

//             /*---------------DL Auto load End */

//             //   document
//             //     .getElementById("dl_front_photo")
//             //     .addEventListener("change", (event) => {
//             //       console.log("event> ", event);
//             //     });

//             // Event listeners to show image preview
//             document
//               .getElementById("dl_front_photo")
//               .addEventListener("change", function (e) {
//                 const frontPhoto =
//                   document.getElementById("dl_front_photo").files[
//                   e.currentTarget.files.length - 1
//                   ];

//                 console.log("Front 1st", frontPhoto);
//                 if (frontPhoto) {
//                   const reader = new FileReader();
//                   reader.onload = function (e) {
//                     document.getElementById("front_photo_preview").src =
//                       e.target.result;
//                     document.getElementById(
//                       "front_photo_preview"
//                     ).style.display = "block";
//                     document.getElementById(
//                       "front_photo_preview"
//                     ).style.cursor = "pointer";
//                   };
//                   document.getElementById("dl_front_photo").style.display =
//                     "none";
//                   reader.readAsDataURL(
//                     e.currentTarget.files[e.currentTarget.files.length - 1]
//                   );
//                 }
//               });

//             document
//               .getElementById("dl_back_photo")
//               .addEventListener("change", function (e) {
//                 const backPhoto =
//                   document.getElementById("dl_back_photo").files[0];

//                 console.log("back 1st", backPhoto);
//                 if (backPhoto) {
//                   const reader = new FileReader();
//                   reader.onload = function (e) {
//                     document.getElementById("back_photo_preview").src =
//                       e.target.result;
//                     document.getElementById(
//                       "back_photo_preview"
//                     ).style.display = "block";
//                     document.getElementById(
//                       "back_photo_preview"
//                     ).style.cursor = "pointer";
//                   };
//                   document.getElementById("dl_back_photo").style.display =
//                     "none";
//                   // reader.readAsDataURL(backPhoto);
//                   reader.readAsDataURL(
//                     e.currentTarget.files[e.currentTarget.files.length - 1]
//                   );
//                 }
//               });

//             // agian Changing Photo

//             document
//               .getElementById("front_photo_preview")
//               .addEventListener("click", function () {
//                 const newElement = document.createElement("input");
//                 newElement.id = "dl_front_photo";
//                 newElement.type = "file";

//                 newElement.style.display = "none"; // Hide the new input element
//                 document.body.appendChild(newElement);

//                 //   newElement.click();
//                 newElement.addEventListener("change", function (e) {
//                   console.log("hii front");
//                   const frontPhoto = e.target.files[0];

//                   console.log("frontPhoto", frontPhoto);

//                   if (frontPhoto) {
//                     console.log("1");
//                     const reader = new FileReader();
//                     reader.onload = function (e) {
//                       document.getElementById("front_photo_preview").src =
//                         e.target.result;
//                       document.getElementById(
//                         "front_photo_preview"
//                       ).style.display = "block";
//                     };
//                     document.getElementById("dl_front_photo").style.display =
//                       "none";
//                     reader.readAsDataURL(frontPhoto);
//                     document.getElementById("dl_front_photo").files =
//                       newElement.files; // Update the original file input
//                   }
//                   document.body.removeChild(newElement); // Clean up the new input element
//                 });
//                 newElement.click();
//               });

//             document
//               .getElementById("back_photo_preview")
//               .addEventListener("click", function () {
//                 const newElement = document.createElement("input");
//                 newElement.id = "dl_back_photo";
//                 newElement.type = "file";

//                 newElement.style.display = "none"; // Hide the new input element
//                 document.body.appendChild(newElement);

//                 //   newElement.click();
//                 newElement.addEventListener("change", function (e) {
//                   console.log("hii back");
//                   const backPhoto = e.target.files[0];

//                   console.log("BackPhoto .", backPhoto);

//                   if (backPhoto) {
//                     console.log("2");
//                     const reader = new FileReader();
//                     reader.onload = function (e) {
//                       document.getElementById("back_photo_preview").src =
//                         e.target.result;
//                       document.getElementById(
//                         "back_photo_preview"
//                       ).style.display = "block";
//                     };
//                     document.getElementById("dl_back_photo").style.display =
//                       "none";
//                     reader.readAsDataURL(backPhoto);
//                     document.getElementById("dl_back_photo").files =
//                       newElement.files; // Update the original file input
//                   }
//                   document.body.removeChild(newElement); // Clean up the new input element
//                 });
//                 newElement.click();
//               });

//             // Submit Photo Logic

//             document
//               .getElementById("submit-dl-photo")
//               .addEventListener("click", () => {
//                 const front_DL =
//                   document.getElementById("dl_front_photo").files[0];
//                 const back_DL =
//                   document.getElementById("dl_back_photo").files[0];

//                 //   const currentTarget = event.currentTarget;
//                 //   console.log("event> ", currentTarget); // Outputs the button element

//                 if (!front_DL || !back_DL) {
//                   alert(
//                     "Please upload both front and back photos of your driving license."
//                   );
//                   return;
//                 }

//                 const formData = new FormData();
//                 formData.append("docType", "DL");
//                 formData.append("docNumber", DLNumber);
//                 formData.append("documentFront", front_DL);
//                 formData.append("documentBack", back_DL);

//                 fetch("http://34.93.164.215:9000/rydr/v1/driver/upload", {
//                   method: "POST",
//                   headers: {
//                     Authorization: `Bearer ${localStorage.getItem(
//                       "accessToken"
//                     )}`,
//                   },
//                   body: formData,
//                 })
//                   .then((response) => response.json())
//                   .then((data) => {
//                     window.location.reload();
//                   })
//                   .catch((error) => {
//                     console.error(" DL Photo Upload Network error:", error);
//                     // Handle network error
//                   });
//               });

//             //   window.location.reload();
//           } else {
//             console.error("Error updating DL:", data);
//           }
//           // loading = false
//           document.getElementById("driving-license-next").innerText =
//             "Verify";
//         })
//         .catch((error) => {
//           console.error("Network error:", error);
//           // loading = false
//           document.getElementById("driving-license-next").innerText =
//             "Verify";
//         });
//     }
//   });

// ------------------Driving License Section Ends ===============================

// // --- Vehicle RC Section-------------
// document
//   .getElementById("vehicle-rc-next")
//   .addEventListener("click", function () {
//     // updateAccordionIcon("headingThree", true); // Success icon
//     document.getElementById("collapseThree").classList.remove("show");
//     document.getElementById("collapseFour").classList.add("show");
//   });

// // PAN card section
// document
//   .getElementById("pan-card-next")
//   .addEventListener("click", function () {
//     var panNumberField = document.getElementById("pan_number");
//     var panNumber = panNumberField.value.trim();

//     if (panNumber === "") {
//       panNumberField.classList.add("empty_error");
//       panNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
//       // updateAccordionIcon("headingFour", false); // Error icon
//     } else {
//       panNumberField.classList.remove("empty_error");
//       // updateAccordionIcon("headingFour", true); // Success icon
//       document.getElementById("collapseFour").classList.remove("show");
//       document.getElementById("collapseFive").classList.add("show");
//     }
//   });






// // Aadhar card section


// document.getElementById("aadhar-next").addEventListener("click", function () {
//   var aadharNumberField = document.getElementById("aadhaar_number");
//   // var aadharNumber = aadharNumberField.value.trim();

//   console.log('aadhar butto click')

//   if (aadharNumber === "" || aadharNumber.length !== 12) {
//     aadharNumberField.classList.add("empty_error");
//     aadharNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
//     // updateAccordionIcon("headingFive", false); // Error icon
//   } else {
//     aadharNumberField.classList.remove("empty_error");
//     // updateAccordionIcon("headingFive", true); // Success icon
//     document.getElementById("collapseFive").classList.remove("show");
//   }
// });



//********************** */ AAdhar Section 







var ref_id = '';
var aadhar = ''
var DL = '';
var RC = '';
var pan = '';

var cur_add = '';


function handleEnterKey(fieldId, buttonId) {
  const field = document.getElementById(fieldId);
  const button = document.getElementById(buttonId);
  field.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      button.click();
    }
  }
  );
}

function handleAccordionClick(fieldId, buttonId) {
  handleEnterKey(fieldId, buttonId);
}

document.getElementById('aadhar-next').addEventListener('click', () => {
  var aadharNumberField = document.getElementById("aadhaar_number");
  var aadharNumber = aadharNumberField.value.trim();
  aadhar = aadharNumber;
  console.log('aadhar')

  if (aadharNumber.length !== 12) {
    alert('Aadhaar Number Must Be 12 Digits');
    aadharNumberField.classList.add("empty_error");
    aadharNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    aadharNumberField.classList.remove("empty_error");
    document.getElementById("aadhar-next").innerHTML = `<span class="spinner-border text-danger" role="status" />`;

    var requestBody = {
      aadharNumber
    };

    // Get Aadhaar OTP section

    // const response = apiClient("http://34.93.164.215:9000/rydr/v1/payout/verifyAadhar", "POST", headers, requestBody)
    // console.log(response)


    fetch("http://34.93.164.215:9000/rydr/v1/payout/verifyAadhar", {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Unauthorised');
        }
        else if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.data.status === 'SUCCESS') {
          ref_id = data.data.ref_id;
          console.log(ref_id);
          document.getElementById('aadhar_number_section').style.display = 'none';
          document.getElementById('aadhar-next').style.display = 'none';

          document.getElementById('aadhaar_otp').value = ''; // Clear the OTP input field
          document.getElementById('aadhar_otp_section').style.display = 'block';
          document.getElementById("aadhar-otp-verify").innerHTML = `Verify OTP`;
          document.getElementById('aadhar-otp-verify').style.display = 'block';

        }

        else {
          alert('Error Sending OTP');

          console.error("Error sending Aadhaar OTP:", data);
          document.getElementById('aadhar_btn_div').classList.add("button_centre");
          document.getElementById("aadhar-next").innerHTML = `Next`;
        }
      })
      .catch((error) => {

        // console.log("Error in Aadhaar verification:", error);
        if (error.message === 'Unauthorised') {
          console.log("Clearing local storage");
          alert('Session Expired')
          window.location.href = 'login.html'
          localStorage.clear()
        }
        console.error("Error in Aadhaar verification:", error);
        alert('Error sending Aadhaar OTP. Please try again.');
        document.getElementById('aadhar_btn_div').classList.add("button_centre");
        document.getElementById("aadhar-next").innerHTML = `Next`;

      });
  }
});

document.getElementById('aadhar-otp-verify').addEventListener('click', () => {
  var aadharOtpInput = document.getElementById('aadhaar_otp');
  var otp = aadharOtpInput.value.trim(); // Get the OTP value and trim any extra spaces

  document.getElementById("aadhar-otp-verify").innerHTML = `<span class="spinner-border text-danger" role="status" />`;

  // Construct the request body for Aadhaar OTP verification
  var otpRequestBody = {
    ref_id,
    otp
  };

  // Fetch API call to verify Aadhaar OTP
  fetch('http://34.93.164.215:9000/rydr/v1/payout/verifyAadharOtp', {
    method: 'POST',
    headers,
    body: JSON.stringify(otpRequestBody)
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error('Unauthorised');
      }
      else if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function (otpData) {
      if (otpData.data) {
        console.log('OTP verification successful:', otpData);

        document.getElementById('aadhar_otp_section').style.display = 'none';
        document.getElementById('aadhar-otp-verify').style.display = 'none';
        document.getElementById('aadhar_details').style.display = 'block';

        document.getElementById('aadhar_name').innerHTML = `${otpData.data.name}`;
        document.getElementById('aadhar_permanent_address').innerHTML = `${otpData.data.address}`;
        document.getElementById('aadhar_gender').innerHTML = `${otpData.data.gender}`;
        document.getElementById('aadhar_dob').innerHTML = `${otpData.data.dob}`;

        // document.getElementById('aadhar-Submit-add').addEventListener('click', () => {
        //   console.log('New Add Submitted');
        // });

      }
      // else {
      //   console.error('Error verifying OTP:', otpData);
      //   alert('Incorrect OTP. Please try again.');
      //   // Hide OTP section and show Aadhaar number section
      //   document.getElementById('aadhar_otp_section').style.display = 'none';
      //   document.getElementById('aadhar-otp-verify').style.display = 'none';
      //   document.getElementById("aadhar-next").innerHTML = `Next`;
      //   document.getElementById('aadhar_number_section').style.display = 'block';
      //   document.getElementById('aadhar-next').style.display = 'block';
      // }
    })
    .catch(function (otpError) {

      if (error.message === 'Unauthorised') {
        console.log("Clearing local storage");
        alert('Session Expired')
        window.location.href = 'login.html'
        localStorage.clear()
      }

      console.error('OTP verification error:', otpError);
      alert('Error verifying OTP. Please try again.');
      // Hide OTP section and show Aadhaar number section
      document.getElementById('aadhar_otp_section').style.display = 'none';
      document.getElementById('aadhar-otp-verify').style.display = 'none';
      document.getElementById("aadhar-next").innerHTML = `Next`;

      document.getElementById('aadhar_btn_div').classList.add("button_centre");
      document.getElementById('addhar_feedback').style.display = 'block';
      document.getElementById('aadhar_number_section').style.display = 'block';
      document.getElementById('aadhar-next').style.display = 'block';

      if (error.message === 'Unauthorised') {
        console.log("Clearing local storage");
        alert('Session Expired')
        window.location.href = 'login.html'
        localStorage.clear()
      }
    });
});


// AAdhar Section Ends -------------------

// --- Driving License Section ---

document
  .getElementById("driving-license-next")
  .addEventListener("click", function () {
    const dlNumberField = document.getElementById("dl_number");
    const dlNumber = dlNumberField.value.trim();
    DL = dlNumber;

    if (dlNumber === "") {
      dlNumberField.classList.add("empty_error");
      dlNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
      // updateAccordionIcon("headingTwo", false); // Error icon
    } else {
      dlNumberField.classList.remove("empty_error");

      const DLNumber = dlNumber;
      // loading = true
      document.getElementById(
        "driving-license-next"
      ).innerHTML = `<span class="spinner-border text-danger" role="status" />`;

      fetch("http://34.93.164.215:9000/rydr/v1/payout/verifyDL", {
        method: "POST",
        headers,
        body: JSON.stringify({
          licenseNumber: DLNumber,
        }),
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error('Unauthorised');
          }
          else if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.data.status === "VALID") {
            // console.log('DL Sent successfully:', data);
            console.log("data", data.data);

            // Details Showing

            document.getElementById(
              "DL_details"
            ).innerHTML = `<div class=''>
              <span><strong>Name:</strong></span> <span id="dl_name"></span>
                                        <br>
               <span><strong>Father or Husband Name:</strong></span> <span id="dl_relation"></span>
                                        <br>
                            </div>`;

            document.getElementById("DL_details").style.display = 'block'
            document.getElementById("driving-license-next").style.display = 'none';
            document.getElementById("Dl_details_confirm").style.display = 'block';
            dlNumberField.readOnly = true;
            document.getElementById('Dl_edit').style.display = 'block'
            document.getElementById('Dl_edit').addEventListener('click', () => {

              enableEditing('dl_number', 'driving-license-next', 'btn-div', 'DL_details', 'Dl_details_confirm', 'Dl_edit')
            })
            document.getElementById("dl_div").classList.add("button_centre");
            document.getElementById('dl_name').innerHTML = `${data.data.name}`;
            document.getElementById('dl_relation').innerHTML = `${data.data.father_or_husband_name}`;
          }

          else {
            alert('Cant Verify DL');
            document.getElementById(
              "driving-license-next"
            ).innerHTML = `Verify`;
          }

        })
        .catch((error) => {
          if (error.message === 'Unauthorised') {
            console.log("Clearing local storage");
            alert('Session Expired')
            window.location.href = 'login.html'
            localStorage.clear()
          }
          console.error('Error:', error);
          alert('Error verifying DL');
          document.getElementById("driving-license-next").innerHTML = `Verify`;
        })
    }


  })

// DL-Conferm Event

// document.getElementById("Dl_details_confirm").addEventListener('click', () => {

//   fetch("http://34.93.164.215:9000/rydr/v1/driver/upload", {
//     method: "POST",
//     headers,
//     body: JSON.stringify({
//       verificationType: 'auto',
//       docType: 'DL',
//       docNumber: DL,
//     }),
//   })
//     .then((response) => {
//       if (response.status === 401) {
//         throw new Error('Unauthorised');
//       }
//       else if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     }).then(function (data) {
//       console.log(data)
//     })
//     .catch(function (error) {

//       if (error.message === 'Unauthorised') {
//         console.log("Clearing local storage");
//         alert('Session Expired')
//         window.location.href = 'login.html'
//         localStorage.clear()
//       }
//     });

// })





// --- Vehicle RC Section-------------
document
  .getElementById("vehicle-rc-next")
  .addEventListener("click", function () {
    // updateAccordionIcon("headingThree", true); // Success icon
    // document.getElementById("collapseThree").classList.remove("show");
    // document.getElementById("collapseFour").classList.add("show");

    var vehicleNumberField = document.getElementById("vehicle_number");
    var vehicleNumber = vehicleNumberField.value.trim();

    RC = vehicleNumber
    console.log('vehicleNumber', vehicleNumber);

    if (vehicleNumber === "") {
      vehicleNumberField.classList.add("empty_error");
      vehicleNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
      // updateAccordionIcon("headingTwo", false); // Error icon
    } else {
      vehicleNumberField.classList.remove("empty_error");

      const VehicleNumber = vehicleNumber;
      // loading = true
      document.getElementById(
        "vehicle-rc-next"
      ).innerHTML = `<span class="spinner-border text-danger" role="status" />`;

      fetch("http://34.93.164.215:9000/rydr/v1/payout/verifyRC", {
        method: "POST",
        headers,
        body: JSON.stringify({
          "vehicleNumber": VehicleNumber
        }),
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error('Unauthorised');
          }
          else if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.data.status === "VALID") {
            // console.log('DL Sent successfully:', data.data);
            console.log("data", data.data);

            // Details Showing

            document.getElementById("vehicle_details").innerHTML = `
              <div>
                <span><strong>Chassis Number :</strong></span> <span id="chassis_number"></span>
                <br>
                <span><strong>Engine Number:</strong></span> <span id="engine_number"></span>
                <br>
                <span><strong>Owner Name:</strong></span> <span id="owner_name"></span>
                <br>
                <span><strong>Modal:</strong></span> <span id="model"></span>
                <br>
                <span><strong>Color:</strong></span> <span id="color"></span>
                <br>
              </div>
            `;

            document.getElementById("vehicle_details").style.display = 'block'
            document.getElementById('vehicle_edit').style.display = 'block'
            document.getElementById('vehicle_edit').addEventListener('click', () => {

              enableEditing('vehicle_number', 'vehicle-rc-next', 'rc_btn_div', 'vehicle_details', 'rc_details_confirm', 'vehicle_edit')
            })
            vehicleNumberField.readOnly = true;
            document.getElementById("vehicle-rc-next").style.display = 'none';

            document.getElementById("rc_details_confirm").style.display = 'block';
            document.getElementById("rc_div").classList.add("button_centre");

            document.getElementById('chassis_number').innerHTML = `${data.data.chassis}`;
            document.getElementById('engine_number').innerHTML = `${data.data.engine}`;

            document.getElementById('owner_name').innerHTML = `${data.data.owner}`;
            document.getElementById('model').innerHTML = `${data.data.vehicleModel}`;

            document.getElementById('color').innerHTML = `${data.data.vehicleColor}`;

            // document.getElementById("rc_div").addEventListener('click', () => {
            //   // Add your desired functionality here
            //   window.location.reload();

            // })
          }
          else {
            alert('Cant Verify Vehicle Details');
            document.getElementById("vehicle-rc-next").innerHTML = `Next`;
          }

        })
        .catch((error) => {
          if (error.message === 'Unauthorised') {
            console.log("Clearing local storage");
            alert('Session Expired')
            window.location.href = 'login.html'
            localStorage.clear()
          }

          alert('Error verifying Vehicle');
          console.error('error aaya', error);

          document.getElementById("vehicle-rc-next").innerHTML = `Next`;
        })
    }
  });

// PAN card section
document
  .getElementById("pan-card-next")
  .addEventListener("click", function () {
    var panNumberField = document.getElementById("pan_number");
    var panNumber = panNumberField.value.trim();
    pan = panNumber;

    if (panNumber === "") {
      panNumberField.classList.add("empty_error");
      panNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
      // updateAccordionIcon("headingFour", false); // Error icon
    } else {
      panNumberField.classList.remove("empty_error");
      // // updateAccordionIcon("headingFour", true); // Success icon
      // document.getElementById("collapseFour").classList.remove("show");
      // document.getElementById("collapseFive").classList.add("show");


      panNumberField.classList.remove("empty_error");

      const PanNumber = panNumber;
      // loading = true
      document.getElementById(
        "pan-card-next"
      ).innerHTML = `<span class="spinner-border text-danger" role="status" />`;

      fetch("http://34.93.164.215:9000/rydr/v1/payout/verifyPan", {
        method: "POST",
        headers,
        body: JSON.stringify({
          "pan": PanNumber
        }),
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error('Unauthorised');
          }
          else if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log("data", data);
          if (data.success === true) {

            // Details Showing

            document.getElementById("pan_details").innerHTML = `
            <div class=''>
              <span><strong>Name:</strong></span> <span id="pan_name"></span>
              <br>
              
            </div>
          `;
            document.getElementById("pan_details").style.display = 'block'
            document.getElementById('pan_edit').style.display = 'block'
            document.getElementById('pan_edit').addEventListener('click', () => {

              enableEditing('pan_number', 'pan-card-next', 'pan_btn_div', 'pan_details', 'pan_details_confirm', 'pan_edit')
            })
            panNumberField.readOnly = true;

            document.getElementById("pan-card-next").style.display = 'none'

            document.getElementById("pan_details_confirm").style.display = 'block';
            document.getElementById("pan_div").classList.add("button_centre");

            document.getElementById('pan_name').innerHTML = `${data.data.name_pan_card}`;
            // document.getElementById("pan_details_confirm").addEventListener('click', () => {
            //   // Add your desired functionality here
            //   window.location.reload();

            // })
          } else {
            alert('Cannot Verify PAN');
            document.getElementById("pan-card-next").innerHTML = `Next`;
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          if (error.message === 'Unauthorised') {
            console.log("Clearing local storage");
            alert('Session Expired')
            window.location.href = 'login.html'
            localStorage.clear()
          }
          alert('Error verifying PAN');
          document.getElementById("pan-card-next").innerHTML = `Next`;
        });
    }
  });


//------------Bank Details Section------------

const ifscCodeInput = document.getElementById('ifsc-code');
const ifscCodeFeedback = document.getElementById('ifsc-code-feedback');

ifscCodeInput.addEventListener('input', async function () {
  const ifscCode = this.value.toUpperCase(); // Ensure uppercase for consistent validation

  const isValidFormat = /^[A-Z]{4}[0-9A-Z]{7}$/.test(ifscCode);

  if (isValidFormat) {
    ifscCodeInput.classList.remove('is-invalid'); // Remove invalid class

    try {
      const response = await fetch(`http://34.93.164.215:9000/rydr/v1/payout/${ifscCode}`);
      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const bankName = data.BANK; // Assuming the API response has a `bankName` property
      const branch = data.BRANCH

      ifscCodeFeedback.textContent = ''; // Clear any existing feedback message
      document.getElementById('bank_name').style.display = 'block'
      document.getElementById('bank-name').value = bankName || 'Bank not found'; // Autofill or show 'Bank not found'

      document.getElementById('branch_name').style.display = 'block'
      document.getElementById('branch-name').value = branch || 'Branch not found'; // Autofill or show 'Bank not found'

    } catch (error) {
      console.error('Error fetching bank details:', error);
      ifscCodeFeedback.textContent = 'Could not validate IFSC code.';
    }
  } else {
    ifscCodeInput.classList.add('is-invalid'); // Add invalid class for visual feedback
    ifscCodeFeedback.textContent = 'IFSC code should be 4 letters followed by 7 letters or digits.';
    document.getElementById('bank-name').value = ''; // Clear bank name on invalid format
  }
});






















// Submit button click event
// document
//   .getElementById("registration-submit")
//   .addEventListener("click", function (event) {
//     event.preventDefault();
//     var allFieldsFilled = true;
//     var fieldsToCheck = document.querySelectorAll(
//       "#profile-form input, #profile-form textarea, #profile-form select, #driving-license-form input, #pan-card-form input, #aadhaar-card-form input"
//     );

//     // Track validation status for each section
//     var sectionsValid = {
//       headingOne: true,
//       headingTwo: true,
//       headingThree: true,
//       headingFour: true,
//       headingFive: true,
//     };

//     fieldsToCheck.forEach(function (field) {
//       if (
//         (field.type !== "radio" && field.value.trim() === "") ||
//         (field.type === "radio" &&
//           !document.querySelector('input[name="gender"]:checked'))
//       ) {
//         allFieldsFilled = false;
//         field.classList.add("empty_error");

//         // Highlight the accordion with a red Color
//         var accordion = field.closest(".accordion-item");
//         if (accordion) {
//           var accordionId = accordion.querySelector(".accordion-header").id;
//           sectionsValid[accordionId] = false;

//           var accordionButton = accordion.querySelector(".accordion-button");
//           if (accordionButton) {
//             accordionButton.classList.add("error");
//           }
//         }
//       } else {
//         field.classList.remove("empty_error");
//         // Remove the red color from the accordion
//         var accordion = field.closest(".accordion-item");
//         if (accordion) {
//           var accordionId = accordion.querySelector(".accordion-header").id;
//           if (sectionsValid[accordionId] !== false) {
//             sectionsValid[accordionId] = true;
//           }

//           var accordionButton = accordion.querySelector(".accordion-button");
//           if (accordionButton) {
//             accordionButton.classList.remove("error");
//           }
//         }
//       }
//     });

//     // Update accordion icons based on section validation
//     for (var section in sectionsValid) {
//       // updateAccordionIcon(section, sectionsValid[section]);
//     }

//     if (!allFieldsFilled) {
//       var firstEmptyField = document.querySelector(".empty_error");
//       if (firstEmptyField) {
//         firstEmptyField.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//       }
//     } else {
//       // Gathering Data From All Forms
//       var profileForm = new FormData(document.getElementById("profile-form"));
//       var drivingLicenseForm = new FormData(
//         document.getElementById("driving-license-form")
//       );
//       var vehicleRcForm = new FormData(
//         document.getElementById("vehicle-rc-form")
//       );
//       var panCardForm = new FormData(
//         document.getElementById("pan-card-form")
//       );
//       var aadhaarCardForm = new FormData(
//         document.getElementById("aadhaar-card-form")
//       );

//       // Combine all data into a single object
//       var combinedData = {};

//       profileForm.forEach((value, key) => {
//         combinedData[key] = value;
//       });
//       drivingLicenseForm.forEach((value, key) => {
//         combinedData[key] = value;
//       });
//       vehicleRcForm.forEach((value, key) => {
//         combinedData[key] = value;
//       });
//       panCardForm.forEach((value, key) => {
//         combinedData[key] = value;
//       });
//       aadhaarCardForm.forEach((value, key) => {
//         combinedData[key] = value;
//       });

//       // FormData object for file uploads
//       var formData = new FormData();
//       formData.append(
//         "profile_image",
//         document.getElementById("profile_image").files[0]
//       );
//       formData.append("data", JSON.stringify(combinedData));

//       fetch("https://httpbin.org/post", {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           console.log("Success:", data);
//           console.log(data.form.data);
//           alert("Form submitted successfully!");

//           // Reset all forms after successful submission
//           document.getElementById("profile-form").reset();
//           document.getElementById("driving-license-form").reset();
//           document.getElementById("vehicle-rc-form").reset();
//           document.getElementById("pan-card-form").reset();
//           document.getElementById("aadhaar-card-form").reset();

//           // Remove all error classes and icons
//           document
//             .querySelectorAll(".accordion-button")
//             .forEach(function (button) {
//               button.classList.remove("error", "success");
//             });

//           document
//             .querySelectorAll(".icon-container")
//             .forEach(function (iconContainer) {
//               iconContainer.innerHTML = ""; // Clear the icon HTML
//             });

//           // Hide all accordions and show the first one
//           document.getElementById("collapseOne").classList.remove("show");
//           document.getElementById("collapseTwo").classList.remove("show");
//           document.getElementById("collapseThree").classList.remove("show");
//           document.getElementById("collapseFour").classList.remove("show");
//           document.getElementById("collapseFive").classList.remove("show");

//           // Reset accordion icons and heading colors
//           // updateAccordionIcon('headingOne', false);
//           // updateAccordionIcon('headingTwo', false);
//           // updateAccordionIcon('headingThree', false);
//           // updateAccordionIcon('headingFour', false);
//           // updateAccordionIcon('headingFive', false);
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//         });
//     }
//   });
// });
