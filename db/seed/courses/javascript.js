module.exports = {
  title: 'Introduction to JavaScript',
  topics: [
    {
      title: 'Introduction to functions',
      codePrompts: [
        {
          title: 'Write a function which adds two numbers',
          rank: 1,
          scaffold: `
  const a = 2;
  const b = 3;
  const c = 1;
          `,
          scaffoldAfter: `
  const result1 = add(a, b);
  const result2 = add(b, c);
          `,
          tests: [
            {
              input: 'result1',
              output: '3',
              operator: 'EQUALS',
              outputDataType: 'NUMERIC'
            },
            {
              input: 'result2',
              output: '4',
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
  const result2 = add(a, b, c);
  const result3 = add(a, b, c, d);
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
