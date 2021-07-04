//Pour rechercher des produits 
let searchTerm = ''
document.querySelector('#searchzone').addEventListener('input', (e) => {
    searchTerm = e.target.value //Je récupère tout ce qui est tapé dans l'input
    afficherData()
})

const afficherData = ()=>{
    fetch ("http://localhost:5500/api/teddies") //Requete pour recupérer les produits
    .then(res => res.json()) 
    .then(datas => {
        conteneur.innerHTML = (
            datas
            .filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase())) 
            //Traitement de chaque élément (data) de l'objet datas
            .map(data => ( 
                `
                    <a class='card card2 col-sx-12 col-sm-5 m-1' href='ficheproduit.html?id=${data._id}'>
                        <div class='photo'>
                            <img src="${data.imageUrl}">
                        </div>
                        <div class='descry'>
                            <p class='nom'>${data.name}</p>
                            <p class='description'>${data.description}</p>
                            <p class='prix'>${separerLesMilliers(data.price/100)}€</p>
                        </div>
                    </a>
                `))
            .join('')
        )
    })
}   
afficherData()