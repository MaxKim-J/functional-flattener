const mockData:any = {
  user_id: 12424,
  user_name: 'max',
  user_age: 25,
  user_friends: [
    { id: 12324, name: 'julie', favorite_animal: { id: 0, animal_name: 'tiger' } },
    { id: 11424, name: 'michael', favorite_animal: { id: 1, animal_name: 'lion' } },
    { id: 18924, name: 'shawn', favorite_animal: { id: 2, animal_name: 'monkey' } },
  ],
  user_profile: {
    user_profile_text: 'I Love Zebra',
    user_liked_animal: { id: 3, animal_name: 'vulture' },
  },
}

describe('casing', () => {
  it('return object by casing method like', (done) => {
    const result = {}
    expect(result).toBe({
      userId: 12424,
      userName: 'max',
      userAge: 25,
      userFriends: [
        { id: 12324, name: 'julie', favoriteAnimal: { id: 0, animal_name: 'tiger' } },
        { id: 11424, name: 'michael', favoriteAnimal: { id: 1, animal_name: 'lion' } },
        { id: 18924, name: 'shawn', favoriteAnimal: { id: 2, animal_name: 'monkey' } },
      ],
      userProfile: {
        userProfileText: 'I Love Zebra',
        userLikedAnimal: { id: 3, animalName: 'vulture' },
      },
    })
    done()
  })
})
