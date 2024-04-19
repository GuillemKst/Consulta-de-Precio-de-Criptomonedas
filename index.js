import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const apiKey = '1'; // Reemplaza 'TU_API_KEY_AQUI' con tu propia API Key
// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Ruta para manejar la solicitud de precio
app.get('/price', async (req, res) => {
    try {
        // Obtener el símbolo de la consulta en la URL
        const symbol = req.query.symbol;

        // Verificar si se proporcionó un símbolo
        if (!symbol) {
            return res.status(400).send('Se requiere un símbolo');
        }

        // Configurar el encabezado con la API Key

        const response = await axios.get(`https://api.blockchain.com/v3/exchange/tickers/${symbol}-USD`, {
            params: {
                apiKey: apiKey,
            }
        });

        // Extraer los datos necesarios del cuerpo de la respuesta
        const lastPrice = response.data.last_trade_price;
        const priceChange24h = response.data.price_24h;

        // Renderizar la plantilla index.ejs con los datos obtenidos
        res.render('price.ejs', { symbol, lastPrice, priceChange24h });
    } catch (error) {
        // Manejar errores
        res.status(500).render('error.ejs');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
