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
location_ids = read_csv_data('location.csv', 'Id')
tweet_content = read_csv_data('tweet.csv', 'Content')
user_tags = read_csv_data('user.csv', 'Tag')
tweet_ids = read_csv_data('tweet.csv', 'Id')

# --- FOLLOWING relationship ---
def generate_following_data(user_tags, num_relationships):
    relationships = []
    for _ in range(num_relationships):
        follower_tag = random.choice(user_tags)
        followed_tag = random.choice(user_tags)
        while followed_tag == follower_tag:
            followed_tag = random.choice(user_tags)
        timestamp = fake.date_time_this_decade().isoformat()
        is_muted = random.choice([True, False])
        notifications_active = not is_muted
        relationships.append([follower_tag, followed_tag, timestamp, is_muted, notifications_active])
    return relationships

# --- LOCATED IN relationship ---
def generate_located_in_data(user_tags, location_ids, num_relationships):
    relationships = []
    for _ in range(num_relationships):
        user_tag = random.choice(user_tags)
        location_id = random.choice(location_ids)
        timestamp = fake.date_time_this_decade().isoformat()
        currently_in = random.choice([True, False])
        lives_there = not currently_in or random.choice([True, False])
        relationships.append([user_tag, location_id, timestamp, currently_in, lives_there])
    return relationships

# --- TWEETED and RETWEETED relationships ---
def generate_tweets_relationships(user_tags, tweet_ids, num_tweets):
    tweeted = []
    retweeted = []

    for _ in range(num_tweets):
        user_tag = random.choice(user_tags)
        tweet_id = random.choice(tweet_ids)

        # --- TWEETED relationship ---
        has_media = str(random.choice([True, False]))
        has_poll = str(random.choice([True, False]))
        timeStamp = fake.date_this_decade().isoformat()
        mentions = ','.join(random.sample(user_tags, min(3, len(user_tags))))
        tweeted.append([user_tag, tweet_id, timeStamp, has_media, has_poll, mentions])

        # --- RETWEETED relationship ---
        if random.choice([True, False]):
            user_tag = random.choice(user_tags)
            tweet_id = random.choice(tweet_ids)
            content = tweet_content[tweet_ids.index(tweet_id)]
            has_media = str(random.choice([True, False]))
            has_poll = str(random.choice([True, False]))
            mentions = ','.join(random.sample(user_tags, min(3, len(user_tags))))
            retweeted.append([user_tag, tweet_id, content, has_media, has_poll, mentions])

    return tweeted, retweeted

# --- LIKED relationship ---
def generate_likes_data(user_tags, tweet_ids, num_likes):
    devices = ['iPhone', 'Android', 'Web', 'iPad', 'Desktop']
    operating_systems = ['iOS', 'Android', 'Windows', 'macOS', 'Linux']
    likes_data = []

    for _ in range(num_likes):
        user_tag = random.choice(user_tags)
        tweet_id = random.choice(tweet_ids)
        timestamp = fake.date_this_decade().isoformat()
        device = random.choice(devices)
        os = random.choice(operating_systems)

        likes_data.append([user_tag, tweet_id, timestamp, device, os])

    return likes_data
   
# relationships count
num_relationships = 12000
num_tweets = 77000
num_likes = 100000

# headers and writing functions call
follows_data = generate_following_data(user_tags, num_relationships)
write_csv_data('following.csv', ['FollowerTag', 'FollowedTag', 'Timestamp', 'IsMuted', 'NotificationsActive'], follows_data)

located_in_data = generate_located_in_data(user_tags, location_ids, num_relationships)
write_csv_data('locatedIn.csv', ['UserTag', 'LocationId', 'Timestamp', 'CurrentlyIn', 'LivesThere'], located_in_data)

tweeted, retweeted = generate_tweets_relationships(user_tags, tweet_ids, num_tweets)
tweeted_header = ['UserTag', 'TweetId', 'TimeStamp', 'HasMedia', 'HasPoll', 'Mentions']
retweeted_header = ['UserTag', 'TweetId', 'Content', 'HasMedia', 'HasPoll', 'Mentions']
write_csv_data('tweeted.csv', tweeted_header, tweeted)
write_csv_data('retweeted.csv', retweeted_header, retweeted)

likes_data = generate_likes_data(user_tags, tweet_ids, num_likes)
likes_header = ['UserTag', 'TweetId', 'Timestamp', 'Device', 'OS']
write_csv_data('liked.csv', likes_header, likes_data)

# success message
print(f"Generated and wrote {num_relationships} 'FOLLOWING' relationships to following.csv")
print(f"Generated and wrote {num_relationships} 'LOCATED IN' relationships to locatedIn.csv")
print(f"Generated 'TWEETED' relationships: {len(tweeted)}")
print(f"Generated 'RETWEETED' relationships: {len(retweeted)}")
print(f"Generated and wrote {num_likes} 'LIKED' relationships to locatedIn.csv")