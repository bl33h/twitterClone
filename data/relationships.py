import csv
import random
from faker import Faker

faker = Faker()

# user tags from the csv file
def read_user_tags(filename):
    tags = []
    with open(filename, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            tags.append(row['Tag'])
    return tags

# location ids from the csv file
def read_location_ids(filename):
    location_ids = []
    with open(filename, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            location_ids.append(row['Id'])
    return location_ids

# --- FOLLOWING RELATIONSHIP ---
def generate_follows_data(user_tags, num_relationships):
    relationships = []
    for _ in range(num_relationships):
        follower_tag = random.choice(user_tags)
        followed_tag = random.choice(user_tags)
        while followed_tag == follower_tag:
            followed_tag = random.choice(user_tags)
        timestamp = faker.date_time_this_decade().isoformat()
        is_muted = random.choice([True, False])
        notifications_active = not is_muted
        relationships.append([follower_tag, followed_tag, timestamp, is_muted, notifications_active])
    return relationships

# --- LOCATED IN RELATIONSHIP ---
def generate_located_in_data(user_tags, location_ids, num_relationships):
    relationships = []
    for _ in range(num_relationships):
        user_tag = random.choice(user_tags)
        location_id = random.choice(location_ids)
        timestamp = faker.date_time_this_decade().isoformat()
        currently_in = random.choice([True, False])
        lives_there = not currently_in or random.choice([True, False])
        relationships.append([user_tag, location_id, timestamp, currently_in, lives_there])
    return relationships

# write relationships data to a CSV file
def write_relationships_to_csv(csv_file_name, relationships_data, headers):
    with open(csv_file_name, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        writer.writerows(relationships_data)

# Number of relationships to generate
num_relationships = 70000

# write FOLLOWING relationships
user_tags = read_user_tags('user.csv')
follows_data = generate_follows_data(user_tags, num_relationships)
write_relationships_to_csv('following.csv', follows_data, ['FollowerTag', 'FollowedTag', 'Timestamp', 'IsMuted', 'NotificationsActive'])

# Generate and write LOCATED IN relationships
location_ids = read_location_ids('location.csv')
located_in_data = generate_located_in_data(user_tags, location_ids, num_relationships)
write_relationships_to_csv('locatedIn.csv', located_in_data, ['UserTag', 'LocationId', 'Timestamp', 'CurrentlyIn', 'LivesThere'])

print(f"Generated and wrote {num_relationships} 'FOLLOWING' relationships to following.csv")
print(f"Generated and wrote {num_relationships} 'LOCATED IN' relationships to locatedIn.csv")