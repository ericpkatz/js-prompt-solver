const { syncAndSeed, conn, Assignment, Cohort, User, Course, Topic, CodePrompt } = require('../db');
const { expect } = require('chai');
describe('application', ()=> {
  let user, course, cohort;
  beforeEach(async()=> {
    const seed = await syncAndSeed();
    user = seed.user;
    course = seed.course;
    cohort = seed.cohort;

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
