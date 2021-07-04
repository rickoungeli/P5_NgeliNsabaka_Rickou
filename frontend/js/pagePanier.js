affichePanier()

   
    
    

const btnValider = document.querySelector('#btn-commander')
btnValider.addEventListener('click', commander)


//Fonction pour afficher le panier et le prix total et modifier la quantité
function affichePanier() {
    if (localStorage.getItem('panier')) {
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
            

            const decrement = card.querySelector('#decrement')
            decrement.addEventListener('click', ()=> {
                modifierQuantite("-")
            } )
            const increment = card.querySelector('#increment')
            increment.addEventListener('click', ()=> {
                modifierQuantite("+")
            } )

            //Fonction pour modifier la quantité d'un produit
            function modifierQuantite(signe) {
                produits = JSON.parse(localStorage.getItem('panier'))
                nbrePanier = localStorage.getItem('nbrePanier')
                for (i=0; i<produits.length; i++) {
                    if (divcle.innerHTML === produits[i]._id) {
                        if (signe === "+") {
                            produits[i].quantite+=1
                            nbrePanier++
                            prixTotal += (produits[i].price/100) 
                        } 
                        else {
                            produits[i].quantite-=1
                            if (produits[i].quantite<=0) { //si qté = 0
                                if (confirm("Voulez-vous supprimer ce produit")) {
                                    nbrePanier--
                                    prixTotal -= (produits[i].price/100) 
                                    produits = JSON.parse(localStorage.getItem('panier'))
                                    produits.splice(i, 1); // supprime 1 élément à la position i
                                    if (produits.length >= 1) {
                                        localStorage.setItem('panier', JSON.stringify(produits))
                                        localStorage.setItem('nbrePanier', nbrePanier)
                                    }
                                    else {
                                        localStorage.clear()
                                    }
                                    
                                    conteneur.innerHTML =""
                                    console.log(produits);
                                    
                                    //localStorage.removeItem(panier[i]) 
                                    affichePanier()
                                    break
                                }
                                else {
                                    produits[i].quantite=1
                                }
                            }
                            else {
                                nbrePanier--
                                prixTotal -= (produits[i].price/100) 
                            }
                        }
                        
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
            }
        }

        afficherPrixTotal()
        afficheFormulaireClient()
    
    }
    else {
        //sinon, j'affiche un message => le panier est vide
        infosClient.classList.add('d-none')
        conteneur.innerHTML = `
                <h2 class='text-center w-100'>VOTRE PANIER EST VIDE</h2>
            `
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
        window.location = 'synthesecommande.html'
    }
    

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