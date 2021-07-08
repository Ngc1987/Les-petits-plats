const recipes = require("./javascript/recipes.js");




// Input de recherche principale
const input = document.querySelector(".search__input");

// *******************************************************************
// *************** Injection des recettes dans le html ***************
// *******************************************************************
// console.log(recipes.length);



recipes.forEach(recipe => {

    const recipeList = document.querySelector(".recipes");

    const recipeSample = document.createElement("article");
    recipeSample.setAttribute("class", "recipes__sample");
    recipeSample.classList.add("class", "entrees");
    recipeSample.setAttribute("id", recipe.id);

    const recipeSampleHead = document.createElement("div");
    recipeSampleHead.setAttribute("class", "recipes__sample__head");

    const recipeSampleFoot = document.createElement("div");
    recipeSampleFoot.setAttribute("class", "recipes__sample__foot");

    const recipeSampleTitle = document.createElement("div");
    recipeSampleTitle.setAttribute("class", "recipes__sample__foot-title");

    const recipeSampleDetails = document.createElement("div");
    recipeSampleDetails.setAttribute("class", "recipes__sample__foot-details");

    const title = document.createElement("h2");
    title.innerText = recipe.name;
    const time = document.createElement("p");
    time.setAttribute("class", "time");
    time.innerHTML = `<i class="far fa-clock"></i><span>${recipe.time} min</span>`;

    const instruction = document.createElement("p");
    instruction.setAttribute("class", "instruction");
    instruction.innerHTML = recipe.description;

    const ingredientAndQuantity = document.createElement("div");
    ingredientAndQuantity.setAttribute("class", "ingredientAndQuantity");

    recipe.ingredients.forEach(aliment => {

        const details = document.createElement("div");
        details.setAttribute("class", "details");

        const ingredient = document.createElement("p");
        ingredient.setAttribute("class", "ingredient");
        const quantity = document.createElement("p");
        quantity.setAttribute("class", "quantity");

        ingredient.innerHTML = aliment.ingredient;
        quantity.innerHTML = aliment.quantity;

        if (aliment.quantity == undefined) {
            quantity.innerHTML = "";
        }
        details.appendChild(ingredient);
        details.appendChild(quantity);
        ingredientAndQuantity.appendChild(details);
    })

    recipeSampleTitle.appendChild(title);
    recipeSampleTitle.appendChild(time);

    recipeSampleDetails.appendChild(ingredientAndQuantity);
    recipeSampleDetails.appendChild(instruction);

    recipeSampleFoot.appendChild(recipeSampleTitle);
    recipeSampleFoot.appendChild(recipeSampleDetails);

    recipeSample.appendChild(recipeSampleHead);
    recipeSample.appendChild(recipeSampleFoot);

    recipeList.appendChild(recipeSample);
})


const ingredientsList = document.querySelector(".filters__ingredients__list");
const appliancesList = document.querySelector(".filters__appareil__list");
const ustensilsList = document.querySelector(".filters__ustensiles__list");
const filtersIngredientsDiv = document.querySelector(".filters__ingredients");

// Tableaux pour stocker différents tags ingrédients appareils et ustensiles
let ingTags = [];
let appTags = [];
let ustTags = [];

// *******************************************************************************
// ********* Affichage des recettes selon saisie dans l'input principal **********
// *******************************************************************************

input.addEventListener("input", recipeFilterByInput);
// Selection de toutes les recettes présentes dans le html
const recipeSamples = document.querySelectorAll(".recipes__sample");

let filteredRecipes = [];



function getInputSearchResultsAlt() {
    return recipes.filter((obj) => {
        if (input.value.length > 2) {
            // Si la valeur saisie dans l'input existe dans le titre, la description ou un ingredient de la recette, la recette reste apparente, sinon elle disparaît
            if (
                obj.name.toLowerCase().includes(input.value.toLowerCase()) ||
                obj.description.toLowerCase().includes(input.value.toLowerCase()) ||
                obj.ingredients.map(ing => ing.ingredient.toLowerCase()).join(" ").includes(input.value.toLowerCase())
            ) {
                return true
            }
            return false
        }
        return true
    })
}


function getInputSearchResults() {

    const filteredRecipesByInput = recipes.reduce((acc, recipe) => {

        if(input.value.length > 2) {
            if (
                recipe.name.toLowerCase().includes(input.value.toLowerCase()) ||
                recipe.description.toLowerCase().includes(input.value.toLowerCase()) ||
                recipe.ingredients.map(ing => ing.ingredient.toLowerCase()).join(" ").includes(input.value.toLowerCase())
            ) {
                acc.push(recipe);
            }
        } else {
            acc.push(recipe);
        } 
        return acc;
    }, [])
    return filteredRecipesByInput;
}


function getTagsSearchResults() {

    return recipes.filter((obj) => {

        let testIng = true;
        let testApp = true;
        let testUst = true;

        let compteurIng = 0;
        let compteurUst = 0;

        if (ingTags.length > 0) {

            ingTags.forEach(ingTag => {

                for (let i = 0; i < obj.ingredients.length; i++) {
                    if (obj.ingredients[i].ingredient.toLowerCase().includes(ingTag)) {
                        compteurIng++;
                        // console.log(compteurIng);
                    }
                    if (compteurIng === ingTags.length) {
                        testIng = true;
                    } else {
                        testIng = false;
                    }
                }
            })
        }


        if (appTags.length > 0) { // Tableau de tags appareils contient l'appareil de la recette
            testApp = appTags.includes(obj.appliance.toLowerCase());
        }

        if (ustTags.length > 0) {

            ustTags.forEach(ustTag => {

                for (let i = 0; i < obj.ustensils.length; i++) {
                    if (obj.ustensils[i].toLowerCase().includes(ustTag)) {
                        compteurUst++;
                        // console.log(compteurIng);
                    }
                    if (compteurUst == ustTags.length) {
                        testUst = true;
                    } else {
                        testUst = false;
                    }
                }
            })
        }
        // console.log(compteurIng);

        return testIng && testApp && testUst;
    })
}







function recipeFilterByInput() {

    refreshSearch();

}


function isInSearchResult(recipeId) {

    recipeId = parseInt(recipeId, 10)

    const filterIds = filteredRecipes.map(obj => obj.id)

    if (filterIds.includes(recipeId)) {
        return true;
    }
    return false;
}

function refreshSearch() {

    filteredRecipes = recipes.filter((recipe) => {
        if (getInputSearchResults().map(obj => obj.id).includes(recipe.id) && getTagsSearchResults().map(obj => obj.id).includes(recipe.id)) {
            return true;
        }
        return false;
    })

    Array.from(recipeSamples).forEach(recipeSample => {
        recipeSample.style.display = isInSearchResult(recipeSample.getAttribute("id")) ? "flex" : "none";
    })

    filterIngredients();
    filterAppliances();
    filterUstensils();

    // const errorMsg = document.querySelector(".error");

    // function error() {
    //     if (Array.from(filteredRecipes).length < 1) {
    //         errorMsg.style.display = "flex";
    //     } else {
    //         errorMsg.style.display = "none";
    //     }
    // }

    // error();
}





// *******************************************************************************
// **************** Création des tags de recherche supplémentaire ****************
// *******************************************************************************

const enterButton = document.querySelector(".search__logo");
let nouveauTag = input.value;

function createNewTag(tagChoisi, color) {

    switch (color) {
        case "blue":
            if (!ingTags.includes(tagChoisi)) {
                ingTags.push(tagChoisi.toLowerCase())
                console.log(ingTags);
                createNewHtmlTag(tagChoisi, color);
            }
            break;
        case "green":
            if (!appTags.includes(tagChoisi)) {
                appTags.push(tagChoisi.toLowerCase())
                createNewHtmlTag(tagChoisi, color);
            }
            break;
        case "red":
            console.log(ustTags);
            if (!ustTags.includes(tagChoisi)) {
                ustTags.push(tagChoisi.toLowerCase())
                createNewHtmlTag(tagChoisi, color);
            }
            break;

        default:
            break;
    }

    refreshSearch();

}

function createNewHtmlTag(tagChoisi, color) {

    const tagList = document.querySelector(`.tag__${color}`);
    let nouveauTag = tagChoisi;

    let tag = document.createElement("div");
    tag.setAttribute("class", "tag__" + color + "__item");
    tag.classList.add("tagAnim");

    let tagName = document.createElement("p");
    tagName.appendChild(document.createTextNode(tagChoisi));

    let deleteButton = document.createElement("i");
    deleteButton.setAttribute("class", "far fa-times-circle");

    tag.appendChild(tagName);
    tag.appendChild(deleteButton);
    tagList.appendChild(tag);

    // input.value = "";

    deleteButton.addEventListener("click", deleteTag)

    function deleteTag() {
        tag.style.display = "none";

        switch (color) {
            case "blue":
                ingTags = ingTags.filter(tag => tag != tagChoisi)
                break;
            case "green":
                appTags = appTags.filter(tag => tag != tagChoisi)
                break;
            case "red":
                ustTags = ustTags.filter(tag => tag != tagChoisi)
                break;

            default:
                break;
        }

        refreshSearch();
    }

    console.log(nouveauTag);

    showIngredientsInput();
}


function addTagAfterClick() {
    if (input.value.length > 0) {
        createNewTag(input.value, "blue");
    }
    console.log(input.value);
}

function addTagAfterKeypress() {
    // 13 = touche entrée
    if (input.value.length > 0 && event.which === 13) {
        createNewTag(input.value, "blue");
    }
}

enterButton.addEventListener("click", addTagAfterClick);
input.addEventListener("keypress", addTagAfterKeypress);


// ******************************************************************
// ********************TAGS INGREDIENTS APPAREILS USTENSILES*********
// *******************************************************************

document.addEventListener('click', function (e) {

    if (e.target.classList.contains('filters__ingredients__list-item')) {
        createNewTag(e.target.innerText, "blue")
    }

    if (e.target.classList.contains('filters__appareil__list-item')) {
        createNewTag(e.target.innerText, "green")
    }

    if (e.target.classList.contains('filters__ustensiles__list-item')) {
        createNewTag(e.target.innerText, "red")
    }
});


// *******************************************************************************
//  Affichage ingredients selon recettes restantes apres recherche premier mot-clé
// ********************* Fonction relancée à chaque recherche ********************
// *******************************************************************************
function showIngredientsInput() {

    ingredientsList.innerHTML = "";
    const ingredientsBigArray = [];
    const allIngredients = document.querySelectorAll(".ingredient");

    allIngredients.forEach(ingredient => {
        if (ingredient.parentElement.parentElement.parentElement.parentElement.parentElement.style.display == "flex") {
            ingredientsBigArray.push(ingredient.innerText.toLowerCase());
        }
    })

    ingredientsBigArray.sort();

    const ingredientsToShowOnIngredientsDiv = new Set(ingredientsBigArray);

    Array.from(ingredientsToShowOnIngredientsDiv).forEach(ingredientToShow => {
        const li = document.createElement("li");
        li.setAttribute("class", "filters__ingredients__list-item");
        li.innerHTML = ingredientToShow;
        ingredientsList.appendChild(li);
    })
}

// showIngredientsInput();


// *******************************************************************************
// **************** Fonctions pour ouverture et fermeture des champs *************
// ********** de recherche avancée ingrédients, appareils et ustensiles **********
// *******************************************************************************
const ingredientsDiv = document.querySelector(".filters__ingredients");
const appliancesDiv = document.querySelector(".filters__appareil");
const ustensilsDiv = document.querySelector(".filters__ustensiles");

const ingredientsInputHead = document.querySelector(".filters__ingredients__head");
const ingredientsInput = document.querySelector(".filters__ingredients__head-input");
const ingredientsArrow = document.querySelector(".filters__ingredients__head-arrow");
const appliancesInputHead = document.querySelector(".filters__appareil__head");
const appliancesInput = document.querySelector(".filters__appareil__head-input");
const appliancesArrow = document.querySelector(".filters__appareil__head-arrow");
const ustensilsInputHead = document.querySelector(".filters__ustensiles__head");
const ustensilsInput = document.querySelector(".filters__ustensiles__head-input");
const ustensilsArrow = document.querySelector(".filters__ustensiles__head-arrow");

// *******************************************************************************
// ******* Ouverture et fermeture champs de recherche avancée Ingrédients ********
// *******************************************************************************


function blueShadow() {
    ingredientsDiv.classList.add("blueShadow")
}

function greenShadow() {
    appliancesDiv.classList.add("greenShadow")
}

function redShadow() {
    ustensilsDiv.classList.add("redShadow")
}

function noBlueShadow() {
    ingredientsDiv.classList.remove("blueShadow")
}

function noGreenShadow() {
    appliancesDiv.classList.remove("greenShadow")
}

function noRedShadow() {
    ustensilsDiv.classList.remove("redShadow")
}

function showIngredients() {
    appliancesList.style.width = "0";
    appliancesList.style.height = "0";
    appliancesList.style.visibility = "hidden";

    ustensilsList.style.width = "0";
    ustensilsList.style.height = "0";
    ustensilsList.style.visibility = "hidden";

    ingredientsInputHead.classList.remove("inputClose");
    ingredientsInputHead.classList.add("inputOpen");

    ingredientsList.style.boxShadow = "0px 0px 5px #3282f7,0px 0px 10px #3282f7,0px 0px 15px #3282f7";
    ingredientsList.classList.remove("animClose");
    ingredientsList.classList.add("animOpen");

    ingredientsInput.setAttribute("placeholder", "Rechercher un ingrédient");

    ingredientsArrow.classList.remove("closeArrow");
    ingredientsArrow.classList.add("openArrow");

    blueShadow();
}

function hideIngredients() {
    ingredientsInputHead.classList.remove("inputOpen");
    ingredientsInputHead.classList.add("inputClose");

    ingredientsList.classList.remove("animOpen");
    ingredientsList.classList.add("animClose");

    ingredientsInput.setAttribute("placeholder", "Ingrédients");

    ingredientsArrow.classList.remove("openArrow");
    ingredientsArrow.classList.add("closeArrow");

    noBlueShadow();
}

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains('filters__ingredients__list-item') && !e.target.classList.contains('filters__ingredients__head-input') && ingredientsList.classList.contains("animOpen")) {
        hideIngredients();
    }

    if (e.target.classList.contains('filters__ingredients__head-input')) {
        showIngredients();
    }
})

ingredientsInput.addEventListener("focus", showIngredients);
ingredientsArrow.addEventListener("click", showIngredients);
// ingredientsInput.addEventListener("focus", showIngredientsInput);
// ingredientsArrow.addEventListener("click", showIngredientsInput);

// *******************************************************************************
// ******** Ouverture et fermeture champs de recherche avancée Appareils *********
// *******************************************************************************

function showAppliances() {
    ingredientsList.style.width = "0";
    ingredientsList.style.height = "0";
    ingredientsList.style.visibility = "hidden";

    ustensilsList.style.width = "0";
    ustensilsList.style.height = "0";
    ustensilsList.style.visibility = "hidden";

    appliancesInputHead.classList.remove("inputClose");
    appliancesInputHead.classList.add("inputOpen");

    appliancesList.style.boxShadow = "0px 0px 5px #68d9a4,0px 0px 10px #68d9a4,0px 0px 15px #68d9a4";
    appliancesList.classList.remove("animClose");
    appliancesList.classList.add("animOpen");

    appliancesInput.setAttribute("placeholder", "Rechercher un appareil");

    appliancesArrow.classList.remove("closeArrow");
    appliancesArrow.classList.add("openArrow");

    greenShadow();
}

function hideAppliances() {
    appliancesInputHead.classList.remove("inputOpen");
    appliancesInputHead.classList.add("inputClose");

    appliancesList.classList.remove("animOpen");
    appliancesList.classList.add("animClose");

    appliancesInput.setAttribute("placeholder", "Appareils");

    appliancesArrow.classList.remove("openArrow");
    appliancesArrow.classList.add("closeArrow");

    noGreenShadow();
}

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains('filters__appareil__list-item') && !e.target.classList.contains('filters__appareil__head-input') && appliancesList.classList.contains("animOpen")) {
        hideAppliances();
    }

    if (e.target.classList.contains('filters__appareil__head-input')) {
        showAppliances();
    }
})

appliancesInput.addEventListener("focus", showAppliances);
appliancesArrow.addEventListener("click", showAppliances);

// *******************************************************************************
// ******** Ouverture et fermeture champs de recherche avancée Ustensiles ********
// *******************************************************************************

function showUstensils() {
    ingredientsList.style.width = "0";
    ingredientsList.style.height = "0";
    ingredientsList.style.visibility = "hidden";

    appliancesList.style.width = "0";
    appliancesList.style.height = "0";
    appliancesList.style.visibility = "hidden";

    ustensilsInputHead.classList.remove("inputClose");
    ustensilsInputHead.classList.add("inputOpen");

    ustensilsList.style.boxShadow = "0px 0px 5px #ed6454,0px 0px 10px #ed6454,0px 0px 15px #ed6454";
    ustensilsList.classList.remove("animClose");
    ustensilsList.classList.add("animOpen");

    ustensilsInput.setAttribute("placeholder", "Rechercher un ustensile");

    ustensilsArrow.classList.remove("closeArrow");
    ustensilsArrow.classList.add("openArrow");

    redShadow();
}

function hideUstensils() {
    ustensilsInputHead.classList.remove("inputOpen");
    ustensilsInputHead.classList.add("inputClose");

    ustensilsList.classList.remove("animOpen");
    ustensilsList.classList.add("animClose");

    ustensilsInput.setAttribute("placeholder", "Ustensiles");

    ustensilsArrow.classList.remove("openArrow");
    ustensilsArrow.classList.add("closeArrow");

    noRedShadow();
}

ustensilsInput.addEventListener("focus", showUstensils);
ustensilsArrow.addEventListener("click", showUstensils);


document.addEventListener("click", function (e) {

    if (!e.target.classList.contains('filters__ustensiles__list-item') && !e.target.classList.contains('filters__ustensiles__head-input') && ustensilsList.classList.contains("animOpen")) {
        hideUstensils();
    }

    if (e.target.classList.contains('filters__ustensiles__head')) {
        showUstensils();
    }
})


// ****************************************************************************
// ****** Affichage Tableau d'ingrédients dans chapms de recherche avancée ****
// ****************************************************************************
const ingredientsBigArray = [];

function searchIngredients() {
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(aliment => {
            ingredientsBigArray.push(aliment.ingredient.toLowerCase())
        })
    })

    const ingredientsArray = new Set(ingredientsBigArray);

    ingredientsArray.forEach(ingredient => {

        const li = document.createElement("li");
        li.setAttribute("class", "filters__ingredients__list-item");
        li.innerHTML = ingredient;
        ingredientsList.appendChild(li);
    })

    // console.log(ingredientsArray);
}

searchIngredients();

// ******************************************************************
// ***** Autosuggestion selon texte tapé dans input ingredients *****
// ******************************************************************

function hideOrShowIngredients() {
    const ingredientsToHide = document.querySelectorAll(".filters__ingredients__list-item");

    ingredientsToHide.forEach(ingredientToHide => {
        if (!ingredientToHide.innerText.includes(ingredientsInput.value)) {
            ingredientToHide.style.display = "none";
        } else {
            ingredientToHide.style.display = "flex";
        }
    })
}
ingredientsInput.addEventListener("input", hideOrShowIngredients);


function filterIngredients() {
    const ingredients = filteredRecipes.map(obj => obj.ingredients.map(ing => ing.ingredient.toLowerCase())).flat();
    const uniqueList = ingredients.filter((item, index) => ingredients.indexOf(item) == index);
    // console.log(uniqueList); 

    ingredientsList.innerHTML = "";

    uniqueList.forEach(ingredient => {

        const li = document.createElement("li");
        li.setAttribute("class", "filters__ingredients__list-item");
        li.innerHTML = ingredient;
        ingredientsList.appendChild(li);
    })
    console.log();
}

// ****************************************************************************
// ******************************Tableau d'appareils**************************
// ****************************************************************************

const appliancesBigArray = [];

function searchAppliances() {
    recipes.forEach(recipe => {
        appliancesBigArray.push(recipe.appliance.toLowerCase())
    })

    const appliancesArray = new Set(appliancesBigArray);

    appliancesArray.forEach(appliance => {

        const li = document.createElement("li");
        li.setAttribute("class", "filters__appareil__list-item");
        li.innerHTML = appliance;
        appliancesList.appendChild(li);
    })
}
searchAppliances();

function filterAppliances() {
    const appliances = filteredRecipes.map(obj => obj.appliance.toLowerCase())
    const uniqueList = appliances.filter((item, index) => appliances.indexOf(item) == index)
    // console.log(uniqueList);

    appliancesList.innerHTML = "";

    uniqueList.forEach(appliance => {

        const li = document.createElement("li");
        li.setAttribute("class", "filters__appareil__list-item");
        li.innerHTML = appliance;
        appliancesList.appendChild(li);
    })
}




// ******************************************************************
// ****** Autosuggestion selon texte tapé dans input appareils ******
// ******************************************************************
function hideOrShowAppliances() {
    const appliancesToHide = document.querySelectorAll(".filters__appareil__list-item");

    appliancesToHide.forEach(applianceToHide => {
        if (!applianceToHide.innerText.includes(appliancesInput.value)) {
            applianceToHide.style.display = "none";
        } else {
            applianceToHide.style.display = "flex";
        }
    })
}
appliancesInput.addEventListener("input", hideOrShowAppliances);


// ****************************************************************************
// ******************************Tableau d'ustensiles**************************
// ****************************************************************************
const ustensilsBigArray = [];

function searchUstensils() {
    recipes.forEach(recipe => {
        recipe.ustensils.forEach(ustensil => {
            ustensilsBigArray.push(ustensil.toLowerCase())
        })
    })

    const ustensilsArray = new Set(ustensilsBigArray);

    ustensilsArray.forEach(ustensil => {

        const li = document.createElement("li");
        li.setAttribute("class", "filters__ustensiles__list-item");
        li.innerHTML = ustensil;
        ustensilsList.appendChild(li);
    })

    // console.log(ustensilsArray);
}

searchUstensils();


function filterUstensils() {
    const ustensils = filteredRecipes.map(obj => obj.ustensils.map(str => str.toLowerCase())).flat();
    const uniqueList = ustensils.filter((item, index) => ustensils.indexOf(item) == index);
    // console.log(uniqueList);

    ustensilsList.innerHTML = "";

    uniqueList.forEach(ustensil => {

        const li = document.createElement("li");
        li.setAttribute("class", "filters__ustensiles__list-item");
        li.innerHTML = ustensil;
        ustensilsList.appendChild(li);
    })
    console.log();
}

// ******************************************************************
// ***** Autosuggestion selon texte tapé dans input ustensiles ******
// ******************************************************************
function hideOrShowUstensiles() {
    const ustensilsToHide = document.querySelectorAll(".filters__ustensiles__list-item");

    ustensilsToHide.forEach(ustensilToHide => {
        if (!ustensilToHide.innerText.includes(ustensilsInput.value)) {
            ustensilToHide.style.display = "none";
        } else {
            ustensilToHide.style.display = "flex";
        }
    })
}
ustensilsInput.addEventListener("input", hideOrShowUstensiles);


console.log(ingTags.length);
