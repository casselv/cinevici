const form = document.querySelector(".masterform");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const location = document.getElementById("locationName").value;
  const spot = document.getElementById("spotName").value;
  const wave = document.getElementById("waveType").value;
  const coordinates = document.getElementById("coordinates").value;
  const tide = document.getElementById("tide").value;
  const wind = document.getElementById("wind").value;
  const swell = document.getElementById("swellDirections").value;
  const bottom = document.getElementById("bottom").value;
  const wavedirection = document.getElementById("waveDirection").value;
  const swellexposure = document.getElementById("swellExposure").value;
  const surfforecast = document.getElementById("forecastUrl").value;
  const safety = document.getElementById("safetyUrl").value;

  const formData = {
    location,
    spot,
    wave,
    coordinates,
    tide,
    wind,
    swell,
    bottom,
    wavedirection,
    swellexposure,
    surfforecast,
    safety,
  };

  fetch("/add_break", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the server
      console.log(data); // For example, you can log the response
    })
    .catch((error) => {
      console.error("Error:", error);
      return error.response.text();
    });

  form.reset();
});
