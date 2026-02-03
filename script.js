const API_KEY = "1f707380359e4d0ea8650134263001";
const BASE_URL = "https://api.weatherapi.com/v1";

const searchInput = document.querySelector(".searchbar input");
const searchButton = document.querySelector(".searchbar button");
const temp = document.querySelector(".temp");
const city = document.querySelector(".city");
const time = document.querySelector(".time");
const date = document.querySelector(".date");
const day = document.querySelector(".day");
const description = document.querySelector(".description");
const emoji = document.querySelector(".emoji");

// -------------------------------
// Initial weather via Geolocation
// -------------------------------
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`)
        .then((response) => response.json())
        .then((data) => {
          const epoch = data.location.localtime_epoch * 1000;
          const d = new Date(epoch);

          temp.textContent = data.current.temp_c + "°";
          city.textContent = data.location.name;

          time.textContent = d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          date.textContent = d.toLocaleDateString("en-GB");
          day.textContent = d.toLocaleDateString("en-US", {
            weekday: "short",
          });

          description.textContent = data.current.condition.text;
          emoji.src = "https:" + data.current.condition.icon;
        })
        .catch((error) => console.error("Error fetching weather:", error));
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
  );
}

// -------------------------------
// Search weather by city
// -------------------------------
searchButton.addEventListener("click", () => {
  const location = searchInput.value;

  fetch(
    `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(
      location,
    )}&aqi=no`,
  )
    .then((response) => response.json())
    .then((data) => {
      const epoch = data.location.localtime_epoch * 1000;
      const d = new Date(epoch);
      temp.textContent = data.current.temp_c + "°";
      city.textContent = data.location.name;
      time.textContent = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      date.textContent = d.toLocaleDateString("en-GB");
      day.textContent = d.toLocaleDateString("en-US", {
        weekday: "short",
      });

      description.textContent = data.current.condition.text;
      emoji.src = "https:" + data.current.condition.icon;
    })
    .catch((error) => console.error("Error fetching weather:", error));

  searchInput.value = "";
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});
