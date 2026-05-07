const apiKey = "3d4149fb1809c6a40853a0e379489f10";

document.getElementById("search-btn").addEventListener("click", async () => {
  const city = document.getElementById("city-input").value.trim();
  if (!city) return alert("Please enter a city name!");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();
    console.log(data);

    if (data.cod !== 200) {
      alert("City not found ❌");
      return;
    }

    // Display weather details
    document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("weather-desc").textContent = data.weather[0].description;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
    document.getElementById("sunrise").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    document.getElementById("sunset").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    // --- Fetch 5-day Forecast ---
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastResponse.json();

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    for (let i = 0; i < forecastData.list.length; i += 8) {
      const day = forecastData.list[i];
      const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
      const icon = day.weather[0].icon;
      const temp = Math.round(day.main.temp);
      const desc = day.weather[0].main;

      const card = document.createElement("div");
      card.classList.add("forecast-day");
      card.innerHTML = `
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
        <p>${temp}°C</p>
        <p>${desc}</p>
      `;
      forecastContainer.appendChild(card);
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong! Please try again later.");
  }
});
