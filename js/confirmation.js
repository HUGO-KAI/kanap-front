/*
AFFICHER ID DE LA COMMANDE SUR LA PAGE CONFIRMATION
*/

/*Afficher Id de la commande sur la page confirmation*/
function showOrderId() {
  try {
    let url = new URL(window.location.href);
    const orderId = url.searchParams.get("id");
    document.getElementById("orderId").textContent = `${orderId}`;
  } catch (e) {
    window.alert("Échec de la connexion");
  }
}
showOrderId();
