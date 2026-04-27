// Name: Katie Summers
// Description: This is a recipe app that allows users to make recipes depending on the ingredients avaliable in a pantry;

// The home page displays a simple welcome message;
let channelButtons = document.querySelectorAll(".channel");
function changeChannel(e){
    document.querySelector(".channel.active").classList.remove("active");    
    e.currentTarget.classList.add("active");
    let selectedChannel = e.currentTarget.getAttribute("data-channel");
    let currentHTML = "";
    dataChannel = document.querySelector(".channel.active").getAttribute("data-channel");
    if (dataChannel === "home") {
        currentHTML += `
        <div id="home" class="channel-content active">
            <h1>Manage your pantry and recipes. Cook a recipe to automatically subtract ingredients.</h1>
        </div>
        `;
    } else if (dataChannel === "recipes") {
        currentHTML += `
        <div class="channel-content" id="recipes">
            <form id="recipeForm">
                <!--Each recipe's information includes a name, instructions, an optional image url, and zero to many ingredients -->
                <label>Name of Recipe</label>
                <input type="text" name="recipeName" placeholder="Type the name of your recipe here" required>
                <br>
                <label>Instructions for Recipe</label>
                <input type="text-area" name="recipeInstructions" placeholder="Type the instructions for your recipe in this box" required>
                <!-- If not provided, handle gracefully like showing no image-->
                <br>
                <label>Image of Dish</label>
                <input type="text" name="recipePicture" placeholder="If you would like, paste a image URL of the completed recipe">
                <!-- When adding or editing ingredients, allow the user to select from a list of available pantry ingredients-->
                <br>
                <label>Ingredients</label>
                <select id="ingredientSelect" name="ingredientSelect" multiple></select>
                <input type="number" id="quantity" step="0.01" min="0" placeholder="Quantity">
                <select id="unit-select">
                    <option value="unit">unit</option>
                    <option value="tsp">tsp</option>
                    <option value="tbsp">tbsp</option>
                    <option value="cup">cup</option>
                    <option value="ml">ml</option>
                    <option value="g">g</option>
                    <option value="oz">oz</option>
                </select>
                <form id="ingredientForm">
  <label for="type">Ingredient Type:</label>
  <select id="type" name="type">
    <option value="">-- Select Type --</option>
    <option value="measured">Measured (e.g., flour)</option>
    <option value="discrete">Discrete (e.g., eggs)</option>
  </select>

  <!-- Measured section -->
  <div id="measuredSection" class="hidden">
    <label for="measuredQty">Quantity:</label>
    <input type="number" id="measuredQty" name="measuredQty" step="0.01" min="0">
    
    <label for="unit">Unit:</label>
    <select id="unit" name="unit">
      <option value="grams">Grams</option>
      <option value="cups">Cups</option>
      <option value="ml">Milliliters</option>
    </select>
  </div>

  <!-- Discrete section -->
  <div id="discreteSection" class="hidden">
    <label for="discreteQty">Count:</label>
    <input type="number" id="discreteQty" name="discreteQty" step="1" min="0">
  </div>
                <button type="submit">Add Recipe</button>
                <br>
                <hr>
                <div id="recipes">
                </div>
            </form>
        </div>
        `;
    } else if (dataChannel === "ingredients") {
        currentHTML += `
        <div class="channel-content" id="ingredients">
            <form id="ingredientForm">
                <!-- Each ingredient's information includes a name (string) and a quantity-->
                <!-- Adding/topping up ingredients -->
                <label>Top Up: ${ingredient.name}</label>
            </form>
        </div>`
    };
    const div = $("#placeholder");
    div.html(currentHTML);
};
channelButtons.forEach((button) => {
    button.addEventListener("click", changeChannel);
});
$("#recipeForm").on("submit", async function (e){
    e.preventDefault();
    const formData = new FormData(this);
    const name = formData.get.innerText("recipeName");
    const instruct = formData.get.innerText("recipeInstructions");
    const picture = formData.get.innerText("recipePicture");
    let recipeEntry = {
        name,
        instruct,
        picture,
    };
      const typeSelect = document.getElementById('type');
  const measuredSection = document.getElementById('measuredSection');
  const discreteSection = document.getElementById('discreteSection');

  typeSelect.addEventListener('change', function () {
    // Hide both sections initially
    measuredSection.classList.add('hidden');
    discreteSection.classList.add('hidden');

    // Show the relevant section based on selection
    if (this.value === 'measured') {
      measuredSection.classList.remove('hidden');
    } else if (this.value === 'discrete') {
      discreteSection.classList.remove('hidden');
    }
  });
    // Use localStorage to store these recipes after the app has been closed;
    const logs = JSON.parse(localStorage.getItem("recipeLogs") || "[]");
    logs.push(recipeEntry);
    localStorage.setItem("recipeLogs", JSON.stringify(logs));
    let recipesHTML = "";
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        recipesHTML += `
        <div class="scale-buttons">
            <button data-scale="0.5">1/2</button>
            <button data-scale="1">1</button>
            <button data-scale="2">2</button>
        </div>
        <ul id="ingredient-list">
        </ul>
        <button id="cook-btn">Cook Recipe</button>
        <div class="recipe-entry">
            <p><strong>Recipe #${i + 1}</strong></p>
            <p>${log.name}</p>
            <p>${log.instruct}</p>
        `
        // If not provided, handle gracefully like showing no image;
        if (log.picture !== "") {
            recipesHTML += `
            <img src="${log.picture}" alt="image of recipe">`
        }  
    }
    function renderRecipes() {
        document.getElementById("recipe-title").textContent = log.name;
        document.getElementById("recipe-image").src = log.picture || "";
        document.getElementById("instructions").textContent = log.instruct;
        const list = document.getElementById("ingredient-list");
        list.innerHTML = "";
        log.ingredients.forEach(ing => {
            const scaledQty = ing.qty * currentScale;
            const li = document.createElement("li");
            li.textContent = `${ing.name}: ${scaledQty}${ing.unit} (have ${have}${ing.unit})`;
            if (have < scaledQty) {
                li.classList.add("insufficient");
            }
            list.appendChild(li);
        });
    }
    document.querySelectorAll(".scale-buttons button").forEach(btn => {
        btn.addEventListener("click", () => {
            currentScale = parseFloat(btn.getAttribute("data-scale"));
            renderRecipes();
        });
    });
    document.getElementById("cook-btn").addEventListener("click", () => {
      recipe.ingredients.forEach(ing => {
        const scaledQty = ing.qty * currentScale;
        if (ingredient[ing.name] !== undefined) {
          ingredient[ing.name] = Math.max(0, ingredient[ing.name] - scaledQty);
        }
      });
      renderRecipe();
    });

    renderRecipe();
    document.querySelector("#recipes").innerHTML = recipesHTML;
    const ingredients = [
        { name: "Flour", quantity: 2, unit: "cup" },
        { name: "Sugar", quantity: 1, unit: "cup" },
        { name: "Eggs", quantity: 3, unit: "unit" },
        { name: "Milk", quantity: 500, unit: "ml" },
        { name: "Apples", type: "discrete" },
    ];
    const ingredientSelect = document.getElementById("ingredient-select");
    const unitSelect = document.getElementById("unit-select");

    // Populate ingredient dropdown
    ingredients.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      ingredientSelect.appendChild(option);
    });

    // Handle ingredient selection change
    ingredientSelect.addEventListener("change", () => {
      const selectedId = parseInt(ingredientSelect.value, 10);
      const selectedIngredient = ingredients.find(item => item.id === selectedId);

      if (selectedIngredient.type === "discrete") {
        unitSelect.value = "unit";
        unitSelect.disabled = true;
      } else {
        unitSelect.disabled = false;
      }
    });

    // Trigger initial check
    ingredientSelect.dispatchEvent(new Event("change"));

    // Save data to localStorage
function saveData(key, data) {
    if (typeof key !== "string") throw new Error("Key must be a string");
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
        console.error("Error saving to localStorage:", err);
    }
}

// Load data from localStorage
function loadData(key) {
    if (typeof key !== "string") throw new Error("Key must be a string");
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.error("Error reading from localStorage:", err);
        return [];
    }
}

// Generate a unique ID
function generateId() {
    if (crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback if crypto.randomUUID is not supported
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
}

// Example: Adding an ingredient
function addIngredient(name) {
    const ingredients = loadData("ingredients");
    ingredients.push({ id: generateId(), name });
    saveData("ingredients", ingredients);
}

// Example: Adding a recipe
function addRecipe(title, ingredientIds) {
    const recipes = loadData("recipes");
    recipes.push({ id: generateId(), title, ingredients: ingredientIds });
    saveData("recipes", recipes);
}

// Usage
addIngredient("Tomato");
addIngredient("Cheese");
addRecipe("Pizza", loadData("ingredients").map(i => i.id));

console.log("Ingredients:", loadData("ingredients"));
console.log("Recipes:", loadData("recipes"));
});