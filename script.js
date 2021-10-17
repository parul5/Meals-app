"use strict";

let favbtn = document.getElementById("favourites-btn");
let catbtn = document.getElementById("categories-btn");
let input = document.getElementById("search-input");

let catCard = `<div class="card m-2 " style="width: 18rem;">
      <img src="image" class="card-img-top" alt="name">
      <div class="card-body">
        <h5 class="card-title">name</h5>
        <p class="card-text">desc</p>
        <a href="#" class="btn btn-primary" onclick="getMealsInCategory('name')">Show meals</a>
      </div>
    </div>`;

let mealCard = `<div class="card m-2" style="width: 18rem;">
    <img src="image" class="card-img-top" alt="name">
    <div class="card-body">
      <h5 class="card-title">name</h5>
      <p class="card-text">desc</p>
      <a href="#" class="btn btn-primary" onclick="showDetails('idMeal')">Details</a>
      <a href="#" class="btn btn-danger" onclick="removeFromFavourites('idMeal')">Remove</a>
    </div>
  </div>`;

let favourites = JSON.parse(localStorage.getItem("favourites"));
if (favourites == null) favourites = [];

function fav() {
  favbtn.classList.add("active");
  catbtn.classList.remove("active");
  favourites = JSON.parse(localStorage.getItem("favourites"));
  if (favourites.length == 0) {
    document.getElementById("container").innerHTML = `<h1>No favourites</h1>`;
    return;
  }
  let html = "";
  for (let i = 0; i < favourites.length; i++) {
    let xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = function () {
      let res = JSON.parse(xhrRequest.response);
      html += mealCard
        .replace("image", res.meals[0].strMealThumb)
        .replace(/name/g, res.meals[0].strMeal)
        .replace("desc", res.meals[0].strInstructions.substring(0, 350))
        .replace(/idMeal/g, res.meals[0].idMeal);
      document.getElementById("container").innerHTML = html;
    };

    xhrRequest.open(
      "get",
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favourites[i]}`,
      true
    );

    xhrRequest.send();
  }
}

function categories() {
  favbtn.classList.remove("active");
  catbtn.classList.add("active");
  let xhrRequest = new XMLHttpRequest();
  xhrRequest.onload = function () {
    let res = JSON.parse(xhrRequest.response);
    let html = "";

    for (let i = 0; i < res.categories.length; i++) {
      let desc = res.categories[i].strCategoryDescription;
      if (desc.length > 350) {
        desc = desc.substring(0, 350) + "...";
      }

      let current = catCard
        .replace("image", res.categories[i].strCategoryThumb)
        .replace(/name/g, res.categories[i].strCategory)
        .replace("desc", desc);
      html += current;
    }

    document.getElementById("container").innerHTML = html;
  };

  xhrRequest.open(
    "get",
    "https://www.themealdb.com/api/json/v1/1/categories.php",
    true
  );

  xhrRequest.send();
}

categories();

favbtn.addEventListener("click", fav);
catbtn.addEventListener("click", categories);
input.addEventListener("input", (e) => {
  document.getElementById("search-suggestions").innerHTML = "";
  if (e.target.value == "") return;

  let str = e.target.value;
  let xhrRequest = new XMLHttpRequest();
  xhrRequest.onload = function () {
    let res = JSON.parse(xhrRequest.response);
    for (let i = 0; i < res.meals.length; i++) {
      let html = `<div class="suggestion d-flex justify-content-between align-items-center" onclick="showDetails('${res.meals[i].idMeal}')"> <p class="mx-2"> ${res.meals[i].strMeal}</p><div id = "add-fav-suggestion-btn-${i}" data-id = '${res.meals[i].idMeal}' class="m-2"><i class="far fa-star"></i></div>`;
      document.getElementById("search-suggestions").innerHTML += html;
    }

    for (let i = 0; i < res.meals.length; i++) {
      document
        .getElementById(`add-fav-suggestion-btn-${i}`)
        .addEventListener("click", addToFavourites);
    }
  };

  xhrRequest.open(
    "GET",
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${str}`,
    true
  );
  xhrRequest.send();
});

function showDetails(id) {
  let xhrRequest = new XMLHttpRequest();
  xhrRequest.onload = function () {
    let res = JSON.parse(xhrRequest.response);
    let html = `<html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"/>
        <title>name</title>
        <style>
        body {
          font-size: clamp(1rem, 8vw, 2rem);
          background-color: #4158D0;
          background: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        td {
          font-size: clamp(1rem, 9vw, 2rem);
        }
        h1 {
          font-size: clamp(1.3rem, 15vw, 2.5rem);
        }
        .container {
          display: flex;
          justify-content: center;
          flex-direction: column;
          margin: 0px auto;
          padding: 20px;
          border-radius: 5px;
          max-width: 1100px;
          background: #fff;
        }
        </style>
      </head>
      <body>
      <div class="container">
        <h1>name</h1>
        <img src="image" alt="" width="50%"/><br>
        <h1>Ingredients</h1>
        <table>
          list
        </table>
        <br>
        <p>instruction</p>
        <p>Watch video - <a href="youtube" target="_blank">youtube</a></p>
      </div>
      </body>
    </html>`;

    let ingredientList = "";
    for (let i = 1; i <= 20; i++) {
      let c = "strIngredient" + i.toString();
      let m = "strMeasure" + i.toString();
      if (res.meals[0][c]) {
        ingredientList += `<tr><td>${res.meals[0][c]}</td><td>${res.meals[0][m]}</td></tr>`;
      }
    }

    html = html
      .replace(/name/g, res.meals[0].strMeal)
      .replace("image", res.meals[0].strMealThumb)
      .replace("list", ingredientList)
      .replace("instruction", res.meals[0].strInstructions)
      .replace(/youtube/g, res.meals[0].strYoutube)
      .replace(/\r\n/g, "<br>");

    let win = window.open();
    win.document.write(html);
  };

  xhrRequest.open(
    "GET",
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    true
  );
  xhrRequest.send();
}

function getMealsInCategory(category) {
  let xhrRequest = new XMLHttpRequest();
  xhrRequest.onload = function () {
    let res = JSON.parse(xhrRequest.response);
    document.getElementById("container").innerHTML = "";
    let html = "";
    for (let i = 0; i < res.meals.length; i++) {
      let meal = `<div class="card m-2" style="width: 18rem; cursor: pointer;" onclick="showDetails('idMeal')">
    <img src="image" class="card-img-top" alt="name">
    <div class="card-body">
      <h5 class="card-title">name</h5>
      <a href="#" id="add-fav-${res.meals[i].idMeal}" data-id="${res.meals[i].idMeal}" class="btn btn-warning">Add to Favourites</a>
    </div>
  </div>`;
      html += meal
        .replace("image", res.meals[i].strMealThumb)
        .replace(/name/g, res.meals[i].strMeal)
        .replace("idMeal", res.meals[i].idMeal);
    }

    document.getElementById("container").innerHTML = html;

    for (let i = 0; i < res.meals.length; i++) {
      document
        .getElementById(`add-fav-${res.meals[i].idMeal}`)
        .addEventListener("click", addToFavourites);
    }
  };

  xhrRequest.open(
    "GET",
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
    true
  );
  xhrRequest.send();
}

function addToFavourites(e) {
  e.stopPropagation();
  if (favourites == null) favourites = [];
  favourites.push(this.dataset.id);
  localStorage.setItem("favourites", JSON.stringify(favourites));
}

function removeFromFavourites(id) {
  for (let i = 0; i < favourites.length; i++) {
    if (favourites[i] == id) {
      if (favourites.length == 1) {
        favourites = [];
        localStorage.removeItem("favourites");
      } else favourites.splice(i, 1);
    }
  }
  localStorage.setItem("favourites", JSON.stringify(favourites));
  fav();
}
