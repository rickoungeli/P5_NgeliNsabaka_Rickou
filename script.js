// -----------  ---------------//
const conteneur = document.getElementById('conteneur')
const searchZone = document.getElementById('searchzone')
let page = (document.location.search).substring(7,6)
let searchTerm = ''
let nombreDeProduits=0
//Pour toutes les pages
if(localStorage.getItem("nombreDeProduits")==null){
    document.querySelector(".nombre-panier").innerHTML=nombreDeProduits
}
else {
    AfficherNombreProduits()
}

//fetch ("https://rickoungeli.github.io/ngelinsabakarickou_5_18052021/api/teddies")
//J'envoie la reqûete (fetch) stockée dans la variable "reqFetch" et j'attend les résultats "response"
//Je reçois une reponse en forme de promesse, je la convetie en objet JSON appelé 'datas'
if (page==''){
    let datas
    const reqFetch = async() => {
        datas = await fetch ("http://localhost:5500/api/teddies") 
        .then(response => response.json()) 
        .catch (err => {alert (err)})
    }

    //Je crée une fonction "afficherData" qui permet d'afficher les données
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
    afficherData()
}
if (page==2){
    let id = (document.location.search).substring(11,39)
    let btnAjoutPanier = document.getElementById('ajoutPanier')

    //J'envoie la reqûete et j'interprete les résultats
    //fetch ("https://geo.api.gouv.fr/communes?codePostal=94190")
    //fetch (`http://localhost:5500/api/teddies?_id=5be9c8541c9d440000665243`) 
    fetch (`http://localhost:5500/api/teddies/${id}`) 
    .then (response => response.json()
    .then(teddy => {
        console.table(teddy)
    //Je récupère les couleurs dans une variable
        let couleurs =teddy .colors;   
        
        afficheTeddy(teddy)   
            

    }))
    .catch(error => alert ("Erreur : " + error))

     //Ajout des produits au panier
     AjoutPanier()
     
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

//Fonction pour séparer les milliers dans le champs prix
function separerLesMilliers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')
}    

//Fonction pour afficher le nombre de produits 
function AfficherNombreProduits() {
    nombreDeProduits = localStorage.length
    document.querySelector(".nombre-panier").innerHTML = nombreDeProduits
}

//Fonction pour ajouter des produits au panier
function AjoutPanier() {
    
    btnAjoutPanier.addEventListener('click', (e) => {
        localStorage.setItem("price",document.querySelector(".prix").innerText)
        localStorage.setItem("names",document.querySelector(".nom").innerText)
        AfficherNombreProduits()
    })
}