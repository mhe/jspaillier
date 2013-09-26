jspaillier
==========

jspaillier is a simple proof-of-concept Javascript implementation of the Paillier homomorphic encryption scheme. A demonstration of the code can be found at [here](http://mhe.github.io/jspaillier/).

Do keep in mind this is proof-of-concept code. Also, doing crypto in Javascript is typically considered to be a Bad Idea (tm), see also the discussion ["Javascript Cryptography Considered Harmful"](http://www.matasano.com/articles/javascript-cryptography/).

Dependencies
------------

jspaillier has a single dependency: [jsbn](http://www-cs-students.stanford.edu/~tjw/jsbn/).
You will need at least jsbn.js, jsbn2.js, prng4.js, and rng.js

Usage
-----

See the included demo page for information on how to use this library.

Acknowledgements
----------------

A large part of the work on this library was done at [TNO](http://www.tno.nl) in a project supported by the ["COMMIT/"](http://www.commit-nl.nl) program.	
