// importing modules
const chai = require('chai');
const mocha = require('mocha');
const assert = require('assert');

// importing helper function
const HELPERS = require('../server/utils/model/user');


describe('Tests for User model helper functions.', () => {

  // test for unique id generator
  describe('function to generate unique id.', () => {

    // test #1
    it('user is James Brown', () => {
      assert.match(HELPERS.uniqueIdGenerator('james', 'brown'), /usrbrownjames_\d{6}/);
    });

    // test #2
    it('user is Emily Monroe', () => {
      assert.match(HELPERS.uniqueIdGenerator('emily', 'monroe'), /usrmonroeemily_\d{6}/);
    });

    // test #3
    it('user is Joe', () => {
      assert.match(HELPERS.uniqueIdGenerator('joe'), /usrjoe_\d{6}/);
    });

    // test #4
    it('user is Stone', () => {
      assert.match(HELPERS.uniqueIdGenerator('stone'), /usrstone_\d{6}/);
    });

    // test #5
    it('no user is passed', () => {
      assert.throws(() => {
        HELPERS.uniqueIdGenerator()
      },
        'No parameters passed');
    });
  });

  // test for username generator
  describe('function to generate default usernames.', () => {

    // test #1
    it('user is James', () => {
      assert.match(HELPERS.usernameGenerator('james'), /james\d{6}/);
    });

    // test #2
    it('user is Emily', () => {
      assert.match(HELPERS.usernameGenerator('emily'), /emily\d{6}/);
    });

    // test #3
    it('no user is passed', () => {
      assert.throws(() => {
        HELPERS.usernameGenerator()
      }, 'No parameters passed');
    });

    // test #4
    it('user is Ed Ken', () => {
      assert.match(HELPERS.usernameGenerator('ed ken'), /ed ken\d{6}/);
    });
  });


  // test for hash generator
  describe('function to generate string hash based on length', ()=>{

    // test #1
    it('length is 10', ()=>{
      assert.equal(HELPERS.hashGenerator(10).length, 10);
    });

    // test #2
    it('length is 0', ()=>{
      assert.equal(HELPERS.hashGenerator(0).length, 0);
    });
  });
});
