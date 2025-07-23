/*
* AFFICHAGE DU PRODUIT SELECTIONNE SUR LA PAGE PRODUCT 
* ENREGISTRER LE PRODUIT CHOISI ET LA QUANTITE DANS LOCAL STORAGE APRES CLIQUER SUR AJOUTER
*/


let url = new URL(window.location.href);
const productId = url.searchParams.get("id");
const itemQuantity = document.getElementById("quantity");
const productOption = document.getElementById("colors");
const urlProduct = `https://kanap-back-pc7z.onrender.com/api/products/${productId}`;
init(urlProduct);

/*Récupérer les données du produit selectionné */
function init(url) {
  fetch(url)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(jsonProduct) {
      displayProduct(jsonProduct);
      const addToCart = document.getElementById("addToCart");
      addToCart.onclick = function(){
        let option = productOption.selectedIndex;
        if (option == 0) {
          window.alert("Veuillez choisir la couleur");
          return;
        }
        let str = itemQuantity.value;
        let orderQuantity = +str;
        if (orderQuantity < 1 || orderQuantity > 100 || orderQuantity % 1 !== 0) {
          window.alert("Veuillez choisir la quantité (entre 1 et 100 unité entier)");
          return;
        }
        let addedProducts = {
          "colors": productOption[option].value,
          "id": productId,
          "quantity": orderQuantity
        };
        saveInLocalStorage(addedProducts);
      };
    })
    .catch(function(err) {
      window.alert("Échec de la connexion");
    });
}

const itemImg = document.querySelector(".item__img");
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");

/*Afficher le produit dans HTML*/
function displayProduct(product) {
    if (productId == product._id) {
    itemImg.innerHTML = `<img src="${product.imageUrl}"" alt="${product.altTxt}">`;
    productName.textContent = product.name;
    productPrice.textContent = product.price;
    productDescription.textContent = product.description;
    for (let i = 0; i < product.colors.length; i++) {
      productOption.innerHTML += `<option value=${product.colors[i]}>${product.colors[i]}</option>`
    }
  }
}

/*Enregistrer le produit dans local storage après cliquer sur le bouton 'ajouter au panier'*/
function saveInLocalStorage(addedProducts) {
  var localProducts = JSON.parse(localStorage.getItem("localProducts"))
  if (localProducts === null) {
    localProducts = [];
    localProducts.push(addedProducts);
    localStorage.setItem("localProducts", JSON.stringify(localProducts));
  }
  else {
    let found = 0;
    //vérifier si le même produit(même id et même couleur) est déjà existe dans local storage, si oui, =>changer la quantité, si non =>ajouter un nouveau produit à la liste
    for (let i = 0; i<localProducts.length; i++){
      if (localProducts[i].id == addedProducts.id && localProducts[i].colors == addedProducts.colors){
        localProducts[i].quantity = addedProducts.quantity + localProducts[i].quantity;
        localStorage.setItem("localProducts", JSON.stringify(localProducts));
        found = 1;
      }
    }
    if (found == 0){
        localProducts.push(addedProducts);
        localStorage.setItem("localProducts", JSON.stringify(localProducts));
    }
  }
  window.alert("Produit est ajouté au panier")
}
