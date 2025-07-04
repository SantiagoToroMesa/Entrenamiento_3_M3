console.log("Entrenamiento 3 index");
const ProductNameInput = document.getElementById("product-name");
const ProductPriceInput = document.getElementById("product-price");
const ProductDescriptionInput = document.getElementById("product-description");
const AddProductButton = document.getElementById("AddproductButton");
async function addproduct() {
    name = ProductNameInput.value.trim();
    price = ProductPriceInput.value.trim();
    description = ProductDescriptionInput.value.trim();
    if (name === "" || price === "" || description === "") {
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios'
        });
        return;
    }
    let newId = 1;
    try {
        const response = await fetch('http://localhost:3000/Products');
        const product = await response.json();
        if (product.length > 0) {
            newId = Math.max(...product.map(t => Number(t.id))) + 1;
        }
    } catch (e) {
        newId = 1;
    }
    const newProduct = {
        id: String(newId),
        name: String(name),
        price: String(price),
        description: String(description)
    };
    try {
        await fetch('http://localhost:3000/Products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        ProductNameInput.value = '';
        ProductPriceInput.value = '';
        ProductDescriptionInput.value = '';
        getProductlist();
        swal.fire({
            icon: 'success',
            title: '¡Producto agregado!',
            text: 'El producto se ha agregado correctamente'
        });
    } catch (error) {
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo agregar el producto'
        });
    }
}
async function deleteProduct(product_id) {
    console.log("Eliminando producto con ID:", product_id);
    try {
        await fetch(`http://localhost:3000/Products/${product_id}`, {
            method: 'DELETE',
        })
        getProductlist()
    } catch (error) {
        console.error(`Error al eliminar el producto: ${error}`);
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el producto'
        });
    }
}
async function getProductlist() {
    let products = [];
    try {
        const response = await fetch("http://localhost:3000/Products");
        const data = await response.json();
        products = data;
        console.log("Get", data);
        let productList = document.getElementById("productsContainer");
        if (!productList) return;
        let html = "";
        for (let product of products) {
            html += `<article class="productCard">
                <h2 class="productName">${product.name}</h2>
                <p class="productPrice">$${product.price}</p>
                <p class="productDescription">${product.description}</p>
                <button  onclick="deleteProduct(${product.id})">Eliminar</button>
            </article>`;
        }
        productList.innerHTML = html;
    } catch(error) {
        console.error(`hubo un error en GET: ${error}`);
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la lista de productos'
        });
    }
}
getProductlist()
AddProductButton.addEventListener("click", addproduct);

