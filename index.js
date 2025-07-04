console.log("Entrenamiento 3 index");
async function getProductlist() {
    let products = [];
    try {
        const response = await fetch("http://localhost:3000/Products");
        const data = await response.json();
        products = data;
        console.log("Get", data);
        let productList = document.getElementById("productsContainer");
        let html = "";
        for (let product of products) {
            html += `<article class="productCard">
                <h2 class="productName">${product.name}</h2>
                <p class="productPrice">${product.price}</p>
                <p class="productDescription">${product.description}</p>
                <button class="DeleteButton">Eliminar</button>
            </article>`;
        }
        productList.innerHTML = html;
    } catch(error) {
        console.error(`hubo un error en GET: ${error}`);
    }
}
getProductlist()