console.log("Entrenamiento 3 index");

// inputs del DOM para agregar productos
const ProductNameInput = document.getElementById("product-name");
const ProductPriceInput = document.getElementById("product-price");
const ProductDescriptionInput = document.getElementById("product-description");
const AddProductButton = document.getElementById("AddproductButton");

async function addproduct() {
    // Validación de campos
    name = ProductNameInput.value.trim();
    price = ProductPriceInput.value.trim();
    description = ProductDescriptionInput.value.trim();
    if (name === "" || price === "" || description === "") {
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'All fields are required.'
        });
        return;
    }
    // generar un nuevo ID para el producto de manera progresiva +1
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
    // definimos el nuevo producto que vamos a agregar con post
    const newProduct = {
        id: String(newId),
        name: String(name),
        price: String(price),
        description: String(description)
    };
    try {
        // hacemos el post del nuevo producto
        await fetch('http://localhost:3000/Products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        // Limpiamos los campos de entrada
        ProductNameInput.value = '';
        ProductPriceInput.value = '';
        ProductDescriptionInput.value = '';
        getProductlist();
        swal.fire({
            icon: 'success',
            title: 'Product added!',
            text: 'The product was added successfully.'
        });
    } catch (error) {
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Could not add the product.'
        });
    }
}
async function deleteProduct(product_id) {
    // pregunta de confirmación antes de eliminar
    const result = await swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });
    // Si se confirma procedemos con el metodo de eliminar
    if (result.isConfirmed) {
        try {
            await fetch(`http://localhost:3000/Products/${product_id}`, {
                method: 'DELETE',
            });
            getProductlist();
        } catch (error) {
            console.error(`Error deleting product: ${error}`);
            swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not delete the product.'
            });
        }
    }
    // Si se cancela no hacemos nada
}
// API key de Pixabay para buscar imágenes :D
const PIXABAY_API_KEY = '51180103-6f817af2a2fb71a1f763737ae'; // <-- Pega aquí tu API key

async function getProductImage(query) {
    try {
        // Usamos la API de Pixabay para buscar una imagen relacionada con el nombre del producto
        const response = await fetch(
            `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`
        );
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
            return data.hits[0].webformatURL;
        }
    } catch (e) {
        console.error('Error buscando imagen en Pixabay:', e);
    }
    // Imagen por defecto del logo de la pagina si no encuentra nada
    return 'images/icon.png';
}
async function getProductlist() {
    // Obtenemos la lista de productos desde el servidor
    let products = [];
    try {
        const response = await fetch("http://localhost:3000/Products");
        const data = await response.json();
        products = data;
        // guardamos la data en products

        console.log("Get", data);
        // definimos el contenedor de productos

        let productList = document.getElementById("productsContainer");
        if (!productList) return;

        // Limpiamos el contenedor antes de agregar nuevos productos
        let html = "";

        for (let product of products) {
            // Obtenemos la imagen del producto usando la función getProductImage
            const imageUrl = await getProductImage(product.name);

            // Creamos el HTML para cada producto
            html += `<article class="productCard">
                <h2 class="productName">${product.name}</h2>
                <img src="${imageUrl}" alt="Imagen de ${product.name}" style="width:100%;height:auto;max-width:300px;max-height:200px;display:block;margin:0 auto;"/>
                <p class="productPrice">$${product.price}</p>
                <p class="productDescription">${product.description}</p>
                <button  onclick="deleteProduct(${product.id})">Delete</button>
            </article>`;
        }
        // Insertamos el HTML generado en el contenedor de productos
        productList.innerHTML = html;
    } catch(error) {
        console.error(`hubo un error en GET: ${error}`);
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Could not fetch the product list.'
        });
    }
}
// Llamamos a la función para obtener la lista de productos al cargar la página
getProductlist()

// Agregamos el evento al botón de agregar producto
AddProductButton.addEventListener("click", addproduct);


