/*
AFFICHER LES PRODUITS SUR LA PAGE D'ACCUEIL ET SES INTERACTIONS
*/

const urlProducts = `http://localhost:3000/api/products`;
init(urlProducts);

/* Récupérer la liste de tous les produits*/
function init(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      displayProducts(value);
    })
    .catch(function (err) {
      window.alert("Échec de la connexion");
    });
}

const container = document.getElementById("items");

//Afficher les produits dans HTML
function displayProducts(products) {
  for (let i = 0; i < products.length; i++) {
    container.innerHTML += `<a href="./html/product.html?id=${products[i]._id}">          
                              <article>
                                  <img src="${products[i].imageUrl}"" alt="${products[i].altTxt}">
                                  <h3 class="productName">${products[i].name}</h3>
                                  <p class="productDescription">${products[i].description}</p>
                              </article>
                            </a>`;
  }
}
