from faker import Faker
import random
import csv

fake = Faker()

# unique sets to ensure no duplicates
unique_tags = set()
unique_chat_ids = set()
unique_tweet_ids = set()
unique_message_ids = set()
unique_location_ids = set()

# --- CREATE USER ---
def create_user_data():
    tag = fake.unique.user_name()
    
    # Mantener la unicidad del tag
    while tag in unique_tags:
        tag = fake.unique.user_name()
        
    username = fake.user_name()
    description = fake.text(max_nb_chars=30)

    # Obtener y formatear la fecha de nacimiento
    birthday_datetime = fake.date_of_birth(minimum_age=18, maximum_age=85)
    birthday_date = birthday_datetime.strftime('%Y-%m-%d')
    birthday_hour = birthday_datetime.strftime('%H:%M')

    # Obtener y formatear la fecha de ingreso
    joined_on_datetime = fake.date_this_decade()
    joined_on_date = joined_on_datetime.strftime('%Y-%m-%d')
    joined_on_hour = joined_on_datetime.strftime('%H:%M')

    is_profile_public = fake.boolean()
    blue = fake.boolean()

    return {
        "Tag": tag,
        "Username": username,
        "Blue": blue,
        "Description": description,
        "Birthday_Date": birthday_date,
        "Birthday_Hour": birthday_hour,
        "Joined_on_Date": joined_on_date,
        "Joined_on_Hour": joined_on_hour,
        "Is_profile_public": is_profile_public
    }

# --- CREATE LOCATION ---
def create_location_data():
    location_id = fake.unique.pystr(min_chars=0, max_chars=10)
    
    while location_id in unique_location_ids:
        location_id = fake.unique.pystr(min_chars=0, max_chars=10)
        
    name = fake.city()
    city = fake.city()
    country = fake.country()
    return {
        "Id": location_id,
        "Name": name,
        "City": city,
        "Country": country
    }

# --- CREATE TWEET ---
def create_tweet_data():
    tweet_id = fake.unique.pystr(min_chars=0, max_chars=10)
    
    while tweet_id in unique_tweet_ids:
        tweet_id = fake.unique.pystr(min_chars=0, max_chars=10)
        
    content = fake.text(max_nb_chars=280)
    impressions = random.randint(0, 100000)
    engagements = random.randint(0, impressions)
    detail_expands = random.randint(0, engagements)
    new_followers = random.randint(0, 1000)
    profile_visits = random.randint(0, 1000)
    money_generated = round(random.uniform(0, 100), 2)
    hashtags = [fake.word() for _ in range(random.randint(0, 7))]
    return {
        "Id": tweet_id,
        "Content": content,
        "Impressions": impressions,
        "Engagements": engagements,
        "Detail_expands": detail_expands,
        "New_followers": new_followers,
        "Profile_visits": profile_visits,
        "Money_generated": money_generated,
        "Hashtags": ",".join(hashtags)
    }

# --- CREATE CHAT ---
def create_chat_data():
        chat_id = fake.unique.pystr(min_chars=0, max_chars=10)
        
        while chat_id in unique_chat_ids:
            chat_id = fake.unique.pystr(min_chars=0, max_chars=10)
            
        name = fake.company()
        is_dm = fake.boolean()
        return {
            "Id": chat_id,
            "Name": name,
            "Is_dm": is_dm
        }

# --- CREATE MESSAGE ---
def create_message_data(user_tags):
        message_id = fake.unique.pystr(min_chars=0, max_chars=10)
        
        while message_id in unique_message_ids:
            message_id = fake.unique.pystr(min_chars=0, max_chars=10)
            
        content = fake.text(max_nb_chars=280)
        reactions = random.sample(reactions_list, k=random.randint(1, len(reactions_list)))  # Random subset of reactions
        mentions = random.sample(user_tags, k=random.randint(0, min(5, len(user_tags))))  # Random subset of user tags, up to 5
        return {
            "Id": message_id,
            "Content": content,
            "Reactions": ','.join(reactions),
            "Mentions": ','.join(mentions)
        }

# read user tags from users.csv for mentions in messages
def read_user_tags(filename):
    tags = []
    with open(filename, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            tags.append(row['Tag'])
    return tags

# reactions list
reactions_list = ['😀', '😂', '😍', '😢', '😠', '👍', '👎', '❤️', '🔥', '🤔']

# write USER data to a CSV file
def write_users_to_csv(csv_file_name, node_count):
    with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["Tag", "Username", "Blue", "Description", "Birthday_Date", "Birthday_Hour", "Joined_on_Date", "Joined_on_Hour", "Is_profile_public"])
        writer.writeheader()
        for _ in range(node_count):
            user_data = create_user_data()
            unique_tags.add(user_data['Tag'])
            writer.writerow(user_data)

# write LOCATION data to a CSV file
def write_locations_to_csv(csv_file_name, node_count):
    with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["Id", "Name", "City", "Country"])
        writer.writeheader()
        for _ in range(node_count):
            location_data = create_location_data()
            unique_location_ids.add(location_data['Id'])
            writer.writerow(location_data)
            
# write TWEET data to a CSV file
def write_tweets_to_csv(csv_file_name, node_count):
    with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["Id", "Content", "Impressions", "Engagements", "Detail_expands", "New_followers", "Profile_visits", "Money_generated", "Hashtags"])
        writer.writeheader()
        for _ in range(node_count):
            tweet_data = create_tweet_data()
            unique_tweet_ids.add(tweet_data['Id'])
            writer.writerow(tweet_data)

# write CHAT data to a CSV file
def write_chats_to_csv(csv_file_name, node_count):
    with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["Id", "Name", "Is_dm"])
        writer.writeheader()
        for _ in range(node_count):
            chat_data = create_chat_data()
            unique_chat_ids.add(chat_data['Id'])
            writer.writerow(chat_data)

# write MESSAGES data to a CSV file
def write_messages_to_csv(csv_file_name, node_count, user_tags):
    with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["Id", "Content", "Reactions", "Mentions"])
        writer.writeheader()
        for _ in range(node_count):
            message_data = create_message_data(user_tags)
            unique_message_ids.add(message_data['Id'])
            writer.writerow(message_data)

# define the number of nodes
node_count = 5000

write_users_to_csv('user.csv', node_count)
user_tags = read_user_tags('user.csv')

write_locations_to_csv('location.csv', node_count)
write_tweets_to_csv('tweet.csv', node_count)
write_chats_to_csv('chat.csv', node_count)
write_messages_to_csv('message.csv', node_count, user_tags)

print("Nodes data generation complete.")