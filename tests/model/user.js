// importing functions
const modelHelper = require('../../server/utils/model/user');


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

/**
 * tests for hash generator function.
 * 
 * function returns hash based on provided length.
 */

 describe('function to generate hash based on different length', ()=>{
    const lengths = [10, 5, 0, 233, 100];

    for(const length of lengths){
        test(`hash code for ${length} length`, ()=>{
            const receivedLength = modelHelper.hashGenerator(length).length;
            expect(receivedLength).toEqual(length);
        });
    }
});

/**
 * tests for username generator
 * 
 * function returns username based on first name.
 */

 describe('function to generate username based on first name', ()=>{
    test(`username for user with Sam as first name`, ()=>{
        const received = modelHelper.usernameGenerator('sam');
        expect(received).toMatch(/sam\d{6}/);
    });

    test(`username for user with Cassie as first name`, ()=>{
        const received = modelHelper.usernameGenerator('cassie');
        expect(received).toMatch(/cassie\d{6}/);
    });

    test(`username for user with no first name`, ()=>{
        expect(() => {
            modelHelper.usernameGenerator()
        }).toThrow('First name cannot be undefined');
    });
});