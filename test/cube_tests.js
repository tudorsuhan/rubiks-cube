const assert = require('chai').assert
const Cube = require('../cube')

describe('Tests for cube.js', function () {
	it('Testing cubie and coordinate functions', function () {
		for (var i = 0; i < 20; i++) {
			var random = Cube.random()
			var cubie = Cube.coordinateToCubie(Cube.cubieToCoordinate(random))
			assert.deepEqual(cubie.co, random.co, "corner orientation did not match")
			assert.deepEqual(cubie.cp, random.cp, "corner permutation did not match")
			assert.deepEqual(cubie.eo, random.eo, "edge orientation did not match")
			assert.deepEqual(cubie.ep, random.ep, "edge permutation did not match")	
		}
	})
	it('Testing moves and simple hash function', function () {
		var tests = [
			{
				scramble: "D' R' F L' D2 F U' D' L U' F R2 B' D2 F' R2 U2 B' D2 R2 B ",
				inverse: "B' R2 D2 B U2 R2 F D2 B R2 F' U L' D U F' D2 L F' R D ",
				solve: "y2 R F' Rw' U B F U M U' M' U2 Rw' U' Rw R U Rw' U Rw U' Rw' U' R' U2 R U R' U R U' R U R' F' R U R' U' R' F R2 U' R' M' U M U M' U' M U2 M U' M2 U2 M' U2 M' L2 "
			}
		]
		for (var i in tests) {
			var identity = new Cube ()
			var cube = new Cube ()
			cube.scramble(tests[i].scramble + tests[i].solve)
			cube.orient()
			assert.equal(cube.hash(), identity.hash(), "test " + i + ", scramble + solve")
			cube.scramble(tests[i].inverse + tests[i].scramble)
			assert.equal(cube.hash(), identity.hash(), "test " + i + ", inverse + scramble")
		}
	})
	it('Testing parity', function () {
		var getParity = (data, num_pieces) => {
			var sum = 0
			for (var i=1; i <= num_pieces; i++) {
				for (var j = 0; j < i; j++) {
					if (data[j] > data[i]) sum++;
				}
			}
			return sum%2;
		}

		var num_tests = 30
		// in generating a lot of random cubes, we can pretty much guarantee both cases of parity will show up
		var odd = 0
		for (var i = 0; i < num_tests; i++) {
			var random = Cube.random()
			var parity = getParity(random.ep, 12)
			assert.equal(parity, getParity(random.cp, 8), "edge and corner parity did not match")
			if (parity == 1) odd++;
		}
		assert.notEqual(odd, 0, "no odd parity cases generated in random()")
		assert.notEqual(odd, num_tests, "no even parity cases generated in random()")
	})
})