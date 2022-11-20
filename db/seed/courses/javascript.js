const ADD_THREE = 'Write A Function Which Adds Three Numbers';
const ADD_TWO = 'Write A Function Which Adds Two Numbers';
const ADD_N = 'Write A Function Which Adds N Numbers';
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
          title: ADD_TWO,
          comments: 
`
I think you are forgetting to put in parameters.
You also need to return the result instead of console.logging.
`
        },
        {
          from: 'curly',
          to: 'moe',
          title: ADD_TWO,
          comments: 
`
check your params
`
        }
      ], 
      enrollments: [
        {
          login: 'moe',
          promptAttempts: [
            {
              title: ADD_TWO,
              attempt: 
`function add(){
  return a + b;
}
              `,
              submitted: true,
              tests: [
                {
                  input: 'add(5, 7)',
                  output: '12',
                  operator: 'EQUALS',
                  outputDataType: 'NUMERIC'
                },

              ]
            },
            {
              title: ADD_THREE,
              attempt: 
`function add(){
  return a + b + c;
}
              `,
              submitted: false,
              tests: [
                {
                  input: 'add(5, 7, 1)',
                  output: '13',
                  operator: 'EQUALS',
                  outputDataType: 'NUMERIC'
                }
              ]
            },
          ]
        },
        {
          login: 'larry',
          promptAttempts: [
            {
              title: ADD_TWO,
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
              title: ADD_TWO,
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
          title: ADD_TWO,
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
          title: ADD_N,
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
          title: ADD_THREE,
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
