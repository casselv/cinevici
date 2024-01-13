function initMap() {
  const initialCoords = { lat: -38.409637, lng: 144.902651 };
  const map = new google.maps.Map(document.getElementById("map-container"), {
    center: initialCoords,
    zoom: 10,
    minZoom: 2,
    maxZoom: 20,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    styles: [
      {
        elementType: "geometry",
        stylers: [{ lightness: -50 }], // Adjust the lightness to make the map less bright
      },
    ],
  });

  const infoWindow = new google.maps.InfoWindow();
  let markers = [];

  const waveTypeSelect = document.getElementById("wave");
  const windDirectionSelect = document.getElementById("wind");
  const tideSelect = document.getElementById("tide");
  const swellDirectionSelect = document.getElementById("swell");
  const bottomSelect = document.getElementById("bottom");
  const waveDirectionSelect = document.getElementById("wavedirection");
  const swellExposureSelect = document.getElementById("swellexposure");

  waveTypeSelect.addEventListener("change", toggleMarkersVisibility);
  windDirectionSelect.addEventListener("change", toggleMarkersVisibility);
  tideSelect.addEventListener("change", toggleMarkersVisibility);
  swellDirectionSelect.addEventListener("change", toggleMarkersVisibility);
  bottomSelect.addEventListener("change", toggleMarkersVisibility);
  waveDirectionSelect.addEventListener("change", toggleMarkersVisibility);
  swellExposureSelect.addEventListener("change", toggleMarkersVisibility);

  fetch("/geodata")
    .then((response) => response.json())
    .then((data) => {
      markers = data.map((surfSpot) => {
        const [lat, lng] = surfSpot.coordinates.split(",");
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(lat.trim()),
            lng: parseFloat(lng.trim()),
          },
          map: map,
          title: surfSpot.spot,
          wave: surfSpot.wave,
          wind: surfSpot.wind,
          tide: surfSpot.tide,
          swell: surfSpot.swell,
          bottom: surfSpot.bottom,
          wavedirection: surfSpot.wavedirection,
          swellexposure: surfSpot.swellexposure,
          surfforecast: surfSpot.surfforecast,
          safety: surfSpot.safety,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "white",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 8,
          },
        });

        marker.addListener("mouseover", () => {
          const content = `<h3>${surfSpot.spot}</h3>`;

          infoWindow.setContent(content);
          infoWindow.setOptions({ disableAutoPan: true });
          infoWindow.open(map, marker);
        });

        marker.addListener("mouseout", () => {
          infoWindow.close(map, marker);
        });

        marker.addListener("click", () => {
          const content = `<h3>${surfSpot.spot}</h3>`;
          showDetailedPopup(surfSpot, marker);
          infoWindow.setContent(content);
          infoWindow.setOptions({ disableAutoPan: true });
          infoWindow.open(map, marker);
        });

        toggleMarkerVisibility(marker);
        return marker;
      });

      toggleMarkersVisibility();
    })
    .catch((error) => console.error("Error fetching surf spots", error));

  function showDetailedPopup(surfSpot, marker) {
    const mapContainer = document.getElementById("map-container");
    let tideDisplay = "";
    if (surfSpot.tide === "lmh") {
      tideDisplay = "All Tides";
    } else if (surfSpot.tide === "mh") {
      tideDisplay = "Mid - High";
    } else if (surfSpot.tide === "lm") {
      tideDisplay = "Low - Mid";
    }
    let wavedirection = "";
    if (surfSpot.wavedirection === "right") {
      wavedirection = "Right";
    } else if (surfSpot.wavedirection === "left") {
      wavedirection = "Left";
    } else if (surfSpot.wavedirection === "rightandleft") {
      wavedirection = "Right and Left";
    }

    let seafloor = "";
    if (surfSpot.bottom === "sandandrock") {
      seafloor = "Sand and Rock";
    } else {
      seafloor =
        surfSpot.bottom.charAt(0).toUpperCase() + surfSpot.bottom.slice(1);
    }

    const exposureValue = surfSpot.swellexposure;
    const capitalizedExposure =
      exposureValue.charAt(0).toUpperCase() + exposureValue.slice(1);
    const windTranny = surfSpot.wind;
    const swellTranny = surfSpot.swell;
    const detail = document.createElement("div");
    const content = `
         <div id="closeButt">X</div>
         <div class="info-container">
         <div class="header-container">
         <h1>${surfSpot.spot}</h1>
         <button class="forecast"><a href="https://www.surf-forecast.com/breaks/${surfSpot.surfforecast}" target="_blank">Surf Forecast</a></button>
         <button class="safety"><a href="https://beachsafe.org.au/beach/${surfSpot.safety}" target="_blank">Safety Rating</a></button>
         </div>
         <div class="detail-container">
         <p><span class="ruff">Wind</span> ${windTranny}</p>
         <p><span class="ruff">Tide</span> ${tideDisplay}</p>
         <p><span class="ruff">Swell</span> ${swellTranny}</p>
         <p><span class="ruff">Bottom</span> ${seafloor}</p>
         <p><span class="ruff">Wave</span> ${surfSpot.wave}</p>
         <p><span class="ruff">Wave Direction</span> ${wavedirection}</p>
         <p><span class="ruff">Swell Exposure</span> ${capitalizedExposure}</p>
         </div>
         </div>
      `;

    const oldDetail = document.getElementById("detail");
    if (oldDetail) {
      oldDetail.remove();
    }

    detail.id = "detail";
    detail.innerHTML = content;

    const closeButton = detail.querySelector("#closeButt");
    closeButton.addEventListener("click", function () {
      detail.style.display = "none";
    });

    mapContainer.appendChild(detail);
  }

  // Function to handle window resize event
  /*function handleResize() {
    const mapWidth = mapContainer.offsetWidth;
    const popupWidth = mapWidth / 2;
    detail.style.width = `${popupWidth}px`;
  }

  // Add event listener for window resize
  window.addEventListener("resize", handleResize);

  // Set the initial size and position of the popup
  handleResize(); */

  const bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-90, -180),
    new google.maps.LatLng(90, 180)
  );
  map.setOptions({ restriction: { latLngBounds: bounds } });

  function toggleMarkersVisibility() {
    const selectedWaveType = waveTypeSelect.value.toLowerCase();
    const selectedWindDirection = windDirectionSelect.value;
    const selectedTide = tideSelect.value;
    const selectedSwell = swellDirectionSelect.value;
    const selectedBottom = bottomSelect.value.toLowerCase();
    const selectedWaveDirection = waveDirectionSelect.value.toLowerCase();
    const selectedExposure = swellExposureSelect.value.toLowerCase();

    markers.forEach((marker) => {
      toggleMarkerVisibility(
        marker,
        selectedWaveType,
        selectedWindDirection,
        selectedTide,
        selectedSwell,
        selectedBottom,
        selectedWaveDirection,
        selectedExposure
      );
    });
  }

  function toggleMarkerVisibility(marker) {
    const selectedWaveType = waveTypeSelect.value.toLowerCase();
    const selectedWindDirection = windDirectionSelect.value;
    const selectedTide = tideSelect.value;
    const selectedSwell = swellDirectionSelect.value;
    const selectedBottom = bottomSelect.value.toLowerCase();
    const selectedWaveDirection = waveDirectionSelect.value.toLowerCase();
    const selectedExposure = swellExposureSelect.value.toLowerCase();

    const waveMatch =
      selectedWaveType === "any" ||
      marker.wave.toLowerCase() === selectedWaveType;
    const windMatch =
      selectedWindDirection === "any" || marker.wind === selectedWindDirection;
    const tideMatch = selectedTide === "any" || marker.tide === selectedTide;
    const swellMatch =
      selectedSwell === "any" || marker.swell === selectedSwell;
    const bottomMatch =
      selectedBottom === "any" ||
      marker.bottom.toLowerCase() === selectedBottom;
    const waveDirectionMatch =
      selectedWaveDirection === "any" ||
      marker.wavedirection.toLowerCase() === selectedWaveDirection;
    const exposureMatch =
      selectedExposure === "any" ||
      marker.swellexposure.toLowerCase() === selectedExposure;

    if (
      waveMatch &&
      windMatch &&
      tideMatch &&
      swellMatch &&
      bottomMatch &&
      waveDirectionMatch &&
      exposureMatch
    ) {
      marker.setMap(map); // Show marker on the map
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "lime",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 8,
      });
    } else {
      marker.setMap(map); // Show marker on the map
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "white",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 8,
      });
    }
  }
}
