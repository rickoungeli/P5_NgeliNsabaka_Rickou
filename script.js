// -----------  ---------------//
const conteneur = document.getElementById('conteneur')
const searchZone = document.getElementById('searchzone')
let page = (document.location.search).substring(7,6)
let id = ''
let searchTerm = ''
let nbrePanier = 0
let prixTotal = 0
let produits = []
let produit = {}

//Pour toutes les pages
AfficherNombreProduits()


//J'envoie la reqûete (fetch) stockée dans la variable "reqFetch" et j'attend les résultats "response"
//Je reçois une reponse en forme de promesse, je la convetie en objet JSON appelé 'datas'
if (page==''){
    //Pour rechercher des produits 
    searchZone.addEventListener('input', (e) => {
    searchTerm = e.target.value //Je récupère tout ce qui est tapé dans l'input
    afficherData()
    })

    //Requete pour recupérer les produits
    let datas
    const reqFetch = async() => {
        datas = await fetch ("http://localhost:5500/api/teddies") 
        .then(response => response.json()) 
        .catch (err => {alert (err)})
    }
    //Fonction pour afficher les produits
    const afficherData = async() => {
        await reqFetch()
        
        conteneur.innerHTML = (
            datas
            .filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase()
                ))
                .map(data => ( //Traitement de chaque élément (data) de l'objet datas
                `
                    <a class='card' href='ficheproduit.html?page=2&id=${data._id}'>
                        <div class='photo'>
                            <img src="${data.imageUrl}">
                        </div>
                        <div class='descry'>
                            <p class='nom'>${data.name}</p>
                            <p class='description'>${data.description}</p>
                            <p class='prix'>${separerLesMilliers(data.price/100)}€</p>
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
    //Si le panier existe dans le local storage :
    // j'affiche le panier et le formuraire d'identification du client
    if (localStorage.getItem('panier')) {
        affichePanier()
        afficheFormulaireClient()
    }
    else {
        //sinon, j'affiche un message => le panier est vide
        conteneur.innerHTML = `
                VOTRE PANIER EST VIDE
            `
    }
    
    enregistrerFormulaire()
}

if (page==4){
    //Affichage de la synthèse commande
    produits = JSON.parse(localStorage.getItem('panier'))
    for (i=0; i<produits.length; i++) {
        let prix = (produits[i].price * produits[i].quantite)/100
        prixTotal += prix
        let card = document.createElement("div")
        card.classList.add('card1')
        card.classList.add('p-2')
        conteneur.appendChild(card)
        card.innerHTML = `
        
            <div class='photo-mini'>
                <img src=${produits[i].imageUrl}>
            </div>
            <div class='decry'>
                <p class='nom'>Nom : ${produits[i].name}</p>
                <p id="quantite">Quantité : ${produits[i].quantite}</p>
                <p id="prix-total">Prix : ${separerLesMilliers(prix)} €</p>
            </div>
        
        `
    }
    /*
    let total = document.getElementById('total')
    total.innerHTML = "Total : " + separerLesMilliers(prixTotal) + " €"
    */

    //Affichage de l'identité du client
    let infosClient = JSON.parse(localStorage.getItem('infosClient'))
    let card = document.createElement("div")
        card.classList.add('card1')
        card.classList.add('p-2')
        document.getElementById('infos-client').appendChild(card)
        card.innerHTML = `
        
            <div class='descry'>
               
                <p class=''>Préom : ${infosClient.firstname}</p>
                <p class=''>Nom : ${infosClient.name}</p>
                <p id="prix-total">Email : ${infosClient.email}</p>
                <p id="quantite">Adresse : ${infosClient.adress}</p>
                <p id="prix-total">Ville : ${infosClient.city}</p>
                
            </div>
        
        `
}

//--------------------------------LES FONCTIONS -------------------------------------//

//Fonction pour afficher la fiche d'un produit depuis la liste des produits (page 1)
function afficheTeddy(teddy) {
    const couleurs = teddy.colors
    console.log (couleurs)
    conteneur.innerHTML =
    `
        <div class='card card2 p-2'>
            
            <div class='descry'>
                <div class='photo'>
                    <img src=${teddy.imageUrl}>
                </div>
                <p class='nom'>${teddy.name}</p>
                <p class='description'>${teddy.description}</p>
                <div class='groupe-prix-qte'>
                    <p>${separerLesMilliers(teddy.price/100)} €</p>
                    <form>
                    <p>Couleur : </p>
                    <select name="color" id="color">
                       
                    </select>
                    </form>
                </div>
            </div>
            
        </div>

    `
    let select = document.querySelector('#color')
    for (i=0; i<couleurs.length; i++) {
        select.options[i] = new Option(couleurs[i],i)
    }
}

//Fonction pour ajouter des produits au panier depuis la fiche produit (page 2)
function ajoutPanier(teddy) {
    let btnAjoutPanier = document.getElementById('btnAjoutPanier')
    btnAjoutPanier.addEventListener('click', (e) => {
        if (localStorage.getItem('panier')) {
            produits = JSON.parse(localStorage.getItem('panier'))
            nbrePanier = localStorage.getItem('nbrePanier')
            let isFound = false
            for (i=0; i<produits.length; i++) {
                if (produits[i]._id === teddy._id) {
                    produits[i].quantite += 1
                    isFound = true
                    break
                }
            } 
            if (!isFound){
                teddy.quantite=1
                produits.push(teddy)
            }
            
        }
        else {
            teddy.quantite=1
            produits.push(teddy)
        }
        nbrePanier++
        localStorage.setItem('nbrePanier', nbrePanier)
        localStorage.setItem('panier', JSON.stringify(produits))
        AfficherNombreProduits()
        window.location = 'index.html'
        
    })
}

//Fonction pour afficher le panier et le prix total et modifier la quantité
function affichePanier() {

    //Affichage du panier
    produits = JSON.parse(localStorage.getItem('panier'))
    for (i=0; i<produits.length; i++) {
        let prix = (produits[i].price * produits[i].quantite)/100
        prixTotal += prix
        let card = document.createElement("div")
        card.classList.add('card')
        card.classList.add('p-2')
        conteneur.appendChild(card)
        card.innerHTML = `
            <div class='col-sm-4 photo'>
                <img src=${produits[i].imageUrl}>
            </div>
            <div class='col-sm-8 descry'>
                <p class='nom'>${produits[i].name}</p>
                <p class='description'>${produits[i].description}</p>
                <p id="cle">${produits[i]._id}</p>
                <p id="prix-unitaire">${produits[i].price/100}</p>
                <div class="groupe-prix-qte">
                    <div class='groupe-prix'>
                        <p class="prix" id="prix">${separerLesMilliers(prix)}</p>
                        <p class="prix">€</p>
                    </div>
                    <div class="groupe-qte">
                        <button class="btn btn-success btn-decrement" id="decrement">-</button>
                        <p id="qte">${produits[i].quantite}</p>
                        <button class="btn btn-success btn-decrement" id="increment">+</button>
                    </div>
                </div>
            </div>
        `
        let total = document.getElementById('total')
        let divcle = card.querySelector('#cle')
        let divqte = card.querySelector("#qte")
        let divprix = card.querySelector("#prix")
        let divpu = card.querySelector("#prix-unitaire")

        //pour dimininuer la quantité d'un produit
        card.querySelector('#decrement').addEventListener('click', (e) => {
            produits = JSON.parse(localStorage.getItem('panier'))
            nbrePanier = localStorage.getItem('nbrePanier')
            for (i=0; i<produits.length; i++) {
                if (divcle.innerHTML === produits[i]._id) {
                    produits[i].quantite -= 1
                    nbrePanier--  
                    prixTotal -= (produits[i].price/100)     
                    localStorage.setItem('nbrePanier', nbrePanier)
                    localStorage.setItem('panier', JSON.stringify(produits))
                    
                    AfficherNombreProduits()
                    prix = card.querySelector("#prix").innerHTML
                    divprix.innerHTML = (produits[i].price * produits[i].quantite)/100
                    divqte.innerHTML = produits[i].quantite
                    total.innerHTML = "Total : " + separerLesMilliers(prixTotal) + " €"
                    break
                }
            } 
        }) 
        //pour augmenter la quantité d'un produit
        card.querySelector('#increment').addEventListener('click', (e) => {
            produits = JSON.parse(localStorage.getItem('panier'))
            nbrePanier = localStorage.getItem('nbrePanier')
            for (i=0; i<produits.length; i++) {
                if (divcle.innerHTML === produits[i]._id) {
                    produits[i].quantite += 1
                    nbrePanier++ 
                    prixTotal += (produits[i].price/100)                   
                    localStorage.setItem('nbrePanier', nbrePanier)
                    localStorage.setItem('panier', JSON.stringify(produits))
                    
                    AfficherNombreProduits()
                    prix = card.querySelector("#prix").innerHTML
                    divprix.innerHTML = (produits[i].price * produits[i].quantite)/100
                    divqte.innerHTML = produits[i].quantite
                    total.innerHTML = "Total : " + separerLesMilliers(prixTotal) + " €"
                    break
                }
            } 
        }) 
    }
    
    //let total = document.getElementById('total')
    //total.innerHTML = "Total : " + separerLesMilliers(prixTotal) + " €"
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

//Fonction poue enregistrer le formulaire client et afficher la page résumé
function enregistrerFormulaire() {
    const btnValider = document.querySelector('#btn-commander')
    btnValider.addEventListener('click', (e) => {
        let formulaireClient = {}
        formulaireClient = {
            firstname: document.querySelector('#prenom').value,
            name: document.querySelector('#nom').value,
            adress: document.querySelector('#adresse').value,
            city: document.querySelector('#ville').value,
            email: document.querySelector('#email').value
        }
        localStorage.setItem('infosClient', JSON.stringify(formulaireClient))
        window.location = 'synthesecommande.html?page=4'
    })
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



