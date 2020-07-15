// Below the search options, have 3 buttons that are used to filter the jobs by. Those filters are:

// - full time
// - part time
// - remote

// - Job description (at most 100 characters)
// - How to apply information
// - A button to view job in details

// For example, when searching for Python jobs near New York on the site I am taken to this url:

// https://jobs.github.com/positions?description=python&location=new+york

// To get the JSON representation of those jobs I just use positions.json:

// https://jobs.github.com/positions.json?description=python&location=new+york

function buildUrl() {
  let mainUrl = "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json";
  let description = "?description=";
  let location = "&location=";
  let searchedLocation = document.getElementById("location-text").value
  let searchedDescription = document.getElementById("description-text").value;
  searchedLocation = searchedLocation.replace(/\s/g, "+");
  searchedDescription.replace(" ", "+");

  // for loop going thru radio button
  let jobType = "";
  let radioButtons = document.getElementsByName("jobs-radio");
  for (let i = 0; i < radioButtons.length; i++) {
    // if clicked, search by those terms
    if (radioButtons[i].checked) {
      jobType += "&" + radioButtons[i].value + "=true";
    }
  }

  // https://jobs.github.com/positions.json?description=python&full_time=true&location=sf

  description += searchedDescription;
  location += searchedLocation;

  // two words need a "+" in between "new+york"

  let fullUrl = mainUrl + description + jobType + location
  console.log(fullUrl)
  return fullUrl;
}

function fetchData() {
  let url = buildUrl();
  fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => createCards(data))
}

function createCards(jsonObj) {
  // create card
  document.getElementById("card-container").innerHTML = "";

  for (let i = 0; i < jsonObj.length; i++) {
    let newCard = document.createElement("div");
    newCard.setAttribute("class", "card")
    newCard.setAttribute("style", "margin: 15px")

    let imageUrl = jsonObj[i].company_logo;
    let jobTitle = jsonObj[i].title;
    let jobDescription = jsonObj[i].description;

    if (jobDescription.length > 100) {
      jobDescription = jobDescription.substring(0, 100) + "...";
    }

    let howToApplyUrl = jsonObj[i].how_to_apply;
    let descriptionUrl = jsonObj[i].url;

    let cardImage = document.createElement("img");
    cardImage.setAttribute("class", "card-img-top");
    cardImage.setAttribute("src", imageUrl);

    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    let cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerHTML = jobTitle;

    let cardDescription = document.createElement("p");
    cardDescription.setAttribute("class", "card-text");
    cardDescription.innerHTML = jobDescription;

    let applyButton = document.createElement("p");
    // applyButton.setAttribute("class", "btn btn-primary");
    // applyButton.setAttribute("onclick", "window.location.href=\'" + howToApplyUrl + "\'");
    applyButton.innerHTML = howToApplyUrl;

    let viewJobButton = document.createElement("button");
    viewJobButton.setAttribute("class", "btn btn-primary");
    viewJobButton.setAttribute("onclick", "window.location.href=\'" + descriptionUrl + "\'");
    viewJobButton.innerHTML = "See full description"
    cardBody.append(cardTitle, cardDescription, applyButton, viewJobButton);
    newCard.append(cardImage, cardBody)
    document.getElementById("card-container").append(newCard)
  }
}