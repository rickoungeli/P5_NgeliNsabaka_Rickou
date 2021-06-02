// -----------  ---------------//
const conteneur = document.getElementById('conteneur')
const searchZone = document.getElementById('searchzone')
let page = (document.location.search).substring(7,6)
let id = ''
let searchTerm = ''
let nbrePanier = 0
let produit = []
let produits = [[]]

//Pour toutes les pages
AfficherNombreProduits()


//J'envoie la reqûete (fetch) stockée dans la variable "reqFetch" et j'attend les résultats "response"
//Je reçois une reponse en forme de promesse, je la convetie en objet JSON appelé 'datas'
if (page==''){
    let datas
    const reqFetch = async() => {
        datas = await fetch ("http://localhost:5500/api/teddies") 
        .then(response => response.json()) 
        .catch (err => {alert (err)})
    }
    //Fonction pour afficher tous les produits
    const afficherData = async() => {
        await reqFetch()
        
        conteneur.innerHTML = (
            datas
            .filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase()
                ))
                .map(data => ( //Traitement de chaque élément (data) de l'objet datas
                `
                    <a class='row card p-2' href='ficheproduit.html?page=2&id=${data._id}'>
                        <p class='nom'>${data.name}</p>
                        <div class='col photo'>
                            <img src="${data.imageUrl}">
                        </div>
                        <div class='col descry'>
                            <p class='description'>${data.description}</p>
                            <div class='prix'><p>${separerLesMilliers(data.price)} €</p></div>
                        </div>
                        
                    </a>
                `
                )).join('')
        )
    }
    //J'affiche les données
    afficherData()
}

if (page==2){
    id = (document.location.search).substring(11,39)
    fetch (`http://localhost:5500/api/teddies/${id}`) 
    .then (response => response.json()
    .then(teddy => {
        afficheTeddy(teddy)
        ajoutPanier(teddy)  
    }))
    .catch(error => alert ("Erreur : " + error)) 
     
}

if (page=='3'){
    produits = JSON.parse(localStorage.getItem('produits'))
    produits = produits.sort()
    let quantite = 0
    let prixTotal = 0
    let id1 = ""
    prixTotal = AffichePanier(quantite, prixTotal)
}

//Fonction pour rechercher des produits 
searchZone.addEventListener('input', (e) => {
    searchTerm = e.target.value //Je récupère tout ce qui est tapé dans l'input
    afficherData()
})

//Fonction pour afficher la fiche d'un produit depuis la liste des produits (page 1)
function afficheTeddy(teddy) {
    conteneur.innerHTML =
    `
        <div class='row Card p-2'>
            <div class='photo'>
                <img src=${teddy.imageUrl}>
            </div>
            <div class='descry'>
                <p class='nom'>${teddy.name}</p>
                <p class='description'>${teddy.description}</p>
            </div>
            <div class='prix'>
                <p>${separerLesMilliers(teddy.price)} €</p>
            </div>
        </div>

    `
}

//Fonction pour ajouter des produits au panier depuis la fiche produit (page 2)
function ajoutPanier(teddy) {
    let btnAjoutPanier = document.getElementById('btnAjoutPanier')
    btnAjoutPanier.addEventListener('click', (e) => {
        if (localStorage.getItem('produits')) {
            produits = JSON.parse(localStorage.getItem('produits'))
            produit = [teddy._id, teddy.name, teddy.price, teddy.imageUrl, teddy.description, teddy.colours]
            produits.splice(0, 0, produit)
            console.log(produits)
            localStorage.setItem('produits', JSON.stringify(produits))
        }
        else {
            produits = [[teddy._id, teddy.name, teddy.price, teddy.imageUrl, teddy.description, teddy.colours]]
            localStorage.setItem('produits', JSON.stringify(produits))
        }
        AfficherNombreProduits()
    })
}

//Fonction pour afficher le panier et le prix total
function AffichePanier(quantite, prixTotal) {
    for (produit of produits) {
        let card = document.createElement("div")
        card.classList.add('row')
        card.classList.add('card')
        card.classList.add('card1')
        card.classList.add('p-2')
        conteneur.appendChild(card)
        card.innerHTML = `
            <p class='nom'>${produit[1]}</p>
            <div class='col photo'>
                <img src=${produit[3]}>
            </div>
            <div class='col descry'>
                
                <p class='description'>${produit[4]}</p>
            </div>
            <div class='col prix'>
                <p>${separerLesMilliers(produit[2])} €</p>
                <p>Quantité : <button class='btn btn-success btn-decrement' id='decrement'>-</button>${quantite}<button class='btn btn-success btn-decrement' id='increment'>+</button></p>
            </div>
        `
        prixTotal += produit[2]
    }
    let total = document.getElementById('total')
    total.innerHTML = "Total : " + prixTotal + "€"
    return prixTotal
}

//Fonction pour séparer les milliers dans le champs prix
function separerLesMilliers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')
}    

//Fonction pour afficher le nombre de produits contenus dans le panier
function AfficherNombreProduits() {
    if(localStorage.getItem('produits')){
        nbrePanier = JSON.parse(localStorage.getItem('produits')).length
        document.querySelector(".nombre-panier").innerHTML = nbrePanier
    }
   else {
        document.querySelector(".nombre-panier").innerHTML = nbrePanier
   }
}


