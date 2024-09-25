require('dotenv').config({ path: '.env.local' });
const { faker } = require('@faker-js/faker');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.SUPABASE_DB_USER,
    host: process.env.SUPABASE_DB_HOST,
    database: process.env.SUPABASE_DB_NAME,
    password: process.env.SUPABASE_DB_PASSWORD,
    port: process.env.SUPABASE_DB_PORT,
    ssl: { rejectUnauthorized: false }
});

// Helper function to generate a price tier
function generatePriceTier() {
    return faker.helpers.arrayElement(['$', '$$', '$$$']);
}

// Helper function to generate a menu item
function generateMenuItem(menuType, priceTier) {
    const isAppetizer = menuType === 'dinner' && Math.random() < 0.3;
    let basePrice, maxPrice;

    if (priceTier === '$') {
        basePrice = isAppetizer ? 5 : (menuType === 'lunch' ? 5 : 10);
        maxPrice = isAppetizer ? 8 : (menuType === 'lunch' ? 10 : 15);
    } else if (priceTier === '$$') {
        basePrice = isAppetizer ? 6 : (menuType === 'lunch' ? 6 : 12);
        maxPrice = isAppetizer ? 10 : (menuType === 'lunch' ? 13 : 19);
    } else { // $$$
        basePrice = isAppetizer ? 8 : (menuType === 'lunch' ? 8 : 15);
        maxPrice = isAppetizer ? 12 : (menuType === 'lunch' ? 15 : 23);
    }

    return {
        name: faker.food.dish(),
        price: parseFloat(faker.commerce.price({ min: basePrice, max: maxPrice, dec: 2 })),
        category: isAppetizer ? 'Appetizer' : 'Main Course',
        image_url: `https://picsum.photos/300/200?random=${faker.number.int({ min: 1, max: 1000 })}`, // Unique image for each menu item
    };
}

function capitalizeWords(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function seedDatabase() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Create tables
        await client.query(`
            CREATE TABLE IF NOT EXISTS restaurants (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                street_address VARCHAR(255),
                city VARCHAR(100),
                state VARCHAR(50),
                price_tier VARCHAR(3) NOT NULL,
                image_url TEXT
            );

            CREATE TABLE IF NOT EXISTS menus (
                id SERIAL PRIMARY KEY,
                restaurant_id INTEGER REFERENCES restaurants(id),
                menu_type VARCHAR(20) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS menu_items (
                id SERIAL PRIMARY KEY,
                menu_id INTEGER REFERENCES menus(id),
                name VARCHAR(100) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                category VARCHAR(50),
                image_url TEXT
            );
        `);

        // Generate 10 restaurants with menus
        for (let i = 0; i < 10; i++) {
            const priceTier = generatePriceTier();
            
            // Insert restaurant with a unique image
            const restaurantResult = await client.query(
                'INSERT INTO restaurants (name, street_address, city, state, price_tier, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [
                    capitalizeWords(`The ${faker.word.adjective()} ${faker.animal.type()}`),
                    faker.location.streetAddress(),
                    faker.location.city(),
                    faker.location.state(),
                    priceTier,
                    `https://picsum.photos/600/400?random=${faker.number.int({ min: 1, max: 1000 })}`, // Unique image for each restaurant
                ]
            );
            const restaurantId = restaurantResult.rows[0].id;

            // Create lunch menu
            const lunchMenuResult = await client.query(
                'INSERT INTO menus (restaurant_id, menu_type) VALUES ($1, $2) RETURNING id',
                [restaurantId, 'lunch']
            );
            const lunchMenuId = lunchMenuResult.rows[0].id;

            // Create dinner menu
            const dinnerMenuResult = await client.query(
                'INSERT INTO menus (restaurant_id, menu_type) VALUES ($1, $2) RETURNING id',
                [restaurantId, 'dinner']
            );
            const dinnerMenuId = dinnerMenuResult.rows[0].id;

            // Generate lunch menu items (5-10 items)
            const lunchItemCount = faker.number.int({ min: 5, max: 10 });
            for (let j = 0; j < lunchItemCount; j++) {
                const item = generateMenuItem('lunch', priceTier);
                await client.query(
                    'INSERT INTO menu_items (menu_id, name, price, category, image_url) VALUES ($1, $2, $3, $4, $5)',
                    [lunchMenuId, item.name, item.price, item.category, item.image_url]
                );
            }

            // Generate dinner menu items (15-20 items, including appetizers)
            const dinnerItemCount = faker.number.int({ min: 15, max: 20 });
            for (let j = 0; j < dinnerItemCount; j++) {
                const item = generateMenuItem('dinner', priceTier);
                await client.query(
                    'INSERT INTO menu_items (menu_id, name, price, category, image_url) VALUES ($1, $2, $3, $4, $5)',
                    [dinnerMenuId, item.name, item.price, item.category, item.image_url]
                );
            }
        }

        await client.query('COMMIT');
        console.log('Database seeded successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error seeding database:', err);
    } finally {
        client.release();
    }
}

seedDatabase().then(() => pool.end());