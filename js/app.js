let country_name_div = document.querySelector(".country .country-name");
let total_cases_div = document.querySelector(".total-cases .value");
let new_cases_div = document.querySelector(".total-cases .new-cases");
let recovered_div = document.querySelector(".recover .value");
let new_recovers_div = document.querySelector(".recover .new-recovers");
let dead_div = document.querySelector(".dead .value");
let new_deaths_div = document.querySelector(".dead .new-deaths");

const ctx = document.getElementById("pandemic-graph").getContext("2d");

let app_data =[], cases_list = [], recovered_list = [], deaths_list = [], format_dates=[];

//get user location
let country_code = geoplugin_countryCode();
let location_country; 

//choosing country name by iso code
countries.forEach(country => {
    if (country.code == country_code ){
        location_country = country.name;
    }
});

//fetching data from api
function fetchData(country) {
    user_country = country;
    country_name_div.innerHTML = "Loading...";
    (cases_list = []),
        (recovered_list = []),
        (deaths_list = []),
        (dates = []),
        (format_dates= []);
    let requestOptions = {
        method: "GET",
        redirect: "follow",
    };
    const api_fetch = async (country) => {
      await fetch(
        "https://api.covid19api.com/total/country/" +
          country +
          "/status/confirmed",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((entry) => {
            dates.push(entry.Date);
            cases_list.push(entry.Cases);
          });
        });
  
      await fetch(
        "https://api.covid19api.com/total/country/" +
          country +
          "/status/recovered",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((entry) => {
            recovered_list.push(entry.Cases);
          });
        });
  
      await fetch(
        "https://api.covid19api.com/total/country/" + country + "/status/deaths",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((entry) => {
            deaths_list.push(entry.Cases);
          });
        });
  
      updateUI();
    };
  
    api_fetch(country);
  }
  
fetchData(location_country);

//updates statistics for country
function updateUI() {
    updateStatistics();
    linearGraph();
}

function updateStatistics() {
    let total_cases = cases_list[cases_list.length - 1], new_confirmed_cases = total_cases - cases_list[cases_list.length - 2], 
      total_recovered = recovered_list[recovered_list.length - 1], new_recovered_cases = total_recovered - recovered_list[recovered_list.length - 2], 
      total_deaths = deaths_list[deaths_list.length - 1], new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];
    country_name_div.innerHTML = user_country;
    total_cases_div.innerHTML = total_cases.toLocaleString();
    new_cases_div.innerHTML =  "+" + new_confirmed_cases.toLocaleString();
    recovered_div.innerHTML = total_recovered.toLocaleString();;
    new_recovers_div.innerHTML = "+" + new_recovered_cases.toLocaleString();;
    dead_div.innerHTML = total_deaths.toLocaleString();;
    new_deaths_div.innerHTML = "+" + new_deaths_cases.toLocaleString();;
    dates.forEach((date) => {
      format_dates.push(toFormatDate(date));
    });
  }


//pandemy graph
  let graph;
  function linearGraph(){
    if (graph){
      graph.destroy();
    }
    graph = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Cases",
            data: cases_list,
            fill: false,
            borderColor: "#FFF",
            backgroundColor: "#FFF",
            borderWidth: 1,
          },
          {
            label: "Recovered",
            data: recovered_list,
            fill: false,
            borderColor: "#47df18",
            backgroundColor: "#47df18",
            borderWidth: 1,
          },
          {
            label: "Deaths",
            data: deaths_list,
            fill: false,
            borderColor: "#ff0000",
            backgroundColor: "#ff0000",
            borderWidth: 1,
          },
        ],
        labels: format_dates,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

let monthsNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


//format of date 
function toFormatDate(dateString) {
  let date = new Date(dateString);

  return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}