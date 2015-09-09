/*
    
    ######## BEFORE UPDATING DATA-HANDLING CODE OR USING THE COALESCE OPERATOR: ######## 
    don't use the pipe-pipe "||" coalesce operator when handling data because if a zero comes to the coalesce (and it is a number 0 and not a string "0") it will be evaluated as false and thus coalesce to the next operand. Whenever you use this operator: be careful of what will be evaluated.
    
    To see this in action run this in your console:
    
    console.log( true      || 'test' );  // logs:  true  (expected)
    console.log( false     || 'test' );  // logs: 'test' (expected)

    console.log( null      || 'test' );  // logs: 'test' (expected)
    console.log( undefined || 'test' );  // logs: 'test' (expected)

    console.log( '1'       || 'test' );  // logs: '1'    (expected)
    console.log(  1        || 'test' );  // logs:  1     (expected)
    console.log( '0'       || 'test' );  // logs: '0'    (expected)
    console.log(  0        || 'test' );  // logs: 'test' (OH NO!!)
    
    here is another demonstration:
    
    console.log( Boolean(true)      );
    console.log( Boolean(false)     );
    console.log( Boolean(null)      );
    console.log( Boolean(undefined) );
    console.log( Boolean('1')       );
    console.log( Boolean( 1)        );
    console.log( Boolean('0')       );
    console.log( Boolean( 0)        ); // zero evaluates to false
    
    
    ######## BEFORE UPDATING FASTCLICK: ######## 
    fastclick (around line 254) has some code added (by michael) to add a feature to fastclick, bring this code to any new version
    
    it also has (around line 123) some code added to an if statement added by joseph:
        if (deviceIsAndroid || deviceIsIOS) {
    as opposed to:
        if (deviceIsAndroid) {
    
    
    ######## BEFORE UPDATING X-TAGS: ######## 
    make sure you include the polyfills and make sure that there isn't still a duplicated block of code in the source, if there is remove it, here is how to find out:
    
    do a find in textedit for: "scope.upgradeDocumentTree = nop;" (excluding the quotes of course)
    
    remove the whole block of code surrounding the second match (it might be the first match but I think it is the second match)

*/