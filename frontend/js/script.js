// -----------  ---------------//
const conteneur = document.getElementById('conteneur')


let id = ''

let nbrePanier = 0
let prixTotal = 0
let produits = []
let produit = {}
let infosClient = {}

AfficherNombreProduits()


//Fonction pour séparer les milliers dans le champs prix
function separerLesMilliers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')
}    

//Fonction pour afficher le nombre de produits contenus dans le panier
function AfficherNombreProduits() {
    if (localStorage.getItem('nbrePanier')) {
        nbrePanier = localStorage.getItem('nbrePanier')
        document.querySelector(".nombre-panier").innerHTML = nbrePanier
    }
    else {
        document.querySelector(".nombre-panier").innerHTML = nbrePanier
    }
}

 //Fonction pour afficher le prix total du panier
 function afficherPrixTotal() {
    let divPrixTotal = document.querySelector('#prix-total')
    divPrixTotal.innerHTML = "Total : " + separerLesMilliers(prixTotal) + " €"
    localStorage.setItem('prixTotal', prixTotal)
}

