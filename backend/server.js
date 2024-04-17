const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// enable cors
app.use(cors());
app.use(express.json());

// aura connection
const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

async function generarUUIDUnico(session) {
  let uuidUnico = uuidv4();
  let tweetExistente = true;

  while (tweetExistente) {
    const resultado = await session.run(
      'MATCH (tweet:Tweet {id: $uuid}) RETURN tweet',
      { uuid: uuidUnico }
    );
    if (resultado.records.length === 0) {
      tweetExistente = false;
    } else {
      uuidUnico = uuidv4();
    }
  }

  return uuidUnico;
}

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
  
  app.get('/login/:tag', async (req, res) => {
    const tag = req.params.tag;
    try {
      const result = await session.run('MATCH (n:user {Tag: $tag}) RETURN n', { tag: tag });
      const nodes = result.records.map(record => {
        return {
          tag: record.get('n').properties.Tag,
          username: record.get('n').properties.Username
        };
      });
      console.log("Formatted nodes sent to frontend:", nodes);
      res.send(nodes);
    } catch (error) {
      console.error('Error accessing Neo4j', error);
      res.status(500).send('Error accessing Neo4j');
    }
  });

 

  app.get('/chat/:tag', async (req, res) => {
    const tag = req.params.tag;
    try {
      const result = await session.run('MATCH (n:user {Tag: $tag})-[rel:PARTICIPATES_IN]->(c:chat) RETURN c.Id as id, c.Name as name, c.Is_dm as dm, rel.MutedMentions as muted', { tag: tag });
      const nodes = result.records.map(record => {
        return {
          id: record.get('id'),
          name: record.get('name'),
          isdm: record.get('dm'),
          muted: record.get('muted')
        };
      });
      console.log("Formatted nodes sent to frontend:", nodes);
      res.send(nodes);
    } catch (error) {
      console.error('Error accessing Neo4j', error);
      res.status(500).send('Error accessing Neo4j');
    }
  }); 

  app.get('/messages/:chat', async (req, res) => {
    const id = req.params.chat;
    try {
      const result = await session.run(
        `
        MATCH (c:chat {Id: $id})<-[rel:IS_FROM]-(m:message)
        MATCH (u:user)-[s:SENT]->(m)
        RETURN
            m.Id as id,
            m.Content AS content,
            m.Reactions as reactions,
            m.Mentions as mentions,
            s.TimeStamp AS timestamp,
            u.Tag AS tag,
            u.Username AS username,
            rel.Order AS order,
            rel.Read AS read,
            rel.Edited as edited

        `
        , { id: id });
      const nodes = result.records.map(record => {
        return {
          id: record.get('id'),
          content: record.get('content'),
          reactions: record.get('reactions'),
          mentions: record.get('mentions'),
          timestamp: record.get('timestamp').low,
          tag: record.get('tag'),
          username: record.get('username'),
          order: record.get('order'),
          read: record.get('read'),
          edited: record.get('edited')
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
      MATCH (u:user {Tag: $tag})
      OPTIONAL MATCH (u)-[:FOLLOWS]->(following:user)
      OPTIONAL MATCH (following)-[rel:TWEETED]->(tweet:tweet)
      OPTIONAL MATCH (:user)-[likes:LIKED]->(tweet)
      OPTIONAL MATCH (:user)-[rts:RETWEETED]->(tweet)
      OPTIONAL MATCH (:tweet)-[ans:REPLIES_TO]->(tweet)
      RETURN tweet.Id AS id,
      u:Blue as is_blue,
      following AS user,
      rel.TimeStamp AS timestamp,
      rel.HasMedia AS has_media,
      rel.HasPoll AS has_poll,
      tweet.Content AS content,
      COUNT(DISTINCT ans) AS replies_amount,
      COUNT(DISTINCT likes) AS likes_amount,
      COUNT(DISTINCT rts) AS retweets_amount
      `
      , { tag: tag });
      const nodes = result.records.map(record => {
        const user = record.get('user');
        return {
          id: record.get('id'),
          user: {
            tag: user.properties.Tag,
            username: user.properties.Username,
            is_profile_public: user.properties.Is_profile_public,
            is_blue: record.get('is_blue')
          },
          timestamp: record.get('timestamp'),
          has_media: record.get('has_media'),
          has_poll: record.get('has_poll'),
          content: record.get('content'),
          replies_amount: record.get('replies_amount').low,
          likes_amount: record.get('likes_amount').low,
          retweets_amount: record.get('retweets_amount').low
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
        MATCH (u:user {Tag: $tag})
        MATCH (u)-[loc:LOCATED_IN]->(location:location)
        OPTIONAL MATCH (u)-[t:TWEETED]->(tweet:tweet)
        OPTIONAL MATCH (:user)-[like:LIKED]->(tweet)
        OPTIONAL MATCH (:tweet)-[reply:REPLIES_TO]->(tweet)
        OPTIONAL MATCH (:user)-[retweet:RETWEETED]->(tweet)
        OPTIONAL MATCH (u)-[:FOLLOWS]->(following:user)
        OPTIONAL MATCH (follower:user)-[:FOLLOWS]->(u)
        WITH u, loc, tweet, t, location, following, follower, COUNT(DISTINCT like) as likes_amount, COUNT(DISTINCT retweet) as retweets_amount, COUNT(DISTINCT reply) as replies_amount
        WITH u, u:Blue as is_blue, loc, tweet, t, location, following, follower, COLLECT({
            id: tweet.Id,
            timestamp: t.TimeStamp,
            has_media: t.HasMedia,
            has_poll: t.HasPoll,
            content: tweet.Content,
            likes_amount: likes_amount,
            retweets_amount: retweets_amount,
            replies_amount: replies_amount
        }) AS all_tweets
        ORDER BY loc.TimeStamp DESC
        RETURN
            u.Tag AS tag,
            u.Username AS username,
            u.Description AS description,
            u.Birthday AS birthdate,
            u.Joined_on AS joined_on,
            u.Is_profile_public AS is_profile_public,
            is_blue,
            {
                timestamp: loc.TimeStamp,
                currently_in: loc.CurrentlyIn,
                lives_there: loc.LivesThere,
                location_name: location.Name
            } AS located_in,
            COUNT(DISTINCT following) AS following_amount,
            COUNT(DISTINCT follower) AS followers_amount,
            COLLECT(DISTINCT all_tweets) as tweets
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
          located_in: record.get('located_in'),
          following_amount: record.get('following_amount').low,
          followers_amount: record.get('followers_amount').low,
          tweets: record.get('tweets').map(tweet => {
            return {
              id: tweet[0].id,
              user: { 
                tag: tag,
                username: record.get('username'), 
                is_profile_public: record.get('is_profile_public'),
                is_blue: record.get('is_blue')
              },
              timestamp: tweet[0].timestamp,
              has_media: tweet[0].has_media,
              has_poll: tweet[0].has_poll,
              content: tweet[0].content,
              likes_amount: tweet[0].likes_amount.low,
              retweets_amount: tweet[0].retweets_amount.low,
              replies_amount: tweet[0].replies_amount.low
            };
          })
        };
      });
      console.log("Formatted nodes sent to frontend:", user);
      res.send(user);
    } catch (error) {
      console.error('Error accessing Neo4j', error);
      res.status(500).send('Error accessing Neo4j');
    }
  }); 


  app.post('/new', async (req, res) => {
    const data = req.body;
    const uuidUnico = await generarUUIDUnico(session);
    const fecha = moment().utc().format('YYYY-MM-DDTHH:mm:ssZ');
    const result = await session.run(
      `
      MATCH (u:user {Tag: $tag})
      CREATE (t:tweet {Money_generated: 0, Impressions: 0, Profile_visits: 0, Content: $content, Hashtags: $hashtags, Id: $id, Detail_expands:0, Engagements: 0, New_followers: 0})
      CREATE (u)-[:TWEETED {Mentions:$mentions, HasMedia: $has_media, TweetId: $id, HasPoll: $has_poll, UserTag: $tag, TimeStamp: datetime($timestamp)}]->(t)
      `,
      { tag: data.tag, content: data.content, hashtags: data.hashtags, id: uuidUnico, has_media: data.has_media, has_poll: data.has_poll,  mentions: data.mentions, timestamp: fecha }
    );

    res.status(200).send('Respuesta exitosa');
  });

  app.post('/modify', async (req, res) => {
    const data = req.body;
    const fecha = moment().utc().format('YYYY-MM-DDTHH:mm:ssZ');
    const result = await session.run(
      `
      MATCH (u:user {Tag: $tag})
      MATCH (loc:location {Name: $location})
      MERGE (u)-[locin:LOCATED_IN]->(loc)
      ON CREATE
        SET u.Username = $username,
            u.Description = $desc,
            u.Is_profile_public = $is_public,
            locin.CurrentlyIn = true,
            locin.LivesThere = true,
            locin.LocationId = loc.Id,
            locin.UserTag = u.Tag,
            locin.TimeStamp = datetime($timestamp)
      ON MATCH
        SET u.Username = $username,
        u.Description = $desc,
        u.Is_profile_public = $is_public,
        locin.CurrentlyIn = true,
        locin.LocationId = loc.Id,
        locin.UserTag = u.Tag


      
      `,
      { tag: data.tag, username: data.username, desc:data.description, location: data.location, timestamp: fecha, is_public: data.isPublic}
    );

    res.status(200).send('Respuesta exitosa');
  });

  app.post('/modifyt', async (req, res) => {
    const data = req.body;
    const result = await session.run(
      `
      MATCH (t:tweet {Id: $id})
      MATCH (t)<-[rel:TWEETED]-(:user)

      SET t.Content = $content
      SET t.HasMedia = $has_media
      SET t.HasPoll = $has_poll
      `,
      { id: data.id, content: data.content, has_media: data.has_media, has_poll: data.has_poll}
    );

    res.status(200).send('Respuesta exitosa');
  });

  app.post('/interactions', async (req, res) => {
    const data = req.body;
    if (data.type == "LIKED"){
      const result = await session.run(
        `
        MATCH (u:user {Tag: $tag})
        MATCH (t:tweet {Id: $id})
        
  
        
        `,
        { tag: data.tag, id: data.id}
      );
    }
    else if (data.type == "RETWEETED"){
      const result = await session.run(
        `
        MATCH (u:user {Tag: $tag})-[rel:RETWEETED]->(t:tweet {Id: $id})
  
        
        `,
        { tag: data.tag, id: data.id}
      );
    }
    else if (data.type == "REPLIES_TO"){
      const result = await session.run(
        `
        MATCH (u:user {Tag: $tag})-[rel:REPLIES_TO]->(t:tweet {Id: $id})
  
        
        `,
        { tag: data.tag, id: data.id}
      );
    }

    res.status(200).send('Respuesta exitosa');
  });

  app.post('/deletet', async (req, res) => {
    const data = req.body;
    try {
      const result = await session.run('MATCH (t:tweet {Id: $id} DETACH DELETE t)', { id: data.id });
      res.send(nodes);
    } catch (error) {
      res.status(200).send('Respuesta exitosa');
    }
  }); 

  app.post('/newmessage', async (req, res) => {
    const data = req.body;
    const fecha = moment().utc().format('YYYY-MM-DDTHH:mm:ssZ');
    try {
      const result = await session.run(`
      CREATE (m:message {Content: $content, Id: $id, Reactiosn: "", Mentions: $mentions})
      CREATE (u:user {Tag: $tag})-[s:SENT {TimeStamp: datetime($timestamp)}]->(m)

      
      `, { id: data.id, content: data.content, mentions: data.mentions, chat: data.chat, tag: data.tag, timestamp: fecha });
      res.send(nodes);
    } catch (error) {
      res.status(200).send('Respuesta exitosa');
    }
  }); 

  app.post('/addReaction', async (req, res) => {
    const { messageId, reaction } = req.body;
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (m:message {Id: $messageId})
        SET m.Reactions = CASE 
                           WHEN m.Reactions IS NULL OR m.Reactions = '' 
                           THEN $reaction
                           ELSE m.Reactions + ',' + $reaction
                           END
        RETURN m.Id AS messageId, m.Reactions AS updatedReactions
        `,
        { messageId, reaction }
      );  
  
      if (result.records.length === 0) {
        res.status(404).send('Message not found');
      } else {
        const updatedReactions = result.records[0].get('updatedReactions');
        res.status(200).send({
          message: 'Reaction added successfully',
          messageId: result.records[0].get('messageId'),
          reactions: updatedReactions
        });
      }
    } catch (error) {
      console.error('Error in the Aura connection.', error);
      res.status(500).send('Error processing the request');
    } finally {
      await session.close();
    }
  });

  app.post('/follow', async (req, res) => {
    const { followerTag, followeeTag, isMuted, notificationsActive } = req.body;
    const session = driver.session();
    try {

      if (followerTag === followeeTag) {
        return res.status(400).send('The user is trying to follow themselves.');
      }
  
      const result = await session.run(
        `
        MATCH (follower:User {Tag: $followerTag}), (followee:User {Tag: $followeeTag})
        MERGE (follower)-[r:FOLLOWS]->(followee)
        ON CREATE SET r.FollowerTag = $followerTag, r.FollowedTag = $followeeTag, r.TimeStamp = datetime(), r.IsMuted = $isMuted, r.NotificationsActive = $notificationsActive
        ON MATCH SET r.TimeStamp = datetime(), r.IsMuted = $isMuted, r.NotificationsActive = $notificationsActive
        RETURN r
        `,
        { followerTag, followeeTag, isMuted, notificationsActive }
      );
  
      if (result.records.length === 0) {
        res.status(404).send('No users found.');
      } else {
        const relationship = result.records[0].get('r').properties;
        res.status(200).send({
          message: 'Follow relationship created successfully.',
          relationship: relationship
        });
      }
    } catch (error) {
      console.error('Error in the Aura connection.', error);
      res.status(500).send('Error processing the request.');
    } finally {
      await session.close();
    }
  });  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on('exit', () => {
  driver.close();
});