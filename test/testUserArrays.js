const testUsers = [{
  _id: '5e4b801201ca96379c46b859',
  name: 'Tan Nguyen',
  grade: 80,
},
{
  _id: '5e4b801201ca96379c46b85a',
  name: 'Abc',
  grade: 75,
},
{
  _id: '5e4b801201ca96379c46b85b',
  name: 'Jason',
  grade: 50,
},
{
  _id: '5e4b801201ca96379c46b85c',
  name: 'zhi',
  grade: 25,
},
];

const testUsersNameDesc = [{
  name: 'zhi',
  grade: 25,
},
{
  name: 'Tan Nguyen',
  grade: 80,
},
{
  name: 'Jason',
  grade: 50,
},
{
  name: 'Abc',
  grade: 75,
}];

const testUsersNameAsc = [{
  name: 'Abc',
  grade: 75,
},
{
  name: 'Jason',
  grade: 50,
},
{
  name: 'Tan Nguyen',
  grade: 80,
},
{
  name: 'zhi',
  grade: 25,
}];


const testUsersGradeDesc = [{
  name: 'Tan Nguyen',
  grade: 80,
},
{
  name: 'Abc',
  grade: 75,
},
{
  name: 'Jason',
  grade: 50,
},
{
  name: 'zhi',
  grade: 25,
}];

const testUsersGradeAsc = [{
  name: 'zhi',
  grade: 25,
},
{
  name: 'Jason',
  grade: 50,
},
{
  name: 'Abc',
  grade: 75,
},
{
  name: 'Tan Nguyen',
  grade: 80,
}];


const testUserArrays = {
  testUsers, testUsersNameDesc, testUsersNameAsc, testUsersGradeDesc, testUsersGradeAsc,
};
module.exports = testUserArrays;
