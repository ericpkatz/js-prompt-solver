const { conn, Assignment, Cohort, User, Course, Topic, CodePrompt } = require('../db');
const { expect } = require('chai');
describe('application', ()=> {
  let user, course, cohort;
  beforeEach(async()=> {
    await conn.sync({ force: true });
    const [_user, _course] = await Promise.all([
      User.create({ login: 'A_STUDENT'}),
      Course.create({ title: 'JavaScript'})
    ]);
    user = _user;
    course = _course;
    cohort = await Cohort.create({ name: 'A_COHORT', courseId: _course.id});
    const cohort2 = await Cohort.create({ name: 'B_COHORT', courseId: _course.id});
    
    await user.addCohort(cohort);
    const topic = await Topic.create({ title: 'JavaScript Generating Arrays'});
    await Assignment.create({ topicId: topic.id, cohortId: cohort.id});
    const codePrompt2 = await CodePrompt.create({
      topicId: topic.id,
      title: 'Generate An Array of n numbers',
      rank: 2
    });
    const codePrompt1 = await CodePrompt.create({
      topicId: topic.id,
      title: 'Generate An Array of three numbers',
      rank: 1
    });
    const topic2 = await Topic.create({ title: 'JavaScript Generating Arrays from Other Arrays'});
    const ONE_DAY = 1000 * 60 * 60 * 24;
    await Assignment.create({ topicId: topic2.id, cohortId: cohort.id, assigned: new Date().getTime() + ONE_DAY});
    const codePrompt3 = await CodePrompt.create({
      topicId: topic2.id,
      title: 'Generate An Array which doubles the values of an existing array'
    });
    const codePrompt4 = await CodePrompt.create({
      topicId: topic.id,
      title: 'Generate An Array of n numbers starting from x',
      rank: 3
    });

  });
  describe('a user', ()=> {
    describe('in a cohort', ()=> {
      it('has a cohort', async()=> {
        const cohorts = await user.getCohorts();
        expect(cohorts.length).to.equal(1);
      });
      describe('with an assigned topic', ()=> {
        it('has a topic', async()=> {
          const assignments = await cohort.getActiveAssignments();
          expect(assignments.length).to.equal(1);
        });
        describe('with prompts', ()=> {
          it('will see the next prompt', async()=> {
            const prompts = await user.getPrompts();
            expect(prompts.length).to.equal(3);
            expect(prompts[0].title).to.equal('Generate An Array of three numbers');

          });
        });
      });
    })
  });
});
