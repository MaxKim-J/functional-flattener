import flattener from '../../lib'

// Premise that target object already camel-cased
const mockData = {
  userId: 12424,
  userName: 'max',
  userAge: 25,
  userProfile: {
    userProfileText: 'I Love Zebra',
    userFavoriteAnimal: { id: 3, animalName: 'vulture' },
    userProfileImage: {
      mobile: '/image/12424/mobile',
      desktop: '/image/12424/desktop',
    },
    userFriends: [
      { id: 12324, name: 'julie', favoriteAnimal: { id: 0, animalName: 'tiger' } },
      { id: 11424, name: 'michael', favoriteAnimal: { id: 1, animalName: 'lion' } },
      { id: 18924, name: 'shawn', favoriteAnimal: { id: 2, animalName: 'monkey' } },
    ],
  },
}

const removePlan = [
  'userId',
  'userProfile.userProfileText',
  'userProfile.userProfileImage.mobile',
]

const wrongRemovePlan = [
  'userId',
  'userProfile.userProf',
  'userProfile.userProfileImage.mobile',
]

describe('FlattenTarget.remove() method should', () => {
  it('return a modified object that remove particular properties according to remove plan parameter.', (done) => {
    const result = flattener(mockData).remove(removePlan).returnResult()
    expect(result).toEqual({
      userName: 'max',
      userAge: 25,
      userProfile: {
        userFavoriteAnimal: { id: 3, animalName: 'vulture' },
        userProfileImage: {
          desktop: '/image/12424/desktop',
        },
        userFriends: [
          {
            id: 12324,
            name: 'julie',
            favoriteAnimal: { id: 0, animalName: 'tiger' },
          },
          {
            id: 11424,
            name: 'michael',
            favoriteAnimal: { id: 1, animalName: 'lion' },
          },
          {
            id: 18924,
            name: 'shawn',
            favoriteAnimal: { id: 2, animalName: 'monkey' },
          },
        ],
      },
    })
    done()
  })

  it('occur an error if key in plan not exist in target.', (done) => {
    expect(() => {
      flattener(mockData)
        .remove(wrongRemovePlan)
        .returnResult()
    }).toThrowError(/does not exist/)
    done()
  })
})
