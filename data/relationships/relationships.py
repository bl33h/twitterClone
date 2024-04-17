from datetime import datetime, timedelta
from faker import Faker
import random
import csv

fake = Faker()

# read the nodes csv files
def read_csv_data(filename, column_name):
    with open(filename, mode='r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        return [row[column_name] for row in csv_reader]

# write the relationships data in the csv files
def write_csv_data(filename, header, data):
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        csv_writer = csv.writer(file)
        csv_writer.writerow(header)
        csv_writer.writerows(data)

# specific columns
user_creation_dates = read_csv_data('user.csv', 'Joined_on_Date')
tweet_content = read_csv_data('tweet.csv', 'Content')
location_ids = read_csv_data('location.csv', 'Id')
messages_id = read_csv_data('message.csv', 'Id')
user_tags = read_csv_data('user.csv', 'Tag')
tweet_ids = read_csv_data('tweet.csv', 'Id')
chat_ids = read_csv_data('chat.csv', 'Id')

# --- FOLLOWING relationship ---
def generate_following_data(user_tags, num_relationships):
    relationships = []
    for _ in range(num_relationships):
        follower_tag = random.choice(user_tags)
        followed_tag = random.choice(user_tags)
        while followed_tag == follower_tag:
            followed_tag = random.choice(user_tags)
        
        timestamp_datetime = fake.date_time_this_decade()
        timestamp_date = timestamp_datetime.strftime('%Y-%m-%d')
        timestamp_hour = timestamp_datetime.strftime('%H:%M')
        
        is_muted = random.choice([True, False])
        notifications_active = not is_muted
        
        relationships.append([follower_tag, followed_tag, timestamp_date, timestamp_hour, is_muted, notifications_active])
    
    return relationships

# --- LOCATED IN relationship ---
def generate_located_in_data(user_tags, location_ids, num_relationships):
    relationships = []
    for _ in range(num_relationships):
        user_tag = random.choice(user_tags)
        location_id = random.choice(location_ids)

        timestamp_datetime = fake.date_time_this_decade()
        timestamp_date = timestamp_datetime.strftime('%Y-%m-%d')
        timestamp_hour = timestamp_datetime.strftime('%H:%M')
        
        currently_in = random.choice([True, False])
        lives_there = not currently_in or random.choice([True, False])
        
        relationships.append([user_tag, location_id, timestamp_date, timestamp_hour, currently_in, lives_there])
    
    return relationships

# --- TWEETED and RETWEETED relationships ---
from faker import Faker
import random

fake = Faker()

def generate_tweets_relationships(user_tags, tweet_ids, num_tweets):
    tweeted = []
    retweeted = []

    local_tweet_ids = tweet_ids[:]
    local_user_tags = user_tags[:]

    for _ in range(min(num_tweets, len(local_tweet_ids))):
        if local_tweet_ids:
            tweet_id = random.choice(local_tweet_ids)
            local_tweet_ids.remove(tweet_id) 
            user_tag = random.choice(local_user_tags)
        
            # --- TWEETED relationship ---
            timeStamp_datetime = fake.date_this_decade()
            timeStamp_date = timeStamp_datetime.strftime('%Y-%m-%d')
            timeStamp_hour = timeStamp_datetime.strftime('%H:%M')
            has_media = str(random.choice([True, False]))
            has_poll = str(random.choice([True, False]))
            mentions = ','.join(random.sample(user_tags, min(3, len(user_tags))))
            tweeted.append([user_tag, tweet_id, timeStamp_date, timeStamp_hour, has_media, has_poll, mentions])

            # --- RETWEETED relationship ---
            if random.choice([True, False]):
                retweet_user_tag = random.choice(local_user_tags)
                retweet_tweet_id = random.choice(local_tweet_ids)
                local_tweet_ids.remove(retweet_tweet_id)  
                retweet_timeStamp_datetime = fake.date_this_decade()
                retweet_timeStamp_date = retweet_timeStamp_datetime.strftime('%Y-%m-%d')
                retweet_timeStamp_hour = retweet_timeStamp_datetime.strftime('%H:%M')
                content = content = tweet_content[tweet_ids.index(tweet_id)]
                has_media = str(random.choice([True, False]))
                has_poll = str(random.choice([True, False]))
                mentions = ','.join(random.sample(user_tags, min(3, len(user_tags))))
                retweeted.append([retweet_user_tag, retweet_tweet_id, retweet_timeStamp_date, retweet_timeStamp_hour, content, has_media, has_poll, mentions])

    return tweeted, retweeted
            

# --- LIKED relationship ---
def generate_likes_data(user_tags, tweet_ids, num_likes):
    devices = ['iPhone', 'Android', 'Web', 'iPad', 'Desktop']
    operating_systems = ['iOS', 'Android', 'Windows', 'macOS', 'Linux']
    likes_data = []

    for _ in range(num_likes):
        user_tag = random.choice(user_tags)
        tweet_id = random.choice(tweet_ids)

        timestamp_datetime = fake.date_this_decade()
        timestamp_date = timestamp_datetime.strftime('%Y-%m-%d')
        timestamp_hour = timestamp_datetime.strftime('%H:%M')

        device = random.choice(devices)
        os = random.choice(operating_systems)

        likes_data.append([user_tag, tweet_id, timestamp_date, timestamp_hour, device, os])

    return likes_data

# --- REPLYING relationship ---
def generate_replies_data(user_tags, tweet_ids, num_replies):
    replies_data = []
    
    for _ in range(num_replies):
        user_tag = random.choice(user_tags)
        tweet_id = random.choice(tweet_ids)
        reply_to_tweet_id = random.choice(tweet_ids)
        
        timestamp = fake.date_this_decade()
        

        timestamp_date = timestamp.strftime('%Y-%m-%d')
        timestamp_hour = timestamp.strftime('%H:%M')
        
        replies_data.append([user_tag, tweet_id, reply_to_tweet_id, timestamp_date, timestamp_hour])
    return replies_data

# --- SENT MESSAGE relationship ---
def generate_sent_messages(user_tags, messages_id, num_messages):
    devices = ['iPhone', 'Android', 'Web', 'iPad', 'Desktop']
    operating_systems = ['iOS', 'Android', 'Windows', 'macOS', 'Linux']
    sent_messages_data = []

    for _ in range(num_messages):
        user_tag = random.choice(user_tags)
        message_id = random.choice(messages_id) 

        timestamp_datetime = fake.date_this_decade()
        timestamp_date = timestamp_datetime.strftime('%Y-%m-%d')
        timestamp_hour = timestamp_datetime.strftime('%H:%M')

        device = random.choice(devices)
        os = random.choice(operating_systems)

        sent_messages_data.append([user_tag, message_id, timestamp_date, timestamp_hour, device, os])

    return sent_messages_data

# --- PARTICIPATES IN relationship ---
def generate_participates_in_data(user_tags, chat_ids, num_relationships):
    participates_in_data = []
    for _ in range(num_relationships):
        user_tag = random.choice(user_tags)
        chat_id = random.choice(chat_ids)

        # Generar y formatear fecha y hora
        since_datetime = fake.date_time_this_decade()
        since_date = since_datetime.strftime('%Y-%m-%d')
        since_hour = since_datetime.strftime('%H:%M')

        is_admin = random.choice([True, False])
        muted_mentions = random.choice([True, False])
        
        participates_in_data.append([user_tag, chat_id, since_date, since_hour, is_admin, muted_mentions])

    return participates_in_data

# --- IS FROM relationship ---
def generate_is_from_data(message_id, chat_ids, num_relationships):
    is_from_data = []
    for _ in range(num_relationships):
        message_id = random.choice(messages_id)
        chat_id = random.choice(chat_ids)
        order = random.randint(1, 100)
        read = random.choice([True, False])
        edited = random.choice([True, False])
        is_from_data.append([message_id, chat_id, order, read, edited])
    return is_from_data

# relationships count
num_relationships = 12000
num_messages = 2000
num_tweets = 77000
num_likes = 100000
num_replies = 20000

# Headers and writing functions call

# Following relationship
follows_data = generate_following_data(user_tags, num_relationships)
write_csv_data('following.csv', ['FollowerTag', 'FollowedTag', 'Date', 'Hour', 'IsMuted', 'NotificationsActive'], follows_data)

# Located In relationship
located_in_data = generate_located_in_data(user_tags, location_ids, num_relationships)
write_csv_data('locatedIn.csv', ['UserTag', 'LocationId', 'Date', 'Hour', 'CurrentlyIn', 'LivesThere'], located_in_data)

# Tweeted and Retweeted relationships
tweeted, retweeted = generate_tweets_relationships(user_tags, tweet_ids, num_tweets)
tweeted_header = ['UserTag', 'TweetId', 'Date', 'Hour', 'HasMedia', 'HasPoll', 'Mentions']
retweeted_header = ['UserTag', 'TweetId', 'Date', 'Hour', 'Content', 'HasMedia', 'HasPoll', 'Mentions']
write_csv_data('tweeted.csv', tweeted_header, tweeted)
write_csv_data('retweeted.csv', retweeted_header, retweeted)

# Liked relationship
likes_data = generate_likes_data(user_tags, tweet_ids, num_likes)
likes_header = ['UserTag', 'TweetId', 'Date', 'Hour', 'Device', 'OS']
write_csv_data('liked.csv', likes_header, likes_data)

# Replying relationship
replies_data = generate_replies_data(user_tags, tweet_ids, num_replies)
replies_header = ['UserTag', 'TweetId', 'ReplyToTweetId', 'Date', 'Hour']
write_csv_data('replies.csv', replies_header, replies_data)

# Sent Message relationship
sent_data = generate_sent_messages(user_tags, messages_id, num_messages)
sent_header = ['UserTag', 'MessageId', 'Date', 'Hour', 'Device', 'OS']
write_csv_data('sent.csv', sent_header, sent_data)

# Participates In relationship
participates_in_data = generate_participates_in_data(user_tags, chat_ids, num_relationships)
participates_in_header = ['UserTag', 'ChatId', 'Date', 'Hour', 'IsAdmin', 'MutedMentions']
write_csv_data('participatesIn.csv', participates_in_header, participates_in_data)

# Is From relationship
is_from_data = generate_is_from_data(messages_id, chat_ids, num_relationships)
is_from_header = ['MessageId', 'ChatId', 'Order', 'Read', 'Edited']
write_csv_data('isFrom.csv', is_from_header, is_from_data)

# success message
print(f"Generated and wrote {num_relationships} 'FOLLOWING' relationships to following.csv")
print(f"Generated and wrote {num_relationships} 'LOCATED IN' relationships to locatedIn.csv")
print(f"Generated 'TWEETED' relationships: {len(tweeted)}")
print(f"Generated 'RETWEETED' relationships: {len(retweeted)}")
print(f"Generated and wrote {num_likes} 'LIKED' relationships to liked.csv")
print(f"Generated and wrote {num_replies} 'REPLIES TO' relationships to replies.csv")
print(f"Generated and wrote {num_likes} 'SENT' relationships to sent.csv")
print(f"Generated and wrote {num_relationships} 'PARTICIPATES IN' relationships to participatesIn.csv")
print(f"Generated and wrote {num_relationships} 'IS FROM' relationships to isFrom.csv")