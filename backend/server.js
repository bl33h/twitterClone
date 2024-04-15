const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// enable cors
app.use(cors());

// aura connection
const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

app.get('/', async (req, res) => {
    try {
      const result = await session.run('MATCH (n:Person) RETURN n LIMIT 10');
      const nodes = result.records.map(record => {
        const node = record.get('n');
        const age = node.properties.age ? node.properties.age.low : undefined;
        return {
          // convert identity to a simple number
          id: node.identity.low,  
          labels: node.labels,
          properties: {
            name: node.properties.name,
            age: age  
          }
        };
      });
      console.log("Formatted nodes sent to frontend:", nodes);
      res.send(nodes);
    } catch (error) {
      console.error('Error accessing Neo4j', error);
      res.status(500).send('Error accessing Neo4j');
    }
  });  

  app.get('/feed/:tag', async (req, res) => {
    const tag = req.params.tag;
    try {
      const result = await session.run(
      `
      MATCH (u:User {tag: $tag})
      OPTIONAL MATCH (u)-[:FOLLOWS]->(following:User)
      OPTIONAL MATCH (following)-[rel:TWEETED]->(tweet:Tweet)
      OPTIONAL MATCH (:User)-[likes:LIKED]->(tweet)
      OPTIONAL MATCH (:User)-[rts:RETWEETED]->(tweet)
      OPTIONAL MATCH (:Tweet)-[ans:REPLIES_TO]->(tweet)
      RETURN tweet.id AS id,
      following AS user,
      rel.timestamp AS timestamp,
      rel.has_media AS has_media,
      rel.has_poll AS has_poll,
      tweet.content AS content,
      COUNT(DISTINCT ans) AS replies_amount,
      COUNT(DISTINCT likes) AS likes_amount,
      COUNT(DISTINCT rts) AS retweets_amount
      `
      , { tag: tag });
      const nodes = result.records.map(record => {
        return {
          id: record.get('id').toNumber(),
          user: {
            tag: record.get('user').properties.tag,
            username: record.get('user').properties.username,
            is_profile_public: record.get('user').properties.is_profile_public,
            is_blue: record.get('user').properties.is_blue
          },
          timestamp: record.get('timestamp'),
          has_media: record.get('has_media'),
          has_poll: record.get('has_poll'),
          content: record.get('content'),
          replies_amount: record.get('replies_amount').toNumber(),
          likes_amount: record.get('likes_amount').toNumber(),
          retweets_amount: record.get('retweets_amount').toNumber()
        };
      
      });
      console.log("Formatted nodes sent to frontend:", nodes);
      res.send(nodes);
    } catch (error) {
      console.error('Error accessing Neo4j', error);
      res.status(500).send('Error accessing Neo4j');
    }
  });  
  
  app.get('/profile/:tag', async (req, res) => {
    const tag = req.params.tag;
    try {
      const result = await session.run(
        `
        MATCH (u:User {tag: $tag})
        MATCH (u)-[:LOCATED_IN]->(location:Location)
        OPTIONAL MATCH (u)-[:FOLLOWS]->(following:User)
        OPTIONAL MATCH (follower:User)-[:FOLLOWS]->(u)
        OPTIONAL MATCH (u)-[:TWEETED|RETWEETED]->(tweet:Tweet)
        RETURN
            u.tag AS tag,
            u.username AS username,
            u.description AS description,
            u.birthdate AS birthdate,
            u.joined_on AS joined_on,
            u.is_profile_public AS is_profile_public,
            {
                timestamp: location.timestamp,
                currently_in: location.currently_in,
                lives_there: location.lives_there,
                location_name: location.name
            } AS located_in,
            COUNT(DISTINCT following) AS following_amount,
            COUNT(DISTINCT follower) AS followers_amount,
            COLLECT({
                id: tweet.id,
                timestamp: tweet.timestamp,
                has_media: EXISTS(tweet.media),
                has_poll: EXISTS(tweet.poll),
                content: tweet.content,
                likes_amount: tweet.likes_amount,
                retweets_amount: tweet.retweets_amount,
                replies_amount: tweet.replies_amount
            }) AS tweets
        `,
        { tag: tag }
      );
      const user = result.records.map(record => {
        // Mapear los resultados a un objeto JavaScript
        return {
          tag: record.get('tag'),
          username: record.get('username'),
          description: record.get('description'),
          birthdate: record.get('birthdate'),
          joined_on: record.get('joined_on'),
          is_profile_public: record.get('is_profile_public'),
          is_blue: record.get('is_blue'),
          located_in: record.get('located_in'),
          following_amount: record.get('following_amount').toNumber(),
          followers_amount: record.get('followers_amount').toNumber(),
          tweets: record.get('tweets').map(tweet => {
            return {
              id: tweet.get('id').toNumber(),
              user: { 
                tag: tag,
                username: record.get('username'), 
                is_profile_public: record.get('is_profile_public'),
                is_blue: record.get('is_blue')
              },
              timestamp: tweet.get('timestamp'),
              has_media: tweet.get('has_media'),
              has_poll: tweet.get('has_poll'),
              content: tweet.get('content'),
              likes_amount: tweet.get('likes_amount').toNumber(),
              retweets_amount: tweet.get('retweets_amount').toNumber(),
              replies_amount: tweet.get('replies_amount').toNumber()
            };
          })
        };
      });
  
      res.json(user); // Enviar el objeto JSON como respuesta
    } catch (error) {
      console.error('Error al ejecutar la consulta Cypher:', error);
      res.status(500).send('Error interno del servidor');
    }
  }); 





app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on('exit', () => {
  driver.close();
});