const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const wooapi = new WooCommerceRestApi({
    url: process.env.WOO_API_URL,
    consumerKey: process.env.WOO_API_CK,
    consumerSecret: process.env.WOO_API_CS,
    version: "wc/v3"
});

const helloApi = (req, res) => {
    res.send(`<h1>Funciona el webhook de localhost</h1>`)
}

const getProduct = async (req, res) => {
    const productos = await wooapi.get(`products/276`, {});
    const respuesta = Object.keys(productos.data);
    const sku = productos.data.sku;
    const name = productos.data.name;
    const link = productos.data.permalink;
    const image = productos.data.images[0]['src'];
    const price = productos.data.regular_price;
    const stok = productos.data.stock_quantity
    res.send(`Los Productos son:
                SKU: ${JSON.stringify(sku)}, <br>
                Nombre: ${JSON.stringify(name)},<br>
                Link: ${JSON.stringify(link)},<br>
                price: ${JSON.stringify(price)},<br>
                Stok: ${JSON.stringify(stok)},<br>
                Imagen: ${JSON.stringify(image)}`)
}

const createProduct = async (req, res) => {
    const body = req.body;
    const ref = body.ref;
    const name = body.name;
    const image = body.image;
    const price = body.price;
    const stok = body.stok;
    const descripcion = body.descripcion;

    const product = {
        name: name,
        type: "simple",
        regular_price: price,
        images:  [
            {
                src:image
            }
        ], 
        sku: ref,
        short_description: descripcion,
        manage_stock: true,
        stock_quantity:stok
    };

    try{
        const create = await wooapi.post(`products`, product)
        res.send(`${create.data.name}`)
    }catch (e) {
        console.log("Response Data:", e.response.data);
    }
        
    // ).catch((err)=>{
    //     console.log("Response Data:", err.response.data);
    // })
    // .finally(() => {
    //     // Always executed.
    //   });


    //await res.send(`Se creo el Producto:`)
            // <br> SKU: ${typeof ref},
            // <br> Name: ${typeof name},
            // <br> Image: ${typeof image},
            // <br> Stok: ${typeof stok},
            // <br> Price: ${typeof price},
            // <br> Description: ${typeof descripcion},`)
}

const getProducts = (req, res) => {
    wooapi.get("products", {
        per_page: 20, // 20 products per page
    })
        .then((response) => {
            // Successful request
            const data = response.data[0]['id']
            console.log(data);
            res.send(`Response Status: ${JSON.stringify(data)}`)
        })
        .catch((error) => {
            // Invalid request, for 4xx and 5xx statuses
            console.log("Response Status:", error.response.status);
            console.log("Response Headers:", error.response.headers);
            console.log("Response Data:", error.response.data);
        })
        .finally(() => {
            // Always executed.
        });
}

module.exports = { 
    helloApi,
    getProduct,
    getProducts,
    createProduct
}