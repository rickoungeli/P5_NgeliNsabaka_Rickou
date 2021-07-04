id = (document.location.search).substring(4,39)
fetch (`http://localhost:5500/api/teddies/${id}`) 
.then (response => response.json()
.then(prod => {
    afficheProduit(prod)
    ajoutPanier(prod)  
}))
.catch(error => alert ("Erreur : " + error)) 

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
        document.querySelector('.notification').style.animation = "notification-ajout-panier 1s forwards;"
    })
}