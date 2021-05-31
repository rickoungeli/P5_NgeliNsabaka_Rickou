// -----------  ---------------//
const conteneur = document.getElementById('conteneur')
const searchZone = document.getElementById('searchzone')
let page = (document.location.search).substring(7,6)
let id = ''
let searchTerm = ''
let nombreDeProduits=0
let produit = []
let produits = []
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
                    <a class='row Card p-2' href='ficheproduit.html?page=2&id=${data._id}'>
                        <div class='col col-xs-12 col-sm-4 photo'>
                            <img src="${data.imageUrl}">
                        </div>
                        <div class='col col-xs-12 col-sm-6 descry'>
                            <p class='nom'>${data.name}</p>
                            <p class='description'>${data.description}</p>
                        </div>
                        <div class='col col-xs-12 col-sm-2 prix'><p>${separerLesMilliers(data.price)} €</p></div>
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
    let btnAjoutPanier = document.getElementById('ajoutPanier')
    
    //J'envoie la reqûete et j'interprete les résultats
    fetch (`http://localhost:5500/api/teddies/${id}`) 
    .then (response => response.json()
    .then(teddy => {
        //Je récupère les couleurs dans une variable 
        afficheTeddy(teddy)
        //produit = JSON.stringify(teddy)   
        //alert(produit)
        ajoutPanier()
    }))
    .catch(error => alert ("Erreur : " + error))   
}

if (page=='3'){

    conteneur.innerHTML = `
    
    
    `
}

//Fonction recherche produits
searchZone.addEventListener('input', (e) => {
    searchTerm = e.target.value //Je récupèrevtout ce qui est tapé dans l'input
    afficherData()
})

//Fonction pour afficher la fiche d'un produit
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
    produit.push (id)
    produit.push (teddy.name)
    produit.push (teddy.price)
    produit.push (teddy.imageUrl)
    produit.push (teddy.color)
    produit.push (teddy.description)
    
    /*
    this.id = id
    this.name = teddy.name
    this.imageUrl = ''
    this.description = teddy.description
    */
}

//Fonction pour séparer les milliers dans le champs prix
function separerLesMilliers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')
}    

//Fonction pour afficher le nombre de produits contenus dans le panier
function AfficherNombreProduits() {
    produits = localStorage.getItem('produits')
    console.log (produits)
    if(produits==null){nombreDeProduits = 0}
    if(produits!==null){nombreDeProduits = produits.length}
    document.querySelector(".nombre-panier").innerHTML = nombreDeProduits
}

//Fonction pour ajouter des produits au panier
function ajoutPanier() {
    btnAjoutPanier.addEventListener('click', (e) => {
        console.log(produit)   
        if(localStorage.getItem('produits')){
            produits = localStorage.getItem('produits')
            produits.splice(0, 0, [produit[0], produit[1], produit[2], produit[3], produit[4], produit[5]])
            localStorage.setItem('produits',JSON.stringify(produits))
        }
        else {
            console.log (produit)
            produits.push (produit)
            localStorage.setItem('produits',JSON.stringify(produits))            
        }
        AfficherNombreProduits()
    })
    
    
}