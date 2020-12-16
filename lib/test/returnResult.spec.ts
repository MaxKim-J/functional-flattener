import flattener from '../../lib'

// Premise that target object already camel-cased
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

describe('FlattenTarget.returnType() method should', () => {
  it('simply return a target object which is private variable in FlattenTarget class.', (done) => {
    const result = flattener(mockData).returnResult()
    expect(result).toEqual(mockData)
    done()
  })
})
