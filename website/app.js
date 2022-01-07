const generateBtn = document.getElementById("generate");
const zipCodeInput = document.getElementById("zip");
const feelingInput = document.getElementById("feeling");
const countrySpan = document.getElementById("country");
const citySpan = document.getElementById("city");
const tempSpan = document.getElementById("sp-temp");
const userContent = document.getElementById("sp-content");
const entryHolder = document.getElementById("entryHolder");
const dateSpan = document.getElementById("date");

const apiKey = "1792f492d7d7a79b500f3647d81e9e46&units=metric";
const baseWheatherUrl = "http://api.openweathermap.org/data/2.5/weather";
let isRealTimeValidating = false;

const postDataToApp = async (temp, userRes) => {
  const res = await fetch("http://localhost:8000/feeling/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      temprature: temp,
      date: getDate(),
      userResponse: userRes,
    }),
  });
  try {
    return await res.json();
  } catch (e) {
    return e;
  }
}

/**
 * @description gives information about the date
 * @returns the date in specific format
 */
const getDate = () => {
  const d = new Date();
  let newDate = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  return newDate;
}

/**
 * @description fetch the wheather data related to your city and return it
 * @param {(string | number)} zipCode - zipCode of your city
 * @returns promise carrying the wheather data related to your city
 */
const getWheatherData = async (zipCode) => {
  let url = baseWheatherUrl + `?zip=${zipCode}&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}


const validateZipCode = () => {
  let zipCode = zipCodeInput.value;
  removeError(zipCodeInput);
  if (zipCode.length !== 5) {
    renderError(
      `Please , Enter Valid Zip Code (${zipCode.length}/5 charachters)`,
      zipCodeInput
    );
  }
  return zipCode.length === 5;
}

const renderError = (errorMessage, element) => {
  element.classList.add("error");
  const errorLabel = document.createElement("label");
  errorLabel.id = "zipError";
  element.parentElement.appendChild(errorLabel);
  errorLabel.innerText = errorMessage;
}

const removeError = (element) => {
  element.classList.remove("error");
  const errorLabel = element.parentElement.querySelector("label#zipError");
  if (errorLabel) {
    errorLabel.parentElement.removeChild(errorLabel);
  }
}

const startRealTimeValidatingZipCode = () => {
  if (!isRealTimeValidating) {
    zipCodeInput.addEventListener("input", () => {
      validateZipCode();
      isRealTimeValidating = true;
    });
  }
}

const fetchAndUpdateUI = () => {
  const zipCode = zipCodeInput.value;
  startRealTimeValidatingZipCode();
  if (validateZipCode()) {
    getWheatherData(zipCode)
      // retrieving weather data
      .then((res) => {
        if (res.cod == 404) {
          renderError(res.message, zipCodeInput);
        } else if (res.cod == 200) {
          return res;
        } else {
          renderError(res.message, zipCodeInput);
        }
      })
      // sending data to the app 
      .then((res) => {
        const userRes = feelingInput.value;
        postDataToApp(res, userRes)
      })
      // updating User interface
      .then((_) => {
        UpdateUI();
      });
  }
}

const UpdateUI = async () => {
  entryHolder.style.display = "flex";
  entryHolder.style.opacity = "1";
  entryHolder.style.transform = "translateY(0px)";
  const response = await fetch("http://localhost:8000/all");
  try {
    const allData = await response.json();
    tempSpan.innerHTML = allData.temprature.main.temp;
    dateSpan.innerHTML = allData.date;
    citySpan.innerHTML = allData.temprature.name;
    userContent.innerHTML = allData.userResponse;
    countrySpan.innerHTML = allData.temprature.sys.country;
  } catch (error) {
    console.log(error);
  }
}

generateBtn.addEventListener("click", fetchAndUpdateUI);