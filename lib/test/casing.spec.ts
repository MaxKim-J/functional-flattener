import flattener from '../../lib'

const snakeMockData = {
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

const camelMockData = {
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
}

describe('FlattenTarget.casing() method should', () => {
  it('return a modified object which all keys of properties are camelCase when casingOption.to is \'camel\'', (done) => {
    const result = flattener(snakeMockData).case({ to: 'camel' }).returnResult()
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

  it('return a modified object which all keys of properties are snakeCase when casingOption.to is \'snake\'', (done) => {
    const result = flattener(camelMockData).case({ to: 'snake' }).returnResult()
    expect(result).toEqual({
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
    })
    done()
  })
})
