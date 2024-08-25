const searchbox = document.querySelector(".searchbox");
const searchbtn = document.querySelector(".searchbtn");
const recipecontainer = document.querySelector(".recipe-container");
const recipecontent = document.querySelector(".recipe-content");
const recipecloseBtn = document.querySelector(".recipe-close-Btn");

const fetchRecipes = async (query) => {
  recipecontainer.innerHTML = "<h2>Fetching recipes...</h2>";

  // Fetch data from the API
  const data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const response = await data.json();

  // Clear the container before displaying results
  recipecontainer.innerHTML = "";

  // Exit early if no recipes are found
  const meals = response.meals || [];
  meals.forEach((meal) => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe");
    recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>${meal.strCategory}<span>Category</span></p>
        `;

    const button = document.createElement("button");
    button.textContent = "View Recipe";
    recipeDiv.appendChild(button);

    // Adding event listener to recipe button
    button.addEventListener("click", () => {
      openrecipePopup(meal);
    });

    recipecontainer.appendChild(recipeDiv); // Add the recipe to the container
  });

  // Display a message if no recipes were found after looping
  meals.length === 0 &&
    (recipecontainer.innerHTML =
      "<h2>No recipes found. Try a different search.</h2>");
};

// Function to fetch ingredients
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

const openrecipePopup = (meal) => {
  recipecontent.innerHTML = `
    <h2 class="recipename">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientslist">${fetchIngredients(meal)}</ul>
    <div class="recipeinstructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>
  `;

  recipecontent.parentElement.style.display = "block";
};

recipecloseBtn.addEventListener("click", () => {
  recipecontent.parentElement.style.display = "none";
});

searchbtn.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent the form from submitting
  const search = searchbox.value.trim(); // Get the search term from the input

  // Exit early if the search term is empty
  (search && fetchRecipes(search)) ||
    (recipecontainer.innerHTML = "<h2>Please enter a search term.</h2>");
});
