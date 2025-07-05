// este script aborda la funcionalidad de buscar un producto por nombre, editar sus detalles y guardar los cambios
document.getElementById('search-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Obtener el valor del input de búsqueda y limpiar espacios
    const searchValue = document.getElementById('input-buscador').value.trim().toLowerCase();
    let productlist = document.getElementById('productsContainer');
    productlist.innerHTML = ""; // Clear before searching

    // Validar que el campo de búsqueda no esté vacío
    if (!searchValue) return;

    try {
        const response = await fetch('http://localhost:3000/Products');
        const products = await response.json();

        // busqueda parcial dependiendo del nombre del producto
        const found = products.find(product => product.name.toLowerCase().includes(searchValue));

        if (found) {
            swal.fire(`Product found: ${found.name} (ID: ${found.id})`);
            // Mostrar los detalles del producto encontrado en inputs para que se pueda modificar despues
            let productDetails = `
                <article class="productCard">
                    <h2 class="productName">Edit product</h2>
                    <label>Name:</label>
                    <input type="text" id="edit-name" value="${found.name}">
                    <label>Price:</label>
                    <input type="number" id="edit-price" value="${found.price}">
                    <label>Description:</label>
                    <textarea id="edit-description">${found.description}</textarea>
                    <button id="save-changes">Save changes</button>
                    <p class="productId"><strong>ID:</strong> ${found.id}</p>
                </article>
            `;
            // Insertar los detalles del producto en el contenedor
            productlist.innerHTML = productDetails;

            // añadir el evento al botón de guardar cambios
            document.getElementById('save-changes').addEventListener('click', async function() {

                // Obtener los valores de los inputs
                const newName = document.getElementById('edit-name').value.trim();
                const newPrice = document.getElementById('edit-price').value.trim();
                const newDescription = document.getElementById('edit-description').value.trim();

                try {
                    // procedemos a actualizar el producto con los nuevos valores
                    const patchResponse = await fetch(`http://localhost:3000/Products/${found.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: newName,
                            price: newPrice,
                            description: newDescription
                        })
                    });
                    if (patchResponse.ok) {
                        swal.fire('Product updated!', 'Changes were saved successfully.', 'success');
                    } else {
                        swal.fire('Error', 'Could not update the product.', 'error');
                    }
                } catch (error) {
                    swal.fire('Error', 'Could not update the product.', 'error');
                }
            });
        } else {
            swal.fire({
                icon: 'info',
                title: 'Product not found',
                text: 'No products matching your search were found.'
            });
            productlist.innerHTML = "";
            // limpiar el contenedor si no se encuentra el producto
        }
    } catch (error) {
        swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Could not fetch the product.'
        });
        productlist.innerHTML = "";
        // limpia si hay error en la búsqueda
    }
});