// importing functions
const { model } = require('mongoose');
const modelHelper = require('../server/utilities/modelHelper');


/**
 * tests for uniqueIdGenerator function.
 * 
 * function returns an unique id based on first name and last name.
 * it returns the id in string format.
 */
describe('function to generate unique id for users', ()=>{
    test('unique id for user elton castee', ()=>{
        expect(modelHelper.uniqueIdGenerator('elton', 'castee')).toMatch(/usrcasteeelton_\d{6}/);
    });
    
    test('unique id for user john stone', ()=>{
        expect(modelHelper.uniqueIdGenerator('john', 'stone')).toMatch(/usrstonejohn_\d{6}/);
    });
    
    test('unique id for user brandon without last name', ()=>{
        expect(modelHelper.uniqueIdGenerator('brandon')).toMatch(/usrbrandon_\d{6}/);
    });
    
    test('unique id for user smith without first name', ()=>{
        expect(modelHelper.uniqueIdGenerator(undefined, 'smith')).toMatch(/usrsmith_\d{6}/);
    });
    
    test('unique id for no user', ()=>{
        expect(()=>{
            modelHelper.uniqueIdGenerator()
        }).toThrow('First name and Last name cannot be undefined');
    });
});