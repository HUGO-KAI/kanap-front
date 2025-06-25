/*
- Afficer les produits choisis
- Ecouter le changement de quantité ou supprimer des items dans le panier
- Valider le formulaire de contact 
- Envoyer le formulaire de contact et id des products au server
- Récupérer Id de la commande et rediger vers la page confirmation
*/


const urlProducts = `http://localhost:3000/api/products`;
container = document.getElementById("cart__items");
let localProducts = JSON.parse(localStorage.getItem("localProducts"));
let allProducts = [];
init(urlProducts);

/*Afficher les produits choisis par l'utilisateur sur la page panier*/
function init (url) {
    if (localProducts == null || localProducts.length == 0){
        //document.querySelector ("h1").textContent = "Votre panier est vide";
        totalQuantityPrice ();
    }
    else {
        fetch(url)
        .then(function(res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then(function(products) {
            allProducts = products;
            for (let i = 0; i < products.length; i++ ){
                for (let j = 0; j < localProducts.length; j++){
                    if (products[i]._id == localProducts[j].id){
                        container.innerHTML += `<article class="cart__item" data-id=${localProducts[j].id} data-color="${localProducts[j].colors}">
                        <div class="cart__item__img">
                            <img src=${products[i].imageUrl} alt=${products[i].altTxt}>
                        </div>
                        <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${products[i].name}</h2>
                            <p>${localProducts[j].colors}</p>
                            <p>${parseFloat(products[i].price)} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${localProducts[j].quantity}>
                            </div>
                            <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                        </div>
                    </article>`;
                    }
                }
            }
            totalQuantityPrice ();
            deleteItem();
            changeQuantity();
        })
        .catch(function(err) {
            window.alert("Échec de la connexion");
        })
    }
}

/*Indiquer quantité totale et le prix total sur la page panier*/
function totalQuantityPrice (){
    localProducts = JSON.parse(localStorage.getItem("localProducts"));
    let itemsQuantity = 0;
    let itemsPrice = 0;
    if (localProducts == null){
        itemsQuantity = 0;
        itemsPrice = 0;
    }
    else {
        for (let i = 0; i < localProducts.length; i++){
            for (let j = 0; j < allProducts.length; j++){
                if (localProducts[i].id == allProducts[j]._id){
                    itemsQuantity += parseInt(localProducts[i].quantity);
                    itemsPrice += parseInt(localProducts[i].quantity) * parseFloat(allProducts[j].price);
                }
            }
        }
    }
    document.getElementById("totalQuantity").textContent = itemsQuantity;
    document.getElementById("totalPrice").textContent = itemsPrice;
}

/*Permettre aux utilisateurs de supprimer les items dans le panier */
function deleteItem(){
    const supprimerButtons = document.querySelectorAll(".deleteItem");
    supprimerButtons.forEach(function(supprimerButton){
        supprimerButton.addEventListener("click",function(){
            if (window.confirm ("Êtes-vous sûr de vouloir supprimer cet élément du panier?")){
                let supprimerId = supprimerButton.closest(".cart__item").getAttribute("data-id");
                let supprimerColors = supprimerButton.closest(".cart__item").getAttribute("data-color");
                for(let localProduct of localProducts){
                    if (localProduct.id == supprimerId && localProduct.colors == supprimerColors){
                        container.removeChild (supprimerButton.closest(".cart__item"));
                        localProducts = localProducts.filter(product => product != localProduct);
                        localStorage.setItem("localProducts", JSON.stringify(localProducts));
                    }
                };
            }
            else {
                return;
            }
            totalQuantityPrice ();
        })
    })
}
            
/*Permettre aux utilisateurs de modifier la quantité des items présents dans le panier */
function changeQuantity(){
    const changeButtons = document.querySelectorAll(".itemQuantity");
    changeButtons.forEach(function(changeButton){
        changeButton.addEventListener("change",function(){
            let changeQuantityId = changeButton.closest(".cart__item").getAttribute("data-id");
            let changeQuantitycolors = changeButton.closest(".cart__item").getAttribute("data-color");
            for(let localProduct of localProducts){
                if (localProduct.id == changeQuantityId && localProduct.colors == changeQuantitycolors){
                    localProduct.quantity = parseInt(changeButton.value);
                    localStorage.setItem("localProducts", JSON.stringify(localProducts));
                }
            }
            totalQuantityPrice ();
        })
    })
}

//valider input prénom
const form = document.querySelector(".cart__order__form");
let nameRegExp = /^[a-zéèç]+[a-zéèç\s\-\'\_\/]*[a-zéèç\s]$/i;
form.firstName.addEventListener('change', function(){
    valideFirstName(this);
});
const valideFirstName = function(inputFirstName){
    let testFirstName = nameRegExp.test(inputFirstName.value);
    if (testFirstName == false) {
        document.getElementById("firstNameErrorMsg").textContent = "Prénom non valide. Exemple: Patrick, hélène, françois, Jean-luc...";
        return false;
    }
    else {
        document.getElementById("firstNameErrorMsg").textContent = "";
        return true;
    }
};

//valider input nom
form.lastName.addEventListener('change', function(){
    valideLastName(this);
});
const valideLastName = function(inputLastName){
    let testLastName = nameRegExp.test(inputLastName.value);
    if (testLastName == false) {
        document.getElementById("lastNameErrorMsg").textContent = "Nom non valide. Exemple: Martin, D'Artagnan, Robespierre...";
        return false;
    }
    else {
        document.getElementById("lastNameErrorMsg").textContent = "";
        return true;
    }
};

// valider input ville
form.city.addEventListener("change", function(){
    valideCity(this);
});
const valideCity = function(inputVille){
    let testCity = nameRegExp.test(inputVille.value);
    if (testCity == false) {
        document.getElementById("cityErrorMsg").textContent = "Ville non valide.Exemple: Paris, Lyon, Vitry-sur-Seine...";
        return false;
    }
    else {
        document.getElementById("cityErrorMsg").textContent = "";
        return true;
    }
};

//valider input adresse
let adresseRegExp = /^[a-z0-9\éèç]+[a-z0-9\éèç\s\-\'\_\/\,]*[a-zéèç]$/i;
form.address.addEventListener("change", function(){
    valideAdresse(this);
});
const valideAdresse = function(inputAdresse){
    let test = adresseRegExp.test(inputAdresse.value);
    if (test == false) {
        document.getElementById("addressErrorMsg").textContent = "L'adresse non valide.Exemple:29 rue Proudhon...";
        return false;
    }
    else {
        document.getElementById("addressErrorMsg").textContent = "";
        return true;
    }
};

//valider input email
var emailRegExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/;
form.email.addEventListener("change", function(){
    valideEmail(this);
});
const valideEmail = function(inputEmail){
   let testEmail = emailRegExp.exec(inputEmail.value);
    if (testEmail == null || testEmail == false) {
        document.getElementById("emailErrorMsg").textContent = "Email non valide.Exemple: email@exemple.com...";
        return false;
    }
    else {
        document.getElementById("emailErrorMsg").textContent = "";
        return true;
    }
};


const urlOrder = `http://localhost:3000/api/products/order`;

/*Constituer un objet contact (à partir des données du formulaire)*/
window.onload = function (){
    const buttonCommander = document.getElementById("order");
    buttonCommander.onclick = function (event){
        localProducts = JSON.parse(localStorage.getItem("localProducts"));
        if (localProducts == null || localProducts.length == 0){
            event.preventDefault();
            window.alert ("votre panier est vide");
            return;
        }
        else {
            //Créer un nouveau tableau avec les résultats de l'appel d'une fonction fournie sur chaque élément du tableau appelant
            let getId = localProducts.map(product => product.id);
            //Soummettre le formulaire de contact et la liste de commande
            form.addEventListener("submit",function(e){
                e.preventDefault();
                orderConfirm (getId);
            });
        }
    }
}

/*valider et envoyer la fiche de contact et id des products, puis récupère id de la commande dans la réponse de server.ensuite, rediger vers la page de confirmation et supprimer les données enregistrées dans local storage*/
function orderConfirm (getId){
    if (valideFirstName(form.firstName) && valideLastName(form.lastName)  && valideAdresse(form.address) && valideCity(form.city) && valideEmail(form.email)){
        let contact = {
            "firstName":form.firstName.value,
            "lastName":form.lastName.value,
            "address":form.address.value,
            "city":form.city.value,
            "email":form.email.value
        };
        fetch(urlOrder, {
            method: "POST",
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact,
                products : getId
            }),
        }) .then((res) => res.json())
        .then((data) => {
          window.location.href = `confirmation.html?id=${data.orderId}`;
          localStorage.clear();  
        })
        .catch(function (err) {
          window.alert("Échec de la connexion");
        });
    }
}
