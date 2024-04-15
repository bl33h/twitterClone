import csv
import random
from faker import Faker

faker = Faker()

# user tags from the csv file
def read_user_tags(filename):
    tags = []
    with open(filename, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            tags.append(row['Tag'])
    return tags

# --- FOLLOWING ---
# headers
fields = ['FollowerTag', 'FollowedTag', 'Timestamp', 'IsMuted', 'NotificationsActive']

def generate_following_data(user_tags, num_relationships):
    relationships = []
    for _ in range(num_relationships):
        follower_tag = random.choice(user_tags)
        followed_tag = random.choice(user_tags)
        
        # ensure that a user does not follow themselves
        while followed_tag == follower_tag:
            followed_tag = random.choice(user_tags)
        timestamp = faker.date_time_this_decade().isoformat()
        is_muted = random.choice([True, False])
        notifications_active = not is_muted
        relationships.append([follower_tag, followed_tag, timestamp, is_muted, notifications_active])
    return relationships

# Function to write relationships data to a CSV file
def write_relationships_to_csv(csv_file_name, relationships_data):
    with open(csv_file_name, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(fields)
        writer.writerows(relationships_data)

# The number of relationships to generate
num_relationships = 10000

# write the FOLLOWING data to a CSV file
user_tags = read_user_tags('user.csv')
following_data = generate_following_data(user_tags, num_relationships)
write_relationships_to_csv('following.csv', following_data)

print(f"{num_relationships} 'FOLLOWS' relationships generated and written to following.csv")