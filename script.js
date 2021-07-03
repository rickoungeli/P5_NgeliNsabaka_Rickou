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
let infosClient = {}

//Pour toutes les pages
AfficherNombreProduits()


//J'envoie la reqûete (fetch) stockée dans la variable "reqFetch" et j'attend les résultats "response"
//Je reçois une reponse en forme de promesse, je la convertie en objet JSON appelé 'datas'
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
                    <a class='card card2 col-sx-12 col-sm-5 m-1' href='ficheproduit.html?page=2&id=${data._id}'>
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
    .then(prod => {
        afficheProduit(prod)
        ajoutPanier(prod)  
    }))
    .catch(error => alert ("Erreur : " + error)) 
    
}

if (page=='3'){
    //Si le panier existe dans le local storage :
    // j'affiche le panier et le formuraire d'identification du client
    if (localStorage.getItem('panier')) {
        affichePanier()
        afficherPrixTotal()
        afficheFormulaireClient()
        
    }
    else {
        //sinon, j'affiche un message => le panier est vide
        conteneur.innerHTML = `
                <h2 class='text-center w-100'>VOTRE PANIER EST VIDE</h2>
            `
    }
    const btnValider = document.querySelector('#btn-commander')
    btnValider.addEventListener('click', commander)
}

if (page==4){
    produits = JSON.parse(localStorage.getItem('panier'))
    infosClient = JSON.parse(localStorage.getItem('infosClient'))
    prixTotal = JSON.parse(localStorage.getItem('prixTotal'))
    let reference = Math.floor(Math.random() * 586324729)
    document.querySelector('#salutation').innerHTML = `Bonjour <span class='font-weight-bold text-danger text-uppercase' > ${infosClient.name}</span>`
    document.querySelector('#email-message').innerHTML = `Un email de confirmation vous a été envoyé à <span class='text-dark' > ${infosClient.email}</span>`
    document.querySelector('#reference-commande').innerHTML = `Référence de votre commande : <span class='text-danger font-weight-bold' > ${reference}</span>`
    document.querySelector('#prix-total').innerHTML = `${prixTotal},00€`
    document.querySelector('#prix-total-TTC').innerHTML = `${prixTotal},00€`
    localStorage.clear()
    document.querySelector(".nombre-panier").innerHTML = 0
}


//--------------------------------LES FONCTIONS -------------------------------------//

//Fonction pour afficher la fiche d'un produit depuis la liste des produits (page 1)
function afficheProduit(prod) {
    const couleurs = prod.colors
    conteneur.innerHTML =
    `
        <div class='card p-2'>
            
            <div class='descry'>
                <div class='photo'>
                    <img src=${prod.imageUrl}>
                </div>
                <p class='nom'>${prod.name}</p>
                <p class='description'>${prod.description}</p>
                <div class='groupe-prix-qte'>
                    <p class='prix'>${separerLesMilliers(prod.price/100)} €</p>
                    <form>
                        <p>Couleur : </p>
                        <select name="color" id="color">
                        </select>
                    </form>
                </div>
            </div>
            
        </div>

    `
    //Chargement de l'option Couleur
    let select = document.querySelector('#color')
    for (i=0; i<couleurs.length; i++) {
        select.options[i] = new Option(couleurs[i],i)
    }
    
}

//Fonction pour ajouter des produits au panier depuis la fiche produit (page 2)
function ajoutPanier(prod) {
    //const btnAjoutPanier = document.querySelector('#btnAjoutPanier')
    btnAjoutPanier.addEventListener('click', (e) => {
        btnAjoutPanier.classList.add('hidden')
        if (localStorage.getItem('panier')) {
            produits = JSON.parse(localStorage.getItem('panier'))
            nbrePanier = localStorage.getItem('nbrePanier')
            let isFound = false
            for (i=0; i<produits.length; i++) {
                if (produits[i]._id === prod._id) {
                    produits[i].quantite += 1
                    isFound = true
                    break
                }
            } 
            if (!isFound){
                prod.quantite=1
                produits.push(prod)
            }
            
        }
        else {
            prod.quantite=1
            produits.push(prod)
        }
        nbrePanier++
        localStorage.setItem('nbrePanier', nbrePanier)
        localStorage.setItem('panier', JSON.stringify(produits))
        AfficherNombreProduits()
        //btnAjoutPanier.className = "d-none"
        document.querySelector('.notification').style.animation = "notification-ajout-panier 1s forwards;"
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
        let total = document.querySelector('#total')
        let divcle = card.querySelector('#cle')
        let divqte = card.querySelector("#qte")
        let divprix = card.querySelector("#prix")
        let divpu = card.querySelector("#prix-unitaire")

        //pour dimininuer la quantité d'un produit
        const decrement = card.querySelector('#decrement')
        decrement.addEventListener('click', (e) => {
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
                    afficherPrixTotal()
                    break
                }
            } 
        })
        //pour augmenter la quantité d'un produit
        const increment = card.querySelector('#increment')
        increment.addEventListener('click', (e) => {
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
                    afficherPrixTotal()
                    break
                }
            } 
        }) 
    }
    
    

}

//Fonction pour afficher et remplir le formulaire client (page panier)s
function afficheFormulaireClient() {    
    const infosClient = document.querySelector('#infos-client')
    infosClient.removeAttribute('class')
    if (localStorage.getItem('infosClient')) {
        let dataClient = JSON.parse(localStorage.getItem('infosClient'))
        document.querySelector('#prenom').setAttribute('value', dataClient.firstname)
        document.querySelector('#nom').setAttribute('value', dataClient.name)
        document.querySelector('#adresse').setAttribute('value', dataClient.adress)
        document.querySelector('#ville').setAttribute('value', dataClient.city)
        document.querySelector('#email').setAttribute('value', dataClient.email)

    } 
}

//Fonction pour enregistrer la commande  et afficher la page résumé
function commander() {
    //On vérifie si le formulaire client est bien renseigné
    let hasError = false
    const prenom = document.querySelector('#prenom')
    const nom = document.querySelector('#nom')
    const adresse = document.querySelector('#adresse')
    const ville = document.querySelector('#ville')
    const email = document.querySelector('#email')

    const prenomValue = prenom.value.trim()
    const nomValue = nom.value.trim()
    const adresseValue = adresse.value.trim()
    const villeValue = ville.value.trim()
    const emailValue = email.value.trim()

    if (prenomValue === '') {
        setErrorFor(prenom, 'Veuillez taper votre prénom')
        hasError = true
    } else if (prenomValue.length < 2) {
        setErrorFor(prenom, 'Le prénom doit avoir au moins 2 caractères')
        hasError = true
    } else if (!isValidFirstName(prenomValue)) {
        setErrorFor(prenom, 'Le prénom ne doit comprendre que des lettres')
        hasError = true
    } else {
        setSuccessFor(prenom)
    }
    if (nomValue === '') {
        setErrorFor(nom, 'Veuillez taper votre nom')
        hasError = true
    } else if (nomValue.length < 2) {
        setErrorFor(nom, 'Le nom doit avoir au moins 2 caractères')
        hasError = true
    } else if (!isValidName(nomValue)) {
        setErrorFor(nom, 'Le nom doit commencer par une lettre')
        hasError = true
    } else {
        setSuccessFor(nom)
    }
    if (adresseValue === '') {
        setErrorFor(adresse, 'Veuillez taper votre adresse')
        hasError = true
    } else {
        setSuccessFor(adresse)
    }
    if (villeValue === '') {
        setErrorFor(ville, 'Veuillez taper la ville')
        hasError = true
    } else {
        setSuccessFor(ville)
    }
    if (emailValue === '') {
        setErrorFor(email, 'Veuillez taper votre e-mail')
        hasError = true
    } else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Veuillez taper un e-mail valide')
        hasError = true
    } else {
        setSuccessFor(email)
    }
    //on enregistre le formulaire client dans localstorage et on affiche la page synthèse
    if (!hasError) {
        let formulaireClient = {}
        formulaireClient = {
            firstname: prenomValue,
            name: nomValue,
            adress: adresseValue,
            city: villeValue,
            email: emailValue
        }
        localStorage.setItem('infosClient', JSON.stringify(formulaireClient))
        window.location = 'synthesecommande.html?page=4'
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



 //Fonction pour afficher le prix total du panier
 function afficherPrixTotal() {
    let divPrixTotal = document.querySelector('#prix-total')
    divPrixTotal.innerHTML = "Total : " + separerLesMilliers(prixTotal) + " €"
    localStorage.setItem('prixTotal', prixTotal)
}

//Les fonctions pour la validation du formulaire client
function setErrorFor(input, message) {
    const formGroup = input.parentElement
    const small = formGroup.querySelector('small')
    small.innerText = message
    formGroup.className = 'form-group error'

}
function setSuccessFor(input) {
    isValid = true
    const formGroup = input.parentElement
    formGroup.className = 'form-group success'
}
function isEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
}
function isValidFirstName(prenom) {
    return /^[a-zA-Z]+[a-zA-Z]/.test(prenom)
}
function isValidName(nom) {
    return /^[a-zA-Z]/.test(nom)
}


