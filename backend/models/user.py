from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['user_database']

class User:
    def __init__(self, first_name, second_name, username, email, phone_number, location, password):
        self.first_name = first_name
        self.second_name = second_name
        self.username = username
        self.email = email
        self.phone_number = phone_number
        self.location = location
        self.password = password

    def save(self):
        user = {
            'first_name': self.first_name,
            'second_name': self.second_name,
            'username': self.username,
            'email': self.email,
            'phone_number': self.phone_number,
            'location': self.location,
            'password': self.password
        }
        return db.users.insert_one(user)

    @staticmethod
    def find_by_email_or_username(email_or_username):
        return db.users.find_one({
            '$or': [
                {'email': email_or_username},
                {'username': email_or_username}
            ]
        })
