import flattener from '../../lib'

const mockData = {
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

const changePlan = {
  userAge: 'userCurrentAge',
  'userProfile:userCurrentProfile': {
    userProfileText: 'userIntroduce',
    'userFavoriteAnimal:userAnimal': {
      animalName: 'name',
    },
  },
}

describe('FlattenTarget.changeKey() method should', () => {
  it('return a modified object which all keys of ', (done) => {
    const result = flattener(mockData).changeKey(changePlan).returnResult()
    expect(result).toEqual({
      userId: 12424,
      userName: 'max',
      userAge: 25,
      userCurrentProfile: {
        userIntroduce: 'I Love Zebra',
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
