from neo4j import GraphDatabase
import dotenv
import os

loadStatus = dotenv.load_dotenv("src/back/neo4j.txt")
if loadStatus is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    driver.verify_connectivity()