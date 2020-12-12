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

const wrongChangePlan = {
  userAge: 'userCurrentAge',
  'userProfile:userCurrentProfile': {
    userProfileText: 'userIntroduce',
    userZooName: 'userZooTitle',
    'userFavoriteAnimal:userAnimal': {
      animalName: 'name',
    },
  },
}

describe('FlattenTarget.changeKey() method should', () => {
  it('return a modified object which particular keys are changed according to change plan', (done) => {
    const result = flattener(mockData).changeKey(changePlan).returnResult()
    expect(result).toEqual({
      userId: 12424,
      userName: 'max',
      userCurrentAge: 25,
      userCurrentProfile: {
        userIntroduce: 'I Love Zebra',
        userAnimal: { id: 3, name: 'vulture' },
        userFriends: [
          { id: 12324, name: 'julie', favoriteAnimal: { id: 0, animalName: 'tiger' } },
          { id: 11424, name: 'michael', favoriteAnimal: { id: 1, animalName: 'lion' } },
          { id: 18924, name: 'shawn', favoriteAnimal: { id: 2, animalName: 'monkey' } },
        ],
      },
    })
    done()
  })

  it('occur an error when plan contain a key which is not included in target object', (done) => {
    expect(() => {
      flattener(mockData)
        .changeKey(wrongChangePlan)
        .returnResult()
    }).toThrowError(/userZooName/)
    done()
  })
})
