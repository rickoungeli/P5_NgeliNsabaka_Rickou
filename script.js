// -----------  ---------------//
const conteneur = document.getElementById('conteneur')
const searchZone = document.getElementById('searchzone')
let page = (document.location.search).substring(7, 6)
let id = ''
let searchTerm = ''
let nbrePanier = 0
let prixTotal = 0
let produit = {}
let produits = []

//Pour toutes les pages
AfficherNombreProduits()


//J'envoie la reqûete (fetch) stockée dans la variable "reqFetch" et j'attend les résultats "response"
//Je reçois une reponse en forme de promesse, je la convetie en objet JSON appelé 'datas'
if (page == '') {
    //Fonction pour rechercher des produits 
    searchZone.addEventListener('input', (e) => {
        searchTerm = e.target.value //Je récupère tout ce qui est tapé dans l'input
        afficherData()
    })
    let datas
    const reqFetch = async () => {
        datas = await fetch("http://localhost:5500/api/teddies")
            .then(response => response.json())
            .catch(err => { alert(err) })
    }
    //Fonction pour afficher tous les produits
    const afficherData = async () => {
        await reqFetch()

        conteneur.innerHTML = (
            datas
                .filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase()
                ))
                .map(data => ( //Traitement de chaque élément (data) de l'objet datas
                    `
                    <a class='card p-2' href='ficheproduit.html?page=2&id=${data._id}'>
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

if (page == 2) {
    id = (document.location.search).substring(11, 39)
    fetch(`http://localhost:5500/api/teddies/${id}`)
        .then(response => response.json()
            .then(teddy => {
                afficheTeddy(teddy)
                ajoutPanier(teddy)
            }))
        .catch(error => alert("Erreur : " + error))

}

if (page == '3') {
    if (localStorage.getItem('nbrePanier')) {
        affichePanier()
        afficheFormulaireClient()
    }
    else {
        conteneur.innerHTML = `
                VOTRE PANIER EST VIDE
            `

    }
    commander()
}

if (page == '4') {
    let remerciement = document.querySelector('#remerciement')
    let infosClient = document.getElementById('infos-client')
    let infosCommande = document.getElementById('infos-commande')
    let client = JSON.parse(localStorage.getItem('infosClient'))
    produits = JSON.parse(localStorage.getItem('panier'))

    remerciement.innerHTML = `
                BONJOUR MR / MME ${client.firstname} 
                
            `
    infosClient.innerHTML = `
        <h2>VOUS ETES </h2>
        <table>
            <thead>
                <td>Prénom</td>
                <td>Nom</td>
                <td>Addresse</td>
                <td>Ville</td>
                <td>Email</td>
            </thead>
            <tr>
                <td>${client.firstname}</td>
                <td>${client.firstname}</td>
                <td>${client.firstname}</td>
                <td>${client.firstname}</td>
                <td>${client.firstname}</td>
            </tr>
        </table>
    `
}


//Fonction pour afficher la fiche d'un produit depuis la liste des produits (page 1)
function afficheTeddy(teddy) {
    conteneur.innerHTML =
        `
        <div class='Card p-2'>
            <div class='photo'>
                <img src=${teddy.imageUrl}>
            </div>
            <div class='descry'>
                <p class='nom'>${teddy.name}</p>
                <p class='description'>${teddy.description}</p>
                <div class='prix'>
                    <p>${separerLesMilliers(teddy.price)} €</p>
                </div>
            </div>
            
        </div>

    `
}

//Fonction pour ajouter des produits au panier depuis la fiche produit (page 2)
function ajoutPanier(teddy) {
    let btnAjoutPanier = document.getElementById('btnAjoutPanier')
    btnAjoutPanier.addEventListener('click', (e) => {
        if (localStorage.getItem('panier')) {
            produits = JSON.parse(localStorage.getItem('panier'))
            let produitIsFound = false
            nbrePanier = localStorage.getItem('nbrePanier')
            for (i=0; i < produits.length; i++) {
                if (produits[i]._id === teddy._id) {
                    produits[i].quantite+=1
                    
                    produitIsFound = true
                    break
                }
            }
            if (!produitIsFound) {
                teddy.quantite = 1
                produits.push(teddy)
            }
        }
        else {
            teddy.quantite = 1
            produits.push(teddy)
        }
        console.log(produits)
        
        nbrePanier++
        localStorage.setItem('nbrePanier', nbrePanier)
        localStorage.setItem('panier', JSON.stringify(produits))
        AfficherNombreProduits()
        
    })
}

//Fonction pour afficher le panier et le prix total
function affichePanier() {
    produits = JSON.parse(localStorage.getItem('panier'))
    for (let i = 0; i < produits.length; i++) {
        let prix = produits[i].price * produits[i].quantite
        let card = document.createElement("div")
        card.classList.add('card')
        card.classList.add('p-2')
        conteneur.appendChild(card)
        card.innerHTML = `
            <div class='col-xs-4 photo'>
                <img src=${produits[i].imageUrl}>
            </div>
            <div class='col-xs-8 descry'>
                <p class='nom'>${produits[i].name}</p>
                <p class='description'>${produits[i].description}</p>
                <div class='prix'>
                    <p>${separerLesMilliers(prix)} €</p>
                    <p>Quantité : <button class='btn btn-success btn-decrement' id='decrement'>-</button>${produits[i].quantite}<button class='btn btn-success btn-decrement' id='increment'>+</button></p>
                </div>
            </div>
        `
        prixTotal += prix
    }
    let total = document.getElementById('total')
    total.innerHTML = "Total : " + separerLesMilliers(prixTotal) + " €"
}


//Fonction pour afficher le formulaire client
function afficheFormulaireClient() {
    document.getElementById('infos-client').innerHTML = `
    <div  id="infos-client">
    <form id="form-client" class="form">
        <h2>Informations sur le client</h2>
        <div class="form-group ">
          <label for="prenom" >Prénom :</label>
          <input type="text" id="prenom" name="prenom" class="form-control">
          <i class="fas fa-check-circle"></i>
          <i class="fas fa-exclamation-circle"></i>
          <small>Message</small>
        </div>
        <div class="form-group">
          <label for="nom" >Nom :</label>
          <input type="text"  id="nom" name="nom" class="form-control">
          <i class="fas fa-check-circle"></i>
          <i class="fas fa-exclamation-circle"></i>
          <small >Message</small>
        </div>
        <div class="form-group">
          <label for="adresse" >Adresse :</label>
          <input type="text"  id="adresse" name="adresse" class="form-control">
          <i class="fas fa-check-circle"></i>
          <i class="fas fa-exclamation-circle"></i>
          <small>Message</small>
        </div>
        <div class="form-group">
          <label for="ville" >Ville :</label>
          <input type="text"  id="ville" name="ville" class="form-control">
          <i class="fas fa-check-circle"></i>
          <i class="fas fa-exclamation-circle"></i>
          <small>Message</small>
        </div>
        <div class="form-group">
          <label for="email">Email :</label>
          <input type="mail" id="email" name="email" class="form-control">
          <i class="fas fa-check-circle"></i>
          <i class="fas fa-exclamation-circle"></i>
          <small>Message</small>
        </div>
    </form>
  </div>
  <button class="btn btn-success" id="btn-commander">COMMANDER</button>
        `
    //Remplissage automatique du formulaire
    if (localStorage.getItem('infosClient')) {
        let dataClient = JSON.parse(localStorage.getItem('infosClient'))
        document.querySelector('#prenom').setAttribute('value', dataClient.firstname)
        document.querySelector('#nom').setAttribute('value', dataClient.name)
        document.querySelector('#adresse').setAttribute('value', dataClient.adress)
        document.querySelector('#ville').setAttribute('value', dataClient.city)
        document.querySelector('#email').setAttribute('value', dataClient.email)

    }
}

//Fonction pour envoyer la commande et afficher la page résumé
function commander() {

    const btnValider = document.querySelector('#btn-commander')

    btnValider.addEventListener('click', (e) => {
        let hasError = false

        //Vérification du formulaire
        const prenom = document.getElementById('prenom')
        const nom = document.getElementById('nom')
        const adresse = document.getElementById('adresse')
        const ville = document.getElementById('ville')
        const email = document.getElementById('email')

        const prenomValue = prenom.value.trim()
        const nomValue = nom.value.trim()
        const adresseValue = adresse.value.trim()
        const villeValue = ville.value.trim()
        const emailValue = email.value.trim()

        if (prenomValue === '') {
            setErrorFor(prenom, 'Veuillez taper votre prénom')
            hasError = true
        } else if (prenomValue.length < 2 || prenomValue.length > 30) {
            setErrorFor(prenom, 'Le prénom doit comprendre entre 2 et 30 caractères')
            hasError = true
        } else {
            setSuccessFor(prenom)
        }
        if (nomValue === '') {
            setErrorFor(nom, 'Veuillez taper votre nom')
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
        //Enregistrement du client dans localstorage
        //if (isValid === [true,true,true,true,true]) {
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
    })

}

//Fonction pour séparer les milliers dans le champs prix
function separerLesMilliers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
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