const cityInput = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");

const countryName = document.querySelector(".countryName");
const countryTemp = document.querySelector(".temp");
const countryCondition = document.querySelector(".condition");
const countryHumidityValue = document.querySelector(".humidity-value");
const countryWindValue = document.querySelector(".wind-value");
const weatherImg = document.querySelector(".weather-img");
const forecastImg = document.querySelector(".forecast-item-img");
const currentDate = document.querySelector(".current-date");

const forecastItemsContainer = document.querySelector(
	".forecast-items-container"
);

const apiKey = "9b89a3764bf7476ca0d162706250301";

function getWeatherIcon(code) {
	switch (code) {
		case 1087:
		case 1273:
		case 1276:
		case 1279:
		case 1282:
			return "thunderstorm.svg";
		case 1066:
		case 1069:
		case 1072:
		case 1114:
		case 1117:
		case 1210:
		case 1213:
		case 1216:
		case 1219:
		case 1222:
		case 1225:
		case 1237:
		case 1255:
		case 1258:
		case 1261:
		case 1264:
		case 1279:
		case 1282:
			return "snow.svg";
		case 1186:
		case 1189:
		case 1192:
		case 1243:
		case 1246:
		case 1273:
		case 1276:
			return "rain.svg";
		case 1063:
		case 1183:	
		case 1150:
		case 1153:
		case 1168:
		case 1171:
		case 1180:
		case 1198:
		case 1201:
		case 1240:
			return "drizzle.svg";
		case 1003:
		case 1006:
		case 1009:
			return "clouds.svg";
		case 1000:
			return "clear.svg";
		case 1030:
		case 1135:
		case 1147:
			return "atmosphere.svg";
		default:
			return "Unknown";
	}
}
searchButton.addEventListener("click", () => {
	if (cityInput.value.trim() != "") {
		updateWeatherInfo(cityInput.value);
		cityInput.value = "";
		cityInput.blur();
	}
});
cityInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter" && cityInput.value.trim() != "") {
		updateWeatherInfo(cityInput.value);
		cityInput.value = "";
		cityInput.blur();
	}
});

async function fetchData(endPoint, city) {
	const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=4`;

	const response = await fetch(apiUrl);
	return response.json();
}

function getCurrentDate() {
	const currentDate = new Date();
	const options = {
		weekday: "short",
		day: "2-digit",
		month: "short",
	};
	return currentDate.toLocaleDateString("en-US", options);
}
async function updateWeatherInfo(city) {
	let weatherData;
	try {
		weatherData = await fetchData("weather", city);
	} catch (error) {
		showDisplaySection(notFoundSection);
		return;
	}

	if (!weatherData || weatherData.error) {
		showDisplaySection(notFoundSection);
		return;
	}
	const forecastday = weatherData.forecast.forecastday;
	const today = forecastday[0];
	const nextDays = forecastday.slice(1);
	const {
		location: { name , country },
		current: {
			temp_c,
			humidity,
			wind_kph,
			condition: { code, text },
		},
	} = weatherData;

	countryName.textContent = name + ", " + country;
	countryTemp.textContent = Math.round(temp_c) + " °C";
	countryCondition.textContent = text;
	countryHumidityValue.textContent = humidity + " %";
	countryWindValue.textContent = wind_kph + " km/h";
	currentDate.textContent = getCurrentDate();
	weatherImg.src = `images/weather/${getWeatherIcon(code)}`;

	updateForecastItems(nextDays);
	showDisplaySection(weatherInfoSection);
}
function updateForecastItems(forecastday) {
	forecastItemsContainer.innerHTML = "";

	forecastday.forEach((day) => {
		const date = new Date(day.date).toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
		});
		const temp = `${Math.round(day.day.avgtemp_c)} °C`;
		const iconUrl = `images/weather/${getWeatherIcon(day.day.condition.code)}`;
		const forecastItem = document.createElement("div");
		forecastItem.classList.add("forecast-item");
		

		forecastItem.innerHTML = `
			<h5 class="forecast-item-date regular-font">${date}</h5>
			<img src="${iconUrl}" class="forecast-item-img">
			<h5 class="forecast-item-temp">${temp}</h5>
		`;

		forecastItemsContainer.appendChild(forecastItem);
	});
}
function showDisplaySection(section) {
	[weatherInfoSection, notFoundSection, searchCitySection].forEach(
		(section) => (section.style.display = "none")
	);

	section.style.display = "flex";
	section.style.flexDirection = "column";
}
