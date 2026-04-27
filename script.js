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
                <input type="text" name="recipeName" placeholder="e.g., Pancakes" required>
                <br>
                <label>Instructions for Recipe</label>
                <input type="text-area" name="recipeInstructions" placeholder="Type instructions for your recipe in this box" required>
                <!-- If not provided, handle gracefully like showing no image-->
                <br>
                <label>Image of Dish</label>
                <input type="text" name="recipePicture" placeholder="image URL of dish (optional)">
                <!-- When adding or editing ingredients, allow the user to select from a list of available pantry ingredients-->
                <br>
                <label>Ingredients</label>
                <select id="ingredientSelect" name="ingredientSelect" multiple size="5"></select>
                <br>
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
                <br>
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
                <br>
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
            <input type="text" id="searchBox" placeholder="Search by name...">
                <!-- Each ingredient's information includes a name (string) and a quantity-->
                <!-- Adding/topping up ingredients -->
            </form>
        </div>`
    };
    const div = $("#placeholder");
    div.html(currentHTML);
};
channelButtons.forEach((button) => {
    button.addEventListener("click", changeChannel);
});
let recipeEntry = {};
$("#recipeForm").on("submit", async function (e){
    e.preventDefault();
    const formData = new FormData(this);
    const name = formData.get.innerText("recipeName");
    const instructins = formData.get.innerText("recipeInstructions");
    const picture = formData.get.innerText("recipePicture");
    const typeSelect = document.getElementById('type');
  const measuredSection = document.getElementById('measuredSection');
  const discreteSection = document.getElementById('discreteSection');
  typeSelect.addEventListener('change', function () {
    // Hide both sections initially
    measuredSection.classList.add('hidden');
    discreteSection.classList.add('hidden');
    recipeEntries = {
        name,
        instructions,
        picture,
        ingredients: [],
    };
    localStorage.setItem("recipeEntry", JSON.stringify(recipeEntry));
    // Show the relevant section based on selection
    if (this.value === 'measured') {
      measuredSection.classList.remove('hidden');
    } else if (this.value === 'discrete') {
      discreteSection.classList.remove('hidden');
    }
  });

    const ingredientSelect = document.getElementById("ingredientSelect");
    const selectedOptions = Array.from(ingredientSelect.selectedOptions);
});
    // Use localStorage to store these recipes after the app has been closed;
    const logs = JSON.parse(localStorage.getItem("recipeLogs") || "[]");
    logs.push(recipeEntry);
    localStorage.setItem("recipeLogs", JSON.stringify(logs));
    let recipesHTML = "";
    let log = {};
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
        if (logs.length === 0) {
            document.getElementById("recipe-title").textContent = "No recipes yet!";
            document.getElementById("recipe-image").src = "";
            document.getElementById("instructions").textContent = "";
            document.getElementById("ingredient-list").innerHTML = "";
        } else {    
        for (let i = 0; i < recipeEntries.length; i++) {
            const entry = recipeEntries[i];
        document.getElementById("recipe-title").textContent = entry.name;
        document.getElementById("recipe-image").src = entry.picture || "";
        document.getElementById("instructions").textContent = entry.instructions;
        }
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
    }
    document.querySelectorAll(".scale-buttons button").forEach(btn => {
        btn.addEventListener("click", () => {
            currentScale = parseFloat(btn.getAttribute("data-scale"));
            renderRecipes();
        });
    });
    if (document.querySelector("#cook-btn")) {
        document.querySelector("#cook-btn").addEventListener("click", () => {
          recipe.ingredients.forEach(ing => {
            const scaledQty = ing.qty * currentScale;
            if (ingredient[ing.name] !== undefined) {
              ingredient[ing.name] = Math.max(0, ingredient[ing.name] - scaledQty);
            }
      })
    });
      renderRecipes();
    };

    renderRecipes();
    document.querySelector("#recipes").innerHTML = recipesHTML;
    const ingredients = [
        { name: "Flour", type: "measured", quantity: 2, unit: "cup" },
        { name: "Sugar", type: "measured", quantity: 1, unit: "cup" },
        { name: "Eggs", type: "discrete", quantity: 3, unit: "unit" },
        { name: "Milk", type: "measured", quantity: 500, unit: "ml" },
        { name: "Apples", type: "discrete", quantity: 5, unit: "unit" },
        { name: "Butter", type: "measured", quantity: 200, unit: "g"},
        { name: "Salt", type: "measured", quantity: 0.5, unit: "tsp" },
    ];

    for (const ingredient of ingredients) {
        document.querySelector("#ingredient-select").innerHTML += `
            <option value="${ingredient.name}">${ingredient.name}</option>
        `;
    };

    for (const ingredient of ingredients) {
        document.querySelector("#unit-select").innerHTML += `
            <option value="${ingredient.unit}">${ingredient.unit}</option>
        `;
    };

    function formatQuantity(value) {
    const fractions = [
        { dec: 0.125, frac: "1/8" },
        { dec: 0.25, frac: "1/4" },
        { dec: 0.3333, frac: "1/3" },
        { dec: 0.5, frac: "1/2" },
        { dec: 0.6667, frac: "2/3" },
        { dec: 0.75, frac: "3/4" }
    ];
    for (const { dec, frac } of fractions) {
        if (Math.abs(value - dec) < 0.01) {
            return frac;
        }
    }

    function convertToCanonical(amount, unit) {
    const conversionRates = {
        g: 1,
        kg: 1000,
        mg: 0.001,
        lb: 453.592,
        oz: 28.3495
    };

    if (!conversionRates[unit]) {
        throw new Error(`Unknown unit: ${unit}`);
    }

    return amount * conversionRates[unit];
}

    return value.toString();
}

const searchBox = document.getElementById("searchBox");
const listItems = document.querySelectorAll("#ingredientList li");

// Listen for typing in the search box
searchBox.addEventListener("input", function () {
    const query = searchBox.value.toLowerCase(); // lowercase for case-insensitive match

    listItems.forEach(item => {
        const name = item.textContent.toLowerCase();
        // Show item if it contains the search text, hide otherwise
        item.style.display = name.includes(query) ? "" : "none";
    });
});

    if (Number.isInteger(ingredient.quantity)) {
        document.querySelector("#ingredientForm").innerHTML += `
            <label>Top Up: ${ingredient.name}</label>
            <input type="number" name="${ingredient.name}-qty" placeholder="Quantity to add">
        `;
    } else {
        const formattedQty = formatQuantity(ingredient.quantity);
        document.querySelector("#ingredientForm").innerHTML += `
            <label>Top Up: ${ingredient.name}</label>
            <input type="number" name="${ingredient.name}-qty" placeholder="Quantity to add">
        `;
    };

    for (const ingredient of ingredients) {
        document.querySelector("#ingredientForm").innerHTML += `
            <label>Top Up: ${ingredient.name}</label>
            <input type="number" name="${ingredient.name}-qty" placeholder="Quantity to add">
        `;
    };

    const ingredientSelect = document.getElementById("ingredient-select");
    const unitSelect = document.getElementById("unit-select");

    function toCanonical(qty, unit) {
    if (!unitConversions[unit]) {
        throw new Error(`Unsupported unit: ${unit}`);
    }
    return qty * unitConversions[unit];
};
function calculateCanonicalQuantity(packageQty, isServingBased, servingInfo = null, directUnit = null) {
    if (typeof packageQty !== 'number' || packageQty <= 0) {
        throw new Error("Package quantity must be a positive number");
    }

    if (isServingBased) {
        if (!servingInfo || typeof servingInfo.amount !== 'number' || !servingInfo.unit) {
            throw new Error("Serving info must include amount and unit");
        }
        const totalAmount = packageQty * servingInfo.amount;
        return toCanonical(totalAmount, servingInfo.unit);
    } else {
        if (!directUnit) {
            throw new Error("Direct unit must be provided for non-serving-based input");
        }
        return toCanonical(packageQty, directUnit);
    }
};

items.forEach(item => {
    const li = document.createElement("li");

    // Create name span
    const nameSpan = document.createElement("span");
    nameSpan.textContent = item.name;

    // Create quantity span
    const qtySpan = document.createElement("span");
    qtySpan.textContent = ` (${item.quantity})`;

    // Apply visual cues if low stock
    const isLowStock = item.isDiscrete
        ? item.quantity < 3
        : item.quantity < 1;

    if (isLowStock) {
        nameSpan.style.color = "red";
        qtySpan.style.fontWeight = "bold";
    }

    li.appendChild(nameSpan);
    li.appendChild(qtySpan);
    document.getElementById("ingredientList").appendChild(li);
});

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

function setDiscreteQuantity(count) {
    // Validate that count is a non-negative integer
    if (!Number.isInteger(count) || count < 0) {
        throw new Error("Quantity must be a non-negative integer.");
    }
    return count; // canonical quantity
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

for (let ingredient of recipe) {
        const pantryItem = pantry.find(p => p.name.toLowerCase() === ingredient.name.toLowerCase());

        if (!pantryItem) {
            alert(`Missing ingredient: ${ingredient.name}`);
        }

        // Convert recipe amount to pantry's unit
        if (!conversionRates[ingredient.unit] || !conversionRates[pantryItem.unit]) {
            alert(`Unit mismatch for ${ingredient.name}`);
        }

        const recipeAmountInCanonical = ingredient.amount * conversionRates[ingredient.unit];
        const pantryAmountInCanonical = pantryItem.quantity * conversionRates[pantryItem.unit];

        if (recipeAmountInCanonical > pantryAmountInCanonical) {
            alert(`Not enough ${ingredient.name}`);
        }

    // Deduct quantities
    recipe.forEach(ingredient => {
        const pantryItem = pantry.find(p => p.name.toLowerCase() === ingredient.name.toLowerCase());
        const recipeAmountInCanonical = ingredient.amount * conversionRates[ingredient.unit];
        const pantryAmountInCanonical = pantryItem.quantity * conversionRates[pantryItem.unit];

        let newAmount = pantryAmountInCanonical - recipeAmountInCanonical;
        if (newAmount < 0) newAmount = 0;

        // Store back in pantry in canonical unit
        pantryItem.quantity = newAmount / conversionRates[pantryItem.unit];
    });

    // Show success message
    const msg = document.createElement("div");
    msg.textContent = "Meal cooked — pantry updated!";
    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.right = "20px";
    msg.style.background = "green";
    msg.style.color = "white";
    msg.style.padding = "10px";
    msg.style.borderRadius = "5px";
    document.body.appendChild(msg);

    setTimeout(() => msg.remove(), 2000); // Remove after 2 seconds
};
function showFlashMessage(message, type = "success") {
    const msg = document.createElement("div");
    msg.classList.add("flash-message");
    msg.classList.add(type === "success" ? "flash-success" : "flash-error");
    msg.textContent = message;

    document.body.appendChild(msg);

    // Fade out after 2 seconds
    setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 500); // Remove after fade
    }, 2000);
};