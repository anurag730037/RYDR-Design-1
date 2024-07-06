document.addEventListener("DOMContentLoaded", function () {
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
            case "Profile":
              updateStatus("headingOne", mainData[i].status);
              continue;
            case "DL":
              updateStatus(
                "headingTwo",
                mainData[i].status,
                mainData[i].remark
              );
              continue;
            case "RC":
              updateStatus(
                "headingThree",
                mainData[i].status,
                mainData[i].remark
              );
              continue;
            case "PAN":
              updateStatus(
                "headingFour",
                mainData[i].status,
                mainData[i].remark
              );
              continue;
            case "AADHAR":
              updateStatus(
                "headingFive",
                mainData[i].status,
                mainData[i].remark
              );
              continue;
            // case "Payment":
            // updateStatus('headingSix', mainData[i].status)
            // continue;
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const completeProfile = () => {
    fetch("http://34.93.164.215:9000/rydr/v1/driver/details", {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
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

  CheckingRegistration();

  // --- Accordion Icon Update Function ---
  function updateAccordionIcon(accordionId, isValid) {
    const accordionButton = document.querySelector(
      `#${accordionId} .accordion-button`
    );
    const iconContainer = document.querySelector(
      `#${accordionId} .icon-container`
    );
    if (isValid) {
      accordionButton.classList.remove("error");
      accordionButton.classList.add("success");
      iconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else {
      accordionButton.classList.remove("success");
      accordionButton.classList.add("error");
      iconContainer.innerHTML = '<i class="fas fa-times-circle"></i>';
    }
  }

  // --- Profile Section Validation ---
  const profileNextButton = document.getElementById("profile-next");
  const profileForm = document.getElementById("profile-form");
  const profileFields = profileForm.querySelectorAll("input, textarea, select");

  // Calculate the maximum allowed date (18 years ago from today)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  document
    .getElementById("dob")
    .setAttribute("max", maxDate.toISOString().split("T")[0]);

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

  // --- Profile Next Button Click Event ---
  profileNextButton.addEventListener("click", function () {
    if (validateFields(profileFields, profileForm)) {
      const profileData = {
        FirstName: document.getElementById("username").value,
        address: document.getElementById("address").value,
        bloodGroup: document.getElementById("blood_group").value,
        city: document.getElementById("city").value,
        dateOfBirth: document.getElementById("dob").value,
        email: document.getElementById("email").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        pincode: document.getElementById("pincode").value,
        state: document.getElementById("state").value,
      };

      fetch("http://34.93.164.215:9000/rydr/v1/driver/update-profile", {
        method: "POST",
        headers,
        body: JSON.stringify(profileData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Profile updated successfully:", data);
            window.location.reload();
          } else {
            console.error("Error updating profile:", data);
          }
        })
        .catch((error) => {
          console.error("Network error:", error);
          // Handle network error
        });
    } else {
      console.log("Nothing");
    }
  });

  // --- Driving License Section ---
  document
    .getElementById("driving-license-next")
    .addEventListener("click", function () {
      const dlNumberField = document.getElementById("dl_number");
      const dlNumber = dlNumberField.value.trim();

      if (dlNumber === "") {
        dlNumberField.classList.add("empty_error");
        dlNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
        updateAccordionIcon("headingTwo", false); // Error icon
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
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "VALID") {
              // console.log('DL Sent successfully:', data);
              console.log("data", data);
              document.getElementById("driving-license-next").innerText =
                "Verify";
              //photo logic

              document.getElementById(
                "DL_photos"
              ).innerHTML = `<div class='photo-input'>
              <div class="mb-3 front-choose">
              <label for="dl_front_photo" class="col-form-label">Front DL:</label>
              <input type="file" class="square-input" id="dl_front_photo" name="dl_front_photo" required placeholder='front' >
              <img id="front_photo_preview" style="display: none; width: 100px; height: 100px; object-fit: cover;" /> </input>
.              
            </div>
            <div class="mb-3 back-choose">
              <label for="dl_back_photo" class="col-form-label">Back DL:</label>
              <input type="file" class="square-input" id="dl_back_photo" name="dl_back_photo" required placeholder='back'>
              <img id="back_photo_preview" style="display: none; width: 100px; height: 100px; object-fit: cover;" />  </input>
            </div></div>
            <div class="text-center gap-2">
              <button type="button" class="next-btn" id="submit-dl-photo">Submit Photo</button>
            </div>`;

              document.getElementById("driving-license-next").style.display =
                "none";

              /* --------DL Photo Auto Loaded----------- */

              //   fetch(
              //     "http://34.93.164.215:9000/rydr/v1/driver/get-document/DL",
              //     {
              //       method: "GET",
              //       headers,
              //     }
              //   )
              //     .then((response) => response.json())
              //     .then((data) => {
              //       if (data.success) {
              //         document.getElementById("");
              //       } else {
              //         console.error("Error photo load:", data);
              //       }
              //     })
              //     .catch((error) => {
              //       console.error("Network error:", error);
              //       // Handle network error
              //     });

              /*---------------DL Auto load End */

              //   document
              //     .getElementById("dl_front_photo")
              //     .addEventListener("change", (event) => {
              //       console.log("event> ", event);
              //     });

              // Event listeners to show image preview
              document
                .getElementById("dl_front_photo")
                .addEventListener("change", function (e) {
                  const frontPhoto =
                    document.getElementById("dl_front_photo").files[
                      e.currentTarget.files.length - 1
                    ];

                  console.log("Front 1st", frontPhoto);
                  if (frontPhoto) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                      document.getElementById("front_photo_preview").src =
                        e.target.result;
                      document.getElementById(
                        "front_photo_preview"
                      ).style.display = "block";
                      document.getElementById(
                        "front_photo_preview"
                      ).style.cursor = "pointer";
                    };
                    document.getElementById("dl_front_photo").style.display =
                      "none";
                    reader.readAsDataURL(
                      e.currentTarget.files[e.currentTarget.files.length - 1]
                    );
                  }
                });

              document
                .getElementById("dl_back_photo")
                .addEventListener("change", function (e) {
                  const backPhoto =
                    document.getElementById("dl_back_photo").files[0];

                  console.log("back 1st", backPhoto);
                  if (backPhoto) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                      document.getElementById("back_photo_preview").src =
                        e.target.result;
                      document.getElementById(
                        "back_photo_preview"
                      ).style.display = "block";
                      document.getElementById(
                        "back_photo_preview"
                      ).style.cursor = "pointer";
                    };
                    document.getElementById("dl_back_photo").style.display =
                      "none";
                    // reader.readAsDataURL(backPhoto);
                    reader.readAsDataURL(
                      e.currentTarget.files[e.currentTarget.files.length - 1]
                    );
                  }
                });

              // agian Changing Photo

              document
                .getElementById("front_photo_preview")
                .addEventListener("click", function () {
                  const newElement = document.createElement("input");
                  newElement.id = "dl_front_photo";
                  newElement.type = "file";

                  newElement.style.display = "none"; // Hide the new input element
                  document.body.appendChild(newElement);

                  //   newElement.click();
                  newElement.addEventListener("change", function (e) {
                    console.log("hii front");
                    const frontPhoto = e.target.files[0];

                    console.log("frontPhoto", frontPhoto);

                    if (frontPhoto) {
                      console.log("1");
                      const reader = new FileReader();
                      reader.onload = function (e) {
                        document.getElementById("front_photo_preview").src =
                          e.target.result;
                        document.getElementById(
                          "front_photo_preview"
                        ).style.display = "block";
                      };
                      document.getElementById("dl_front_photo").style.display =
                        "none";
                      reader.readAsDataURL(frontPhoto);
                      document.getElementById("dl_front_photo").files =
                        newElement.files; // Update the original file input
                    }
                    document.body.removeChild(newElement); // Clean up the new input element
                  });
                  newElement.click();
                });

              document
                .getElementById("back_photo_preview")
                .addEventListener("click", function () {
                  const newElement = document.createElement("input");
                  newElement.id = "dl_back_photo";
                  newElement.type = "file";

                  newElement.style.display = "none"; // Hide the new input element
                  document.body.appendChild(newElement);

                  //   newElement.click();
                  newElement.addEventListener("change", function (e) {
                    console.log("hii back");
                    const backPhoto = e.target.files[0];

                    console.log("BackPhoto .", backPhoto);

                    if (backPhoto) {
                      console.log("2");
                      const reader = new FileReader();
                      reader.onload = function (e) {
                        document.getElementById("back_photo_preview").src =
                          e.target.result;
                        document.getElementById(
                          "back_photo_preview"
                        ).style.display = "block";
                      };
                      document.getElementById("dl_back_photo").style.display =
                        "none";
                      reader.readAsDataURL(backPhoto);
                      document.getElementById("dl_back_photo").files =
                        newElement.files; // Update the original file input
                    }
                    document.body.removeChild(newElement); // Clean up the new input element
                  });
                  newElement.click();
                });

              // Submit Photo Logic

              document
                .getElementById("submit-dl-photo")
                .addEventListener("click", () => {
                  const front_DL =
                    document.getElementById("dl_front_photo").files[0];
                  const back_DL =
                    document.getElementById("dl_back_photo").files[0];

                  //   const currentTarget = event.currentTarget;
                  //   console.log("event> ", currentTarget); // Outputs the button element

                  if (!front_DL || !back_DL) {
                    alert(
                      "Please upload both front and back photos of your driving license."
                    );
                    return;
                  }

                  const formData = new FormData();
                  formData.append("docType", "DL");
                  formData.append("docNumber", DLNumber);
                  formData.append("documentFront", front_DL);
                  formData.append("documentBack", back_DL);

                  fetch("http://34.93.164.215:9000/rydr/v1/driver/upload", {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                      )}`,
                    },
                    body: formData,
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.error(" DL Photo Upload Network error:", error);
                      // Handle network error
                    });
                });

              //   window.location.reload();
            } else {
              console.error("Error updating DL:", data);
            }
            // loading = false
            document.getElementById("driving-license-next").innerText =
              "Verify";
          })
          .catch((error) => {
            console.error("Network error:", error);
            // loading = false
            document.getElementById("driving-license-next").innerText =
              "Verify";
          });
      }
    });

  // --- Vehicle RC Section (Assuming no validation needed)---
  document
    .getElementById("vehicle-rc-next")
    .addEventListener("click", function () {
      updateAccordionIcon("headingThree", true); // Success icon
      document.getElementById("collapseThree").classList.remove("show");
      document.getElementById("collapseFour").classList.add("show");
    });

  // PAN card section
  document
    .getElementById("pan-card-next")
    .addEventListener("click", function () {
      var panNumberField = document.getElementById("pan_number");
      var panNumber = panNumberField.value.trim();

      if (panNumber === "") {
        panNumberField.classList.add("empty_error");
        panNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
        updateAccordionIcon("headingFour", false); // Error icon
      } else {
        panNumberField.classList.remove("empty_error");
        updateAccordionIcon("headingFour", true); // Success icon
        document.getElementById("collapseFour").classList.remove("show");
        document.getElementById("collapseFive").classList.add("show");
      }
    });

  // Aadhar card section
  document.getElementById("aadhar-next").addEventListener("click", function () {
    var aadharNumberField = document.getElementById("aadhaar_number");
    var aadharNumber = aadharNumberField.value.trim();

    if (aadharNumber === "" || aadharNumber.length !== 12) {
      aadharNumberField.classList.add("empty_error");
      aadharNumberField.scrollIntoView({ behavior: "smooth", block: "center" });
      updateAccordionIcon("headingFive", false); // Error icon
    } else {
      aadharNumberField.classList.remove("empty_error");
      updateAccordionIcon("headingFive", true); // Success icon
      document.getElementById("collapseFive").classList.remove("show");
    }
  });

  // Submit button click event
  document
    .getElementById("registration-submit")
    .addEventListener("click", function (event) {
      event.preventDefault();
      var allFieldsFilled = true;
      var fieldsToCheck = document.querySelectorAll(
        "#profile-form input, #profile-form textarea, #profile-form select, #driving-license-form input, #pan-card-form input, #aadhaar-card-form input"
      );

      // Track validation status for each section
      var sectionsValid = {
        headingOne: true,
        headingTwo: true,
        headingThree: true,
        headingFour: true,
        headingFive: true,
      };

      fieldsToCheck.forEach(function (field) {
        if (
          (field.type !== "radio" && field.value.trim() === "") ||
          (field.type === "radio" &&
            !document.querySelector('input[name="gender"]:checked'))
        ) {
          allFieldsFilled = false;
          field.classList.add("empty_error");

          // Highlight the accordion with a red Color
          var accordion = field.closest(".accordion-item");
          if (accordion) {
            var accordionId = accordion.querySelector(".accordion-header").id;
            sectionsValid[accordionId] = false;

            var accordionButton = accordion.querySelector(".accordion-button");
            if (accordionButton) {
              accordionButton.classList.add("error");
            }
          }
        } else {
          field.classList.remove("empty_error");
          // Remove the red color from the accordion
          var accordion = field.closest(".accordion-item");
          if (accordion) {
            var accordionId = accordion.querySelector(".accordion-header").id;
            if (sectionsValid[accordionId] !== false) {
              sectionsValid[accordionId] = true;
            }

            var accordionButton = accordion.querySelector(".accordion-button");
            if (accordionButton) {
              accordionButton.classList.remove("error");
            }
          }
        }
      });

      // Update accordion icons based on section validation
      for (var section in sectionsValid) {
        updateAccordionIcon(section, sectionsValid[section]);
      }

      if (!allFieldsFilled) {
        var firstEmptyField = document.querySelector(".empty_error");
        if (firstEmptyField) {
          firstEmptyField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      } else {
        // Gathering Data From All Forms
        var profileForm = new FormData(document.getElementById("profile-form"));
        var drivingLicenseForm = new FormData(
          document.getElementById("driving-license-form")
        );
        var vehicleRcForm = new FormData(
          document.getElementById("vehicle-rc-form")
        );
        var panCardForm = new FormData(
          document.getElementById("pan-card-form")
        );
        var aadhaarCardForm = new FormData(
          document.getElementById("aadhaar-card-form")
        );

        // Combine all data into a single object
        var combinedData = {};

        profileForm.forEach((value, key) => {
          combinedData[key] = value;
        });
        drivingLicenseForm.forEach((value, key) => {
          combinedData[key] = value;
        });
        vehicleRcForm.forEach((value, key) => {
          combinedData[key] = value;
        });
        panCardForm.forEach((value, key) => {
          combinedData[key] = value;
        });
        aadhaarCardForm.forEach((value, key) => {
          combinedData[key] = value;
        });

        // FormData object for file uploads
        var formData = new FormData();
        formData.append(
          "profile_image",
          document.getElementById("profile_image").files[0]
        );
        formData.append("data", JSON.stringify(combinedData));

        fetch("https://httpbin.org/post", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            console.log(data.form.data);
            alert("Form submitted successfully!");

            // Reset all forms after successful submission
            document.getElementById("profile-form").reset();
            document.getElementById("driving-license-form").reset();
            document.getElementById("vehicle-rc-form").reset();
            document.getElementById("pan-card-form").reset();
            document.getElementById("aadhaar-card-form").reset();

            // Remove all error classes and icons
            document
              .querySelectorAll(".accordion-button")
              .forEach(function (button) {
                button.classList.remove("error", "success");
              });

            document
              .querySelectorAll(".icon-container")
              .forEach(function (iconContainer) {
                iconContainer.innerHTML = ""; // Clear the icon HTML
              });

            // Hide all accordions and show the first one
            document.getElementById("collapseOne").classList.remove("show");
            document.getElementById("collapseTwo").classList.remove("show");
            document.getElementById("collapseThree").classList.remove("show");
            document.getElementById("collapseFour").classList.remove("show");
            document.getElementById("collapseFive").classList.remove("show");

            // Reset accordion icons and heading colors
            // updateAccordionIcon('headingOne', false);
            // updateAccordionIcon('headingTwo', false);
            // updateAccordionIcon('headingThree', false);
            // updateAccordionIcon('headingFour', false);
            // updateAccordionIcon('headingFive', false);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
});
