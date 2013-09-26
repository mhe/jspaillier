////////////////////////////////////////////////////////////////////////////////////
//
// paillier.js: a simple proof-of-concept Javascript implementation of the 
// Paillier homomorphic encryption system.
// 
// Author: Maarten H. Everts (TNO)
//
// Dependencies: jsbn, from http://www-cs-students.stanford.edu/~tjw/jsbn/
//  (you will need at least jsbn.js, jsbn2.js, prng4.js, and rng.js)
// See the demo page on how to use it.
//
////////////////////////////////////////////////////////////////////////////////////


function lcm(a,b) {
  return a.multiply(b).divide(a.gcd(b));
}

paillier = {
	publicKey: function(bits, n) {
		// bits
		this.bits = bits;
		// n
		this.n = n;
		// n2 (cached n^2)
		this.n2 = n.square();
		// np1 (cached n+1)
		this.np1 = n.add(BigInteger.ONE);
		this.rncache = new Array();
	},
	privateKey: function(lambda, pubkey) {
		// lambda
		this.lambda = lambda;
		this.pubkey = pubkey;
		// x (cached) for decryption
		this.x = pubkey.np1.modPow(this.lambda,pubkey.n2).subtract(BigInteger.ONE).divide(pubkey.n).modInverse(pubkey.n);
	},
	generateKeys: function(modulusbits) {
		var p, q, n, keys = {}, rng = new SecureRandom();
		do {
			do {
				p = new BigInteger(modulusbits>>1,1,rng);
			} while (!p.isProbablePrime(10));

			do {
				q = new BigInteger(modulusbits>>1,1,rng);
			} while(!q.isProbablePrime(10));

			n = p.multiply(q);
		} while(!(n.testBit(modulusbits - 1)) || (p.compareTo(q) == 0));
		keys.pub = new paillier.publicKey(modulusbits,n);
		lambda = lcm(p.subtract(BigInteger.ONE),q.subtract(BigInteger.ONE));
		keys.sec = new paillier.privateKey(lambda, keys.pub);
		return keys;
	}
}


paillier.publicKey.prototype = {
	encrypt: function(m) {
		return this.randomize(this.n.multiply(m).add(BigInteger.ONE).mod(this.n2));
	},
	add: function(a,b) {
		return a.multiply(b).remainder(this.n2);
	},
	mult: function(a,b) {
		return a.modPow(b, this.n2);
	},
	randomize: function(a) {
		var rn;
		if (this.rncache.length > 0) {
			rn = this.rncache.pop();
		} else {
			rn = this.getRN();
		}
		return (a.multiply(rn)).mod(this.n2);
	},
	getRN: function() {
		var r, rng = new SecureRandom();
		do {
			r = new BigInteger(this.bits,rng);
			// make sure r <= n
		} while(r.compareTo(this.n) >= 0);
		return r.modPow(this.n, this.n2);
	},
	// Precompute values to make future invokations of encrypt and randomize (significantly) faster.
	// n is the number of precomputed values.
	precompute: function(n) {
		for (var i = 0; i < n; i++) {
			this.rncache.push(this.getRN());
		}
	}
}

paillier.privateKey.prototype = {
	decrypt: function(c) {
		return c.modPow(this.lambda,this.pubkey.n2).subtract(BigInteger.ONE).divide(this.pubkey.n).multiply(this.x).mod(this.pubkey.n);
	}
}