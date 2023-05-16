require('dotenv').config()
const Sequelize = require('sequelize')

{ CONNECTION_STRING } = process.env

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOtions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    createFighter: (req, res) => {
        const { name, power, hp, type } = req.body.name
        
        sequelize.query(`
            INSERT INTO
                fighters (name, power, hp, type)
            VALUES
                ('${name}', ${power}, ${hp}, '${type}');    
        `)
        .then((dbResponse) => res.status(200).send(dbResponse[0]))
        .catch((err) => console.log(err))
    },
    getFightersList: (req,res) => {
        sequelize.query(`
            SELECT id, name FROM fighters;    
        `)
        .then((dbResponse) => res.status(200).send(dbResponse[0]))
        .catch((err) => console.log(err))
    },
    createWeapon: (req, res) => {
        const { name, power, owner } = req.body
        sequelize.query(`
            INSERT INTO 
                weapons (name, power, owner) 
            VALUES
                ('${name}', ${power}, '${owner}');      
        `)
        .then((dbResponse) => res.status(200).send(dbResponse[0]))
        .catch((err) => console.log(err))
    },
    getFightersWeapons: (req, res) => {
        sequelize.query(`
            SELECT 
                fighters.id AS fighter_id, 
                fighters.name AS fighter,
                fighters.power AS fighter_power,
                fighters.hp,
                fighters.type,
                weapons.id AS weapon_id,
                weapons.name AS weapon,
                weapons.power AS weapon_power
            FROM fighters
            JOIN weapons
            ON fighters.id = weapons.ower;      
        `)
        .then((dbResponse) => res.status(200).send(dbResponse[0]))
        .catch((err) => console.log(err))
    },
    deleteWeapon: (req, res) => {
        const { id } = req.params

        sequelize.query(`
            DELETE FROM weapons WHERE id = ${id};  
        `)
        .then((dbResponse) => res.status(200).send(dbResponse[0]))
        .catch((err) => console.log(err))
    },
    seed: (req, res) => {
        sequelize.query(`
            DROP TABLE IF EXISTS weapons;
            DROP TABLE IF EXISTS fighters;

            CREATE TABLE fighters(
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                power INT NOT NULL,
                hp INT NOT NULL,
                type VARCHAR NOT NULL
            );

            --create weapons table--
            CREATE TABLE weapons(
                id SERIAL PRIMARY KEY,
                name VARCHAR,
                power INT,
                owner INT REFERENCES fighters(id)
            );
        `)
        .then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        })
        .catch((err) => {
            console.log('you had a Sequelize error in your seed function:')
            console.log(err)
            res.status(500).send(err)
        })
    }
}