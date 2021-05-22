const conteneurProduits = document.getElementById('conteneurProduits')
const searchZone = document.getElementById('searchzone')
let searchTerm = ''
//fetch ("https://rickoungeli.github.io/ngelinsabakarickou_5_18052021/api/teddies")
let datas
const reqFetch = async() => {
    datas = await fetch ("http://localhost:5500/api/teddies") //J'envoie la reqûete et j'attend les résultats
    .then(response => response.json()) //Lorsque je reçois une reponse (en forme de promesse), je la convetie en objet JSON appelé 'datas'
    .catch (err => {alert (err)})
}

//Affichage des données
const afficherData = async() => {
    await reqFetch()
    
    conteneurProduits.innerHTML = (

        datas
        .filter(data => data.name.toLowerCase().includes(searchTerm.toLowerCase()
            ))
            .map(data => ( //Traitement de chaque élément (data) de l'objet datas
            `
                <a class='Card' href='ficheproduit.html'>
                    <div class='photo'>
                        <img src="${data.imageUrl}">
                    </div>
                    <div class='descry'>
                        <p class='nom'>${data.name}</p>
                        <p class='description'>${data.description}</p>
                        <div class='prix'>
                            <p>${data.price}</p>
                            <p>€</p>
                            <p style='visibility:none'>${data._id}</p>
                        </div>
                    </div>
                </a>
            `
            )).join('')
    )
}
afficherData()
    /*
    for (let i=0; i<data.length; i++) {
        //Je récupère les données contenues dans l'objet datas
        let id = datas[i]._id ;
        let nom = datas[i].name;
        let price = datas[i].price;
        let couleurs = datas[i].colors;   
        let imageUrl = datas[i].imageUrl        
        let description1 = datas[i].description;
        let description
        if (description1.length>50) {
            description = description1.substring(0,80) + '(...)'
           if(document.body.clientWidth<470) {description = (description1.substring(0,50) + '(...)')}
           if((document.body.clientWidth>=470) && (description1.length>=320)) {description = (description1.substring(0,150) + '(...)')}
        } 
        else {description = description1} 

        
        //Dans le card, j'ajoute le code ci-après :
        card.innerHTML = "<div class='photo'><img src='"+imageUrl+"'></div><div class='descry'><p class='nom'>"+nom+"</p><p class='description'>"+description+"</p><div class='prix'><p>"+price+"</p><p>€</p></div></div>"       
    }

}
*/


    
    