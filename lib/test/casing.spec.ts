import flattener from '../../lib'

const mockData = {
  user_id: 12424,
  user_name: 'max',
  user_age: 25,
  user_profile: {
    user_profile_text: 'I Love Zebra',
    user_favorite_animal: { id: 3, animal_name: 'vulture' },
    user_friends: [
      { id: 12324, name: 'julie', favorite_animal: { id: 0, animal_name: 'tiger' } },
      { id: 11424, name: 'michael', favorite_animal: { id: 1, animal_name: 'lion' } },
      { id: 18924, name: 'shawn', favorite_animal: { id: 2, animal_name: 'monkey' } },
    ],
  },
}

describe('FlattenTarget.Casing() method should', () => {
  it('return recursively modified object which all keys of properties are camelCase', (done) => {
    const result = flattener(mockData).casing().returnResult()
    expect(result).toEqual({
      userId: 12424,
      userName: 'max',
      userAge: 25,
      userProfile: {
        userProfileText: 'I Love Zebra',
        userFavoriteAnimal: { id: 3, animalName: 'vulture' },
        userFriends: [
          { id: 12324, name: 'julie', favoriteAnimal: { id: 0, animalName: 'tiger' } },
          { id: 11424, name: 'michael', favoriteAnimal: { id: 1, animalName: 'lion' } },
          { id: 18924, name: 'shawn', favoriteAnimal: { id: 2, animalName: 'monkey' } },
        ],
      },
    })
    done()
  })
})
