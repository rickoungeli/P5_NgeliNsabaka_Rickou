// -----------  ---------------//
const conteneur = document.getElementById('conteneur')
const searchZone = document.getElementById('searchzone')
let page = (document.location.search).substring(7,6)
let id = ''
let searchTerm = ''
let nbrePanier = 0
let produit = []
let produits = {}

//Pour toutes les pages
AfficherNombreProduits()


//J'envoie la reqûete (fetch) stockée dans la variable "reqFetch" et j'attend les résultats "response"
//Je reçois une reponse en forme de promesse, je la convetie en objet JSON appelé 'datas'
if (page==''){
    //Fonction pour rechercher des produits 
    searchZone.addEventListener('input', (e) => {
    searchTerm = e.target.value //Je récupère tout ce qui est tapé dans l'input
    afficherData()
})
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
                        <div class='col-sm-4 photo'>
                            <img src="${data.imageUrl}">
                        </div>
                        <div class='col-sm-8 descry'>
                            <p class='nom'>${data.name}</p>
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
    if (localStorage.getItem('nbrePanier')) {
        affichePanier()
        afficheFormulaireClient()
    }
    else {
        conteneur.innerHTML = `
                VOTRE PANIER EST VIDE
            `
        
    }

    //Envoi du formulaire et affichage page résumé
    const btnValider = document.querySelector('#btn-commander')
    btnValider.addEventListener ('click', (e) => {
        let formulaireClient = {}
        formulaireClient = {
            firstname : document.querySelector('#prenom').value,
            name : document.querySelector('#nom').value,
            adress : document.querySelector('#adresse').value,
            city : document.querySelector('#ville').value,
            email : document.querySelector('#email').value
        }
        localStorage.setItem('infosClient', JSON.stringify(formulaireClient))
        window.location = 'synthesecommande.html?page=4'
    })
}

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
        if (localStorage.getItem(teddy._id)) {
            produits = JSON.parse(localStorage.getItem(teddy._id))
            produits.quantite += 1
            nbrePanier = localStorage.getItem('nbrePanier')
        }
        else {
            produits = {teddy, quantite:1}
        }
        nbrePanier++
        localStorage.setItem('nbrePanier', nbrePanier)
        localStorage.setItem(teddy._id, JSON.stringify(produits))
        AfficherNombreProduits()
    })
}

//Fonction pour afficher le panier et le prix total
function affichePanier() {
    let size = localStorage.length
    let prixTotal = 0
    for (let i = 0; i < size; i++) {
        produits = JSON.parse(localStorage.getItem(localStorage.key(i)))
        if (produits.teddy) {
            let prix = produits.teddy.price * produits.quantite
            let card = document.createElement("div")
            card.classList.add('row')
            card.classList.add('card')
            card.classList.add('card1')
            card.classList.add('p-2')
            conteneur.appendChild(card)
            card.innerHTML = `
                <div class='col-sm-4 photo'>
                    <img src=${produits.teddy.imageUrl}>
                </div>
                <div class='col-sm-8 descry'>
                    <p class='nom'>${produits.teddy.name}</p>
                    <p class='description'>${produits.teddy.description}</p>
                    <div class='prix'>
                        <p>${separerLesMilliers(prix)} €</p>
                        <p>Quantité : <button class='btn btn-success btn-decrement' id='decrement'>-</button>${produits.quantite}<button class='btn btn-success btn-decrement' id='increment'>+</button></p>
                    </div>
                </div>
            `
            prixTotal += prix
        }
        let total = document.getElementById('total')
        total.innerHTML = "Total : " + separerLesMilliers(prixTotal) + " €"
    }
}

//Fonction pour afficher le formulaire client
function afficheFormulaireClient() {    
    document.getElementById('infos-client').innerHTML = `
        <div  id="infos-client">
          <form id="form-client" class="form">
              <h2>Informations sur le client</h2>
              <div class="form-group">
                <label for="prenom" >Prénom :</label>
                <input type="text" class="form-control" id="prenom" name="prenom" >
              </div>
              <div class="form-group">
                <label for="nom" >Nom :</label>
                <input type="text" class="form-control" id="nom" name="nom">
              </div>
              <div class="form-group">
                <label for="adresse" >Adresse :</label>
                <input type="text" class="form-control" id="adresse" name="adresse">
              </div>
              <div class="form-group">
                <label for="ville" >Ville :</label>
                <input type="text" class="form-control" id="ville" name="ville">
              </div>
              <div class="form-group">
                <label for="email">Email :</label>
                <input type="email" class=" form-control" id="email" name="email">
              </div>
          </form>
        </div>
        <button class="btn btn-success" id="btn-commander">COMMANDER</button>
        `
        if (localStorage.getItem('infosClient')) {
            let dataClient = JSON.parse(localStorage.getItem('infosClient'))
            document.querySelector('#prenom').setAttribute('value', dataClient.firstname)
            document.querySelector('#nom').setAttribute('value', dataClient.name)
            document.querySelector('#adresse').setAttribute('value', dataClient.adress)
            document.querySelector('#ville').setAttribute('value', dataClient.city)
            document.querySelector('#email').setAttribute('value', dataClient.email)
    
        } 
}

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


