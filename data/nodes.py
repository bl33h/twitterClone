from faker import Faker
import csv

fake = Faker()

# --- CREATE USER ---
def create_user_data(existing_tags):
    tag = fake.unique.user_name()
    
    # unique tag function
    while tag in existing_tags:
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

csv_file_name = 'users.csv'
headers = ["Tag", "Username", "Description", "Birthday", "Joined_on", "Is_profile_public"]
generated_tags = set()

# write the data to the CSV file
with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=headers)
    writer.writeheader()
    for _ in range(5000):
        user_data = create_user_data(generated_tags)
        generated_tags.add(user_data['Tag'])
        writer.writerow(user_data)

print(f"Data generated and written to {csv_file_name}")