const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('./models/user'); 

mongoose.connect('mongodb://127.0.0.1:27017/passion_pods')
    .then(() => console.log('MongoDB connected!'))
    .catch((err) => console.error('MongoDB connection failed:', err));

const predefinedHobbies = [
    'cricket', 'football', 'basketball', 'badminton',
    'swimming', 'squash', 'table-tennis', 'golf'
];

const generateRandomUsers = async () => {
    const locations = ["Bangalore", "Pune", "Hyderabad", "Gurgaon", "Chennai", "Mumbai", "Kolkata", "Delhi"];
    const users = Array.from({ length: 100 }, () => {
        const hobbiesSet = new Set();
        const hobbiesCount = faker.number.int({ min: 1, max: 5 });
        while (hobbiesSet.size < hobbiesCount) {
            const hobby = predefinedHobbies[Math.floor(Math.random() * predefinedHobbies.length)];
            hobbiesSet.add(hobby);
        }
        return {
            fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
            location: locations[Math.floor(Math.random() * locations.length)],
            email: faker.internet.email(),
            password: faker.internet.password(),
            salt: faker.string.alphanumeric(10),
            hobbies: Array.from(hobbiesSet), 
        };
    });

    await User.insertMany(users);
    console.log('Random users generated successfully!');
    mongoose.disconnect(); // Close the connection after the operation
};

generateRandomUsers().catch((err) => {
    console.error('Error generating random users:', err);
    mongoose.disconnect();
});
