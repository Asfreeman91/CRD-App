let pizzaBox = document.getElementById('pizza-box'); //this is the div that contains a div for each pizza style
let pizzaList = [];
let pizzaToModifyId = null;
let pizzaFormText1 = document.getElementById('pizzaformtext1') //the user input for pizza style
let pizzaFormText2 = document.getElementById('pizzaformtext2') //the user input for pizza toppings
let crustText = document.getElementById('crust-select') //the drop down that allows a user to select a crustId

function refreshList() { //refreshes the page
    pizzaBox.innerHTML = '';
    if (pizzaList.length === 0) {
        pizzaBox.innerHTML = "No new pizza styles have been created yet."
    }
    pizzaList.map(renderPage).forEach(div => pizzaBox.appendChild(div)); //each item in the pizza list array is added to a separate div
}

function renderPage(pizza) { //renders a div that contains content for each pizza style
    let pizzaDiv = document.createElement("div")
    pizzaDiv.className = "bg-primary mb-2 p-3"
    pizzaDiv.innerHTML = `
        <h3>${pizza.style}</h3>
        <p>${pizza.traditionalToppings}</p>
        <p>${pizza.crustId}</p><br>
        <button id="deletepizza" class="btn btn-danger btn-sm m-3">Delete Pizza</button>
        
    `
    pizzaDiv.querySelector('#deletepizza').addEventListener("click", async () => {
        await onClickDeletePizza(pizza.id);
        const pizzaToDelete = pizzaList.indexOf(pizza);
        pizzaList.splice(pizzaToDelete, 1)

        refreshList();

    });
    return pizzaDiv;
}

function renderNewPizzaDiv(pizzaData) { //creates a new pizza div from user input to be added to the list 
    pizzaFormText1 = pizzaData.style;
    pizzaFormText2 = pizzaData.traditionalToppings;
    crustText = pizzaData.crustId;   
}

async function onClickSaveInfo(event) { 

    const pizzaData = { //pizza data includes the values from the three input fields
        style: pizzaFormText1.value,
        traditionalToppings: pizzaFormText2.value,
        crustId: crustText.value
};
        const createdPizza = await onClickCreatePizza(pizzaData);
        pizzaList.push(createdPizza);
    
    refreshList();
   
    renderNewPizzaDiv({style: '', traditionalToppings: '', crustId: ''}); 
}

async function onClickFetchPizza() { //Fetch pizza data
    const response = await fetch('http://localhost:3000/pizza');
    return response.json();
}

async function onClickCreatePizza(newPizza) { //Create a pizza
     const response = await fetch('http://localhost:3000/pizza', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPizza)
    });
    return response.json();
}

async function onClickDeletePizza(pizzaToDelete) { //Delete a pizza
  
    await fetch(`http://localhost:3000/pizza/${pizzaToDelete}`, {
        method: "DELETE"
    });
}

async function startApp() { //starts app and refreshes the list 
    refreshList();
    pizzaList = await onClickFetchPizza();
    refreshList();
}

startApp();

