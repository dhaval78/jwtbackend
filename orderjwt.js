const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const secretKey = 'yourSecretKey123'; 

app.use(bodyParser.json());

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true"); 
    next();
  });
let products = [
    {
       id: 1,
      category: "Watches",
      description:
        "The look that made Swiss watches the toast of the world. Still unbeatable.",
      imgLink:
        "https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
      name: "Silver",
      price: 1600
    },
    {
       id: 2,
      category: "Watches",
      description: "Dark, black beauty. Sure to look good on the wrist.",
      imgLink:
        "https://images.pexels.com/photos/1697566/pexels-photo-1697566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      name: "Black",
      price: 899
    },
    {
       id: 3,
      category: "Watches",
      description:
        "Multi chronographs, stop watch, timers. Altimeter. What else.",
      imgLink:
        "https://images.pexels.com/photos/1010513/pexels-photo-1010513.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      name: "Chronograph",
      price: 1199
    },
    {
       id: 4,
      category: "Watches",
      description: "For all ages. For all times. Classic Look. Classic leather.",
      imgLink:
        "https://images.pexels.com/photos/236915/pexels-photo-236915.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      name: "Classic",
      price: 1250
    },
    {
       id: 5,
      category: "Watches",
      description: "The original Apple Watch. Still a great buy.",
      imgLink:
        "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      name: "Apple v1",
      price: 999
    },
    {
       id: 6,
      category: "Watches",
      description: "Mechanical 28 jewelled watch. Connoisseur delight.",
      imgLink:
        "https://images.pexels.com/photos/47339/mechanics-movement-feinmechanik-wrist-watch-47339.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      name: "Jewelled",
      price: 1999
    },
    {
       id: 7,
      category: "Sunglasses",
      description: "Desirable, reddish tint. Sure to attract attention.",
      imgLink:
        "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      name: "Tinted Red",
      price: 399
    },
    {
       id: 8,
      category: "Sunglasses",
      description: "Nostalgic, bluish tint, sure to get memories back. Vintage.",
      imgLink:
        "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      name: "Oldies",
      price: 199
    },
    {
       id: 9,
      category: "Sunglasses",
      description: "Trendy, young sunglasses with retro look. Teen favourite.",
      imgLink:
        "https://images.pexels.com/photos/1362558/pexels-photo-1362558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      name: "Youthful",
      price: 219
    },
    {
       id: 10,
      category: "Sunglasses",
      description: "Chic sunglasses. Classic dark shades, sure to generate envy.",
      imgLink:
        "https://images.pexels.com/photos/65659/glasses-glass-circle-light-transmittance-65659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      name: "Classic Dark",
      price: 249
    },
    {
       id: 11,
      category: "Watches",
      description: "Apple Watch Version 2. A delight.",
      imgLink:
        "https://images.pexels.com/photos/277406/pexels-photo-277406.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      name: "Apple v2",
      price: 1499
    },
    {
       id: 12,
      category: "Belts",
      description: "Stylish formal brown belt. An office favourite.",
      imgLink:
        "https://as1.ftcdn.net/jpg/02/14/48/72/500_F_214487233_Aahw3DohDu6dSSfMqWCcU1QDatxpDt6E.jpg",
      name: "Fab Brown",
      price: 149
    },
    {
       id: 13,
      category: "Handbags",
      description: "Desirable travel bag. Mix of convenience and style",
      imgLink:
        "https://images.pexels.com/photos/2534961/pexels-photo-2534961.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      name: "Travel Lite",
      price: 199
    },
    {
       id: 14,
      category: "Handbags",
      description: "3 Pockets, 2 Zips -  ideal for shopping and parties",
      imgLink:
        "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      name: "Chic Leather",
      price: 749
    },
    {
       id: 15,
      category: "Belts",
      description: "Signature belt from Gucci ",
      imgLink:
        "https://img.shopstyle-cdn.com/pim/c7/a6/c7a695a8db5a375b222f15bea045bdea_xlarge.jpg",
      name: "Raw Edge",
      price: 799
    },
    {
       id: 16,
      category: "Belts",
      description: "Iconic metallic belt",
      imgLink:
        "https://img.shopstyle-cdn.com/pim/81/78/8178fa6c3b27d3f3e0fe18d019c992ea_xlarge.jpg",
      name: "Goofy Black",
      price: 349
    },
    {
       id: 17,
      category: "Sunglasses",
      description: "Min black faded front shades",
      imgLink:
        "https://images.pexels.com/photos/845247/pexels-photo-845247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Quay Shades",
      price: 479
    },
    {
       id: 18,
      category: "Belts",
      description: "Evergreen formal belt with classic buckle",
      imgLink:
        "https://as1.ftcdn.net/jpg/02/02/45/86/500_F_202458696_CYlcJbJfjgUb2VgQnPSUxHU79v6I3SC6.jpg",
      name: "Classic Brown",
      price: 128
    },
    {
       id: 19,
      category: "Handbags",
      description: "Beach handbag to go along with a beach holiday",
      imgLink:
        "https://images.pexels.com/photos/2305000/pexels-photo-2305000.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      name: "Funky Jute",
      price: 99
    },
    {
       id: 20,
      category: "Floaters",
      description: "Floaters for everyday use",
      imgLink:
        "https://media.istockphoto.com/id/1214179138/photo/sandles-flip-flop-on-the-beach.webp?s=2048x2048&w=is&k=20&c=9JT8CgonDD9uH2uKx1zp8HH76ubqikAhy_UO7TUUfaQ=",
      name: "Light floaters",
      price: 99
    },
    {
       id: 21,
      category: "Floaters",
      description: "Floaters for everyday use",
      imgLink:
        "https://img.freepik.com/free-photo/flip-flop-beach-shoes-yellow-isolated-white-background_1101-2037.jpg?w=500&t=st=1701845420~exp=1701846020~hmac=e2c89818ff79b4229d80b34aa2cb81ff9613f3d988561f8cbdb94bda879fc060",
      name: "Light Chappals",
      price: 99
    },
    {
       id: 22,
      category: "Sandals",
      description: "Comfortable sandals for everyday use and for every season",
      imgLink:
        "https://img.freepik.com/free-photo/brown-flip-flops-summer-footwear-fashion_53876-106037.jpg?w=1380&t=st=1701847484~exp=1701848084~hmac=e768a5ee14a76a336cc7bfa25533dc01f6af5089846bcf3aa9de53605c59b44e",
      name: "Brown Sandals",
      price: 299
    },
    {
       id: 23,
      category: "Sandals",
      description: "Lightweight sandals for everyday use and for every season",
      imgLink:
        "https://img.freepik.com/free-photo/men-leather-sandal-flip-flop-shoes_1203-7699.jpg?w=1380&t=st=1701848537~exp=1701849137~hmac=43a96a52b87eaffe654fa0e39ee271f84dbc92668009be68d92aa38fbe3fb8ae",
      name: "Light Brown Sandals",
      price: 299
    },
    {
       id: 24,
      category: "Formal Shoes",
      description: "Brown Formal shoes for office wear and with good comfort",
      imgLink:
        "https://img.freepik.com/free-photo/brown-shoes-isolated-white-background-studio_268835-1354.jpg?w=1380&t=st=1701848713~exp=1701849313~hmac=f36c64eece126d04b0cebf7598df044a5d1ec912dfac67d3b84d3e327113e7c6",
        name: "Brown Shoes",
      price: 399
    },
    {
       id: 25,
      category: "Formal Shoes",
      description: "Black Formal shoes for office wear and with good comfort",
      imgLink:
        "https://img.freepik.com/free-photo/elegant-black-leather-shoes-men-black-background-photo-studio-style-ai-generative_123827-23442.jpg?w=1380&t=st=1701848827~exp=1701849427~hmac=0015f4112d6cb389796781bddd8ef6c976f50be1764e94618065d0eceed7e2f7",
        name: "Black Shoes",
      price: 399
    },
    {
       id: 26,
      category: "Sport Shoes",
      description: "Blue running shoes for running and with good airflow",
      imgLink:
        "https://img.freepik.com/free-photo/pair-trainers_144627-3800.jpg?w=826&t=st=1701849838~exp=1701850438~hmac=9962666a106bbbccd8a47e7abf89a5b49ae7428b578932b80f74e0f0ff2664c7",
        name: "Blue Sport Shoes",
      price: 399
    },
    {
       id: 27,
      category: "Sport Shoes",
      description: "Green running shoes for running and with good airflow",
      imgLink:
        "https://img.freepik.com/free-photo/clothing-elegance-white-fashion-modern_1203-6524.jpg?w=1380&t=st=1701850207~exp=1701850807~hmac=3cac676ab020cc52f1f755c94cb025398100381b212278937c3dee70e2c02225",
        name: "Green Sport Shoes",
      price: 399
    }
  ];
  


let orders = [];


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
 
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    req.decoded = decoded;
    next();
  });
};


app.get('/products/:category?', (req, res) => {
  const { category } = req.params;
  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  res.json({ products: filteredProducts });
});


app.get('/productsedit/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === Number(id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ product });
});


app.post('/products', (req, res) => {
  const { name, price, category, imgLink, description } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    category,
    imgLink,
    description,
  };

  products.push(newProduct);
  res.status(201).json({ message: 'Product created successfully', product: newProduct });
});


app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, category, imgLink, description } = req.body;
  const index = products.findIndex((product) => product.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = {
    id: parseInt(id),
    name,
    price,
    category,
    imgLink,
    description,
  };

  res.json({ message: 'Product updated successfully', product: products[index] });
});


app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter((product) => product.id !== parseInt(id));
  res.json({ message: 'Product deleted successfully' });
});


app.get('/orders', (req, res) => {
  res.json({ orders });
});


app.post('/orders', verifyToken, (req, res) => {
  const { name, address, city, totalPrice, items, email } = req.body;
  const newOrder = {
    orderId: orders.length + 1,
    name,
    address,
    city,
    totalPrice,
    items,
    email,
  };

  orders.push(newOrder);
  res.status(201).json({ message: 'Order created successfully', order: newOrder });
});


app.post('/login', (req, res) => {
  
  const { username, password } = req.body;

 
  if (username === 'email@test.com' && password === 'test') {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/register', (req, res) => {
 
  const { username, password, email } = req.body;
  res.json({ message: 'User registered successfully', user: { username } });
});

const PORT = process.env.PORT || 2410;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
