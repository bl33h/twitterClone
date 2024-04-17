const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');
const {v4: uuidv4} = require('uuid');
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
            'MATCH (tweet:tweet {id: $uuid}) RETURN tweet',
            {uuid: uuidUnico}
        );
        if (resultado.records.length === 0) {
            tweetExistente = false;
        } else {
            uuidUnico = uuidv4();
        }
    }

    return uuidUnico;
}

async function generarUUIDUnicoMessage(session) {
    let uuidUnico = uuidv4();
    let tweetExistente = true;

    while (tweetExistente) {
        const resultado = await session.run(
            'MATCH (me:message {id: $uuid}) RETURN me',
            {uuid: uuidUnico}
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
        const result = await session.run('MATCH (n:user {Tag: $tag}) RETURN n', {tag: tag});
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
        const result = await session.run('MATCH (n:user {Tag: $tag})-[rel:PARTICIPATES_IN]->(c:chat) RETURN c.Id as id, c.Name as name, c.Is_dm as dm, rel.MutedMentions as muted', {tag: tag});
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
            , {id: id});
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
      tweet.Money_generated AS money_generated,
      tweet.Impressions AS impressions,
      tweet.Profile_visits AS profile_visits,
      tweet.Engagements AS engagements,
      tweet.New_followers AS new_followers,
      tweet.Detail_expands AS detail_expands,
      COUNT(DISTINCT ans) AS replies_amount,
      COUNT(DISTINCT likes) AS likes_amount,
      COUNT(DISTINCT rts) AS retweets_amount
      `
            , {tag: tag});
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
                retweets_amount: record.get('retweets_amount').low,
                engagements: record.get('engagements').low,
                money_generated: record.get('money_generated'),
                impressions: record.get('impressions').low,
                profile_visits: record.get('profile_visits').low,
                new_followers: record.get('new_followers').low,
                detail_expands: record.get('detail_expands').low
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
            replies_amount: replies_amount,
            engagements: tweet.Engagements,
            money_generated: tweet.Money_generated,
            impressions: tweet.Impressions,
            profile_visits: tweet.Profile_visits,
            new_followers: tweet.New_followers,
            detail_expands: tweet.Detail_expands
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
            {tag: tag}
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
                        replies_amount: tweet[0].replies_amount.low,
                        engagements: tweet[0].engagements.low,
                        money_generated: tweet[0].money_generated,
                        impressions: tweet[0].impressions.low,
                        profile_visits: tweet[0].profile_visits.low,
                        new_followers: tweet[0].new_followers.low,
                        detail_expands: tweet[0].detail_expands.low
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
        {
            tag: data.tag,
            content: data.content,
            hashtags: data.hashtags,
            id: uuidUnico,
            has_media: data.has_media,
            has_poll: data.has_poll,
            mentions: data.mentions,
            timestamp: fecha
        }
    );

    res.status(200).send('Respuesta exitosa');
});

app.post('/modify', async (req, res) => {
    const data = req.body;
    const fecha = moment().utc().format('YYYY-MM-DDTHH:mm:ssZ');
    const result = await session.run(
        `
      MATCH (u:user {Tag: $tag}), (loc:location {Name: $location})
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
        {
            tag: data.tag,
            username: data.username,
            desc: data.description,
            location: data.location,
            timestamp: fecha,
            is_public: data.isPublic
        }
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
        {id: data.id, content: data.content, has_media: data.has_media, has_poll: data.has_poll}
    );

    res.status(200).send('Respuesta exitosa');
});

app.post('/interactions', async (req, res) => {
    const data = req.body;
    const fecha = moment().utc().format('YYYY-MM-DDTHH:mm:ssZ');
    if (data.type === "LIKED") {
        const deleteResult = await session.run(
            `
        MATCH (u:user {Tag: $tag})-[rel:LIKED]->(t:tweet {Id: $id})
        DELETE rel
        `,
            { tag: data.tag, id: data.id }
        );

        // If no relationship was deleted, create the relationship
        if (deleteResult.summary.counters.updates().relationshipsDeleted === 0) {
            const createResult = await session.run(
                `
            MATCH (u:user {Tag: $tag}), (t:tweet {Id: $id})
            MERGE (u)-[rel:LIKED]->(t)
            ON CREATE SET rel.TimeStamp = datetime($timestamp),
                          rel.OS = $os,
                          rel.Device = $device,
                          rel.TweetId = $id,
                          rel.UserTag = $tag
            `,
                { tag: data.tag, id: data.id, timestamp: fecha, os: data.os, device: data.device }
            );
        }
    } else if (data.type === "RETWEETED") {
        const deleteResult = await session.run(
          `
          MATCH (u:user {Tag: $tag})-[rel:RETWEETED]->(t:tweet {Id: $id})
          DELETE rel
          `,
              { tag: data.tag, id: data.id }
          );
          if (deleteResult.summary.counters.updates().relationshipsDeleted === 0) {
            const createResult = await session.run(
                `
                MATCH (u:user {Tag: $tag}), ( t:tweet {Id: $id})
                MERGE (u)-[rel:RETWEETED]->(t)
                ON CREATE SET rel.TimeStamp = datetime($timestamp),
                              rel.Mentions = $mentions,
                              rel.HasMedia = $has_media,
                              rel.HasPoll = $has_poll,
                              rel.Content = $content,
                              rel.TweetId = $id,
                              rel.UserTag = $tag
            `,
                { tag: data.tag, id: data.id, timestamp: fecha, mentions: data.mentions, has_media: data.has_media, has_poll: data.has_poll, content: data.content}
            );
        }
    }  else if (data.type === "REPLIES_TO") {
        const result = await session.run(
            `
        MATCH (u:user {Tag: $tag), ( t:tweet {Id: $id})
        MERGE (u)-[rel:REPLIES_TO]->(t)
        ON CREATE SET rel.TimeStamp = datetime($timestamp)
                      rel.Mentions = $mentions,
                      rel.HasMedia = $has_media,
                      rel.HasPoll = $has_poll,
                      rel.Content = $content,
                      rel.TweetId = $id,
                      rel.UserTag = $tag
        ON MATCH DELETE rel
  
        
        `,
            {tag: data.tag, id: data.id}
        );
    }

    res.status(200).send('Respuesta exitosa');
});

app.post('/deletet', async (req, res) => {
    const data = req.body;
    const result = await session.run(
        'MATCH (t:tweet {Id: $id}) DETACH DELETE t', {id: data.id});

    res.status(200).send('Respuesta exitosa');
});

app.post('/newmessage', async (req, res) => {
    const data = req.body;
    const fecha = moment().utc().format('YYYY-MM-DDTHH:mm:ssZ');
    const id = await generarUUIDUnicoMessage(session);
    const result = await session.run(`
    CREATE (m:message {Content: $content, Id: $id, Reactions: "", Mentions: $mentions})

      
    `, {id: id, content: data.content, mentions: data.mentions,});

    const result1 = await session.run(`
    MATCH (c:chat {Id: $chat}), ( u:user {Tag: $tag}), ( m:message {Id: $id})
    CREATE (u)-[s:SENT {MessageId:$id, TimeStamp: datetime($timestamp), UserTag: $tag, Device: $device, OS: $os}]->(m)
    CREATE (c)<-[r:IS_FROM {Order: 0, Read: false, Edited: false, MessageId: $id, ChatId:$chat}]-(m)

    return s,r
      
    `, {id: id, chat: data.chat, tag: data.tag, timestamp: fecha, os: data.os, device: data.device});
    res.status(200).send('Respuesta exitosa');

});

app.post('/addReaction', async (req, res) => {
    const {messageId, reaction} = req.body;
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
            {messageId, reaction}
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
    }
});

app.post('/follow', async (req, res) => {
    const {followerTag, followeeTag, isMuted, notificationsActive} = req.body;
    const session = driver.session();
    try {
        const fecha = moment().utc().format('YYYY-MM-DDTHH:mm:ssZ');
        if (followerTag === followeeTag) {
            return res.status(400).send('The user is trying to follow themselves.');
        }

        const matchResult = await session.run(
            `
            MATCH (follower:user {Tag: $followerTag}), (followee:user {Tag: $followeeTag})
            RETURN follower, followee
            `,
            {followerTag, followeeTag}
        );


        const mergeResult = await session.run(
            `
            MATCH (follower:user {Tag: $followerTag}), (followee:user {Tag: $followeeTag})
            MERGE (follower)-[r:FOLLOWS]->(followee)
            ON CREATE SET r.FollowerTag = $followerTag, r.FollowedTag = $followeeTag, r.TimeStamp = datetime($timestamp), r.IsMuted = $isMuted, r.NotificationsActive = $notificationsActive
            ON MATCH SET r.TimeStamp = datetime($timestamp), r.IsMuted = $isMuted, r.NotificationsActive = $notificationsActive
            RETURN r
            `,
            {followerTag, followeeTag, isMuted, notificationsActive, timestamp: fecha}
        );

        if (mergeResult.records.length === 0) {
            return res.status(500).send('Error processing the request.');
        }

        res.status(200).send('User followed successfully.');

    } catch (error) {
        console.error('Error in the Aura connection.', error);
        res.status(500).send('Error processing the request.');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

process.on('exit', () => {
    driver.close();
});