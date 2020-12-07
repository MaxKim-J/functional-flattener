import flattener from '../../lib'
import { Target } from '../types'

interface Animal {
  id:number,
  animalName: string
}

interface Friend {
  id: number,
  name: string,
  favoriteAnimal: Animal
}

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

const extractPlan = [
  'userId',
  'userProfile.userProfileText',
  'userProfile.userProfileImage.mobile',
]

describe('FlattenTarget.extract() method should', () => {
  it('return a modified object that extract particular properties according to extract plan parameter.', (done) => {
    const result = flattener(mockData).extract(extractPlan).returnResult()
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
})
