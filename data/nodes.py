from faker import Faker
import csv

fake = Faker()

# Unique sets to ensure no duplicates
unique_tags = set()
unique_location_ids = set()

# --- CREATE USER ---
def create_user_data():
    tag = fake.unique.user_name()
    while tag in unique_tags:
        tag = fake.unique.user_name()
    username = fake.user_name()
    description = fake.text(max_nb_chars=30)
    birthday = fake.date_of_birth(minimum_age=18, maximum_age=85).isoformat()
    joined_on = fake.date_this_decade().isoformat()
    is_profile_public = fake.boolean()
    return {
        "Tag": tag,
        "Username": username,
        "Description": description,
        "Birthday": birthday,
        "Joined_on": joined_on,
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

# Write USER data to a CSV file
def write_users_to_csv(csv_file_name, node_count):
    with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["Tag", "Username", "Description", "Birthday", "Joined_on", "Is_profile_public"])
        writer.writeheader()
        for _ in range(node_count):
            user_data = create_user_data()
            unique_tags.add(user_data['Tag'])
            writer.writerow(user_data)

# Write LOCATION data to a CSV file
def write_locations_to_csv(csv_file_name, node_count):
    with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["Id", "Name", "City", "Country"])
        writer.writeheader()
        for _ in range(node_count):
            location_data = create_location_data()
            unique_location_ids.add(location_data['Id'])
            writer.writerow(location_data)

# Define the number of nodes
node_count = 5000

# Generate and write USER data
write_users_to_csv('users.csv', node_count)

# Generate and write LOCATION data
write_locations_to_csv('locations.csv', node_count)

print("User and location data generation complete.")