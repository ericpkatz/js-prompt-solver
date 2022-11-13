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
          login: 'curly'
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
          scaffold: `
const a = 2;
const b = 3;
const c = 1;
const d = 4;
          `,
          scaffoldAfter: `
const result1 = add(a, b);
console.log('result1', result1);
const result2 = add(a, b, c);
console.log('result2', result2);
const result3 = add(a, b, c, d);
console.log('result3', result3);
          `,
          tests: [
            {
              input: 'result1',
              output: '5',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            },
            {
              input: 'result2',
              output: '6',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            },
            {
              input: 'result3',
              output: '10',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            }
          ]
        },
        {
          title: 'Write a function which adds three numbers',
          rank: 2,
          scaffold: `
  const a = 2;
  const b = 3;
  const c = 1;
  const d = 4;
          `,
          scaffoldAfter: `
  const result1 = add(a, b, c);
  const result2 = add(b, c, d);
          `,
          tests: [
            {
              input: 'result1',
              output: '6',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            },
            {
              input: 'result2',
              output: '8',
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
