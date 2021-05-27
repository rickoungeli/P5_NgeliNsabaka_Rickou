// -----------P A G E   2 ---------------//





//Je récupère l'ID contenu dans l'URL
let id = (document.location.search).substring(4,28)
let page = (document.location.search).substring(34)
alert(page)
let searchTerm = ''


//J'envoie la reqûete et j'interprete les résultats
//fetch (`http://localhost:5500/api/teddies?_id=5be9c8541c9d440000665243`) 
fetch (`http://localhost:5500/api/teddies?_id=${id}`) 
//fetch ("https://geo.api.gouv.fr/communes?codePostal=94190")
.then (response => response.json()
.then(response2 => {
    console.table(response2)


    
    let conteneur = document.getElementById('conteneur')
    for (let i=0; i<response2.length; i++) {
        if(response2[i]._id===id){
        //Je récupère les couleurs dans une variable
            let couleurs = response2[i].colors;   
            
            conteneur.innerHTML = 
            `
                <div class='row Card p-2'>
                    <div class='photo'>
                        <img src=${response2[i].imageUrl}>
                    </div>
                    <div class='descry'>
                        <p class='nom'>${response2[i].name}</p>
                        <p class='description'>${response2[i].description}</p>
                    </div>
                    <div class='prix'>
                        <p>${separerLesMilliers(response2[i].price)} €</p>
                    </div>
                </div>

            `   
        }    
    }

}))

.catch(error => alert ("Erreur : " + error))

//Fonction pour séparer les milliers dans le champs prix
function separerLesMilliers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')
}   
