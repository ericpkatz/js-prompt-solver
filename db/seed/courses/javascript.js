module.exports = {
  title: 'Introduction to JavaScript',
  cohorts: [
    {
      name: 'Cohort A',
      topic: 'Introduction to functions',
      reviews: [
        {
          from: 'larry',
          to: 'moe',
          title: 'the add function with two numbers',
          comments: 
`
I think you are forgetting to put in parameters.
You also need to return the result instead of console.logging.
`
        }
      ], 
      enrollments: [
        {
          login: 'moe',
          promptAttempts: [
            {
              title: 'the add function with two numbers',
              attempt: 
`function add(){
  return a + b;
}
              `,
              submitted: true
            },
          ]
        },
        {
          login: 'larry',
          promptAttempts: [
            {
              title: 'the add function with two numbers',
              attempt: `
const add = (a, b)=> {
  return a + b;
}
              `,
            submitted: true
            },
          ]
        },
        {
          login: 'curly',
          promptAttempts: [
            {
              title: 'the add function with two numbers',
              attempt: `
const add = (a, b) = {
  console.log(a + b);
}
              `,
            submitted: true
            },
          ]
        },
      ]
    },
  ],
  topics: [
    {
      title: 'Introduction to functions',
      codePrompts: [
        {
          title: 'the add function with two numbers',
          rank: 1,
          scaffold: ``,
          scaffoldAfter: ``,
          tests: [
            {
              input: 'add(2, 3)',
              output: '5',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            },
            {
              input: 'add(3, 4)',
              output: '7',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            }
          ]
        },
        {
          title: 'Write a function which adds n numbers',
          rank: 3,
          scaffold: ``,
          scaffoldAfter: ``,
          tests: [
            {
              input: 'add(2, 3)',
              output: '5',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            },
            {
              input: 'add(2, 3, 4)',
              output: '9',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            },
            {
              input: 'add(1, 1, 1, 1, 1, 1, 1, 1, 1, 1)',
              output: '10',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            }
          ]
        },
        {
          title: 'Write a function which adds three numbers',
          rank: 2,
          scaffold: ``,
          scaffoldAfter: ``,
          tests: [
            {
              input: 'add(1, 2, 3)',
              output: '6',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            },
            {
              input: 'add(3, 4, 5)',
              output: '12',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            }
          ]
        }
      ]
    },
    {
      title: 'Passing Arrays to Functions',
      codePrompts: []
    }
  ]
};
