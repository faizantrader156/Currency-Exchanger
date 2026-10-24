const API_KEY = "355d197eac28c7bea4c359bf";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

const currencyList = {
    USD: "US",
    PKR: "PK",
    EUR: "FR",
    GBP: "GB",
    INR: "IN",
    AED: "AE",
    SAR: "SA",
    CAD: "CA",
    AUD: "AU",
    CNY: "CN",
    JPY: "JP",
    TRY: "TR"
};

const fromCurrencySelect = document.getElementById("from-currency");
const toCurrencySelect = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const exchangeRateText = document.querySelector(".exchange-rate");
const swapBtn = document.getElementById("swap-btn");
const form = document.getElementById("converter-form");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const splashScreen = document.getElementById("splash-screen");

// Splash Screen Timer (Hide after 2.4 seconds)
window.addEventListener("load", () => {
    initializeDropdowns();
    getExchangeRate();

    setTimeout(() => {
        splashScreen.classList.add("hide-splash");
    }, 2400);
});

function initializeDropdowns() {
    for (let code in currencyList) {
        let option1 = document.createElement("option");
        option1.value = code;
        option1.textContent = code;
        if (code === "USD") option1.selected = true;
        fromCurrencySelect.appendChild(option1);

        let option2 = document.createElement("option");
        option2.value = code;
        option2.textContent = code;
        if (code === "PKR") option2.selected = true;
        toCurrencySelect.appendChild(option2);
    }
}

function updateFlag(element, currencyCode) {
    let countryCode = currencyList[currencyCode];
    element.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

async function getExchangeRate() {
    let amountVal = amountInput.value;
    if (amountVal === "" || amountVal < 1) {
        amountVal = 1;
        amountInput.value = "1";
    }

    exchangeRateText.textContent = "Getting rate...";

    try {
        let fromCurrency = fromCurrencySelect.value;
        let toCurrency = toCurrencySelect.value;
        
        let response = await fetch(`${BASE_URL}${fromCurrency}`);
        let data = await response.json();

        if (data.result === "success") {
            let rate = data.conversion_rates[toCurrency];
            let totalAmount = (amountVal * rate).toFixed(2);
            exchangeRateText.textContent = `${amountVal} ${fromCurrency} = ${totalAmount} ${toCurrency}`;
        } else {
            exchangeRateText.textContent = "Error fetching rate!";
        }
    } catch (error) {
        exchangeRateText.textContent = "Network Error! Try again.";
    }
}

fromCurrencySelect.addEventListener("change", (e) => {
    updateFlag(fromFlag, e.target.value);
    getExchangeRate();
});

toCurrencySelect.addEventListener("change", (e) => {
    updateFlag(toFlag, e.target.value);
    getExchangeRate();
});

swapBtn.addEventListener("click", () => {
    let temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    
    updateFlag(fromFlag, fromCurrencySelect.value);
    updateFlag(toFlag, toCurrencySelect.value);
    getExchangeRate();
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    getExchangeRate();
});

amountInput.addEventListener("input", () => {
    getExchangeRate();
});