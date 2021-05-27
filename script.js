// -----------P A G E   1 ---------------//
let conteneurProduits = document.getElementById('conteneurProduits')
const searchZone = document.getElementById('searchzone')
let searchTerm = ''
let datas
//fetch ("https://rickoungeli.github.io/ngelinsabakarickou_5_18052021/api/teddies")
//J'envoie la reqûete (fetch) stockée dans la variable "reqFetch" et j'attend les résultats "response"
//Je reçois une reponse en forme de promesse, je la convetie en objet JSON appelé 'datas'

const reqFetch = async() => {
    datas = await fetch ("http://localhost:5500/api/teddies") 
    .then(response => response.json()) 
    .catch (err => {alert (err)})
}

//Je crée une fonction "afficherData" qui permet d'afficher les données
const afficherData = async() => {
    await reqFetch()
    
    conteneurProduits.innerHTML = (

        datas
        .filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase()
            ))
            .map(data => ( //Traitement de chaque élément (data) de l'objet datas
            `
                <a class='row Card p-2' href='ficheproduit.html?id=${data._id}'>
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

//Fonction recherche produits

searchZone.addEventListener('input', (e) => {
    searchTerm = e.target.value //Je récupèrevtout ce qui est tapé dans l'input
    afficherData()
})

//Fonction pour séparer les milliers dans le champs prix
function separerLesMilliers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')
}    