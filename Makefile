.PHONY : all test clean veryclean lint node_check

NODE_MODULES := $(PWD)/node_modules/.bin
BOWER_COMPONENTS := $(PWD)/bower_components

all: lint dist/prob-min.js test

node_check:
	@which node > /dev/null || (echo "node is not installed" && exit 1)
	@which npm > /dev/null || (echo "npm is not installed" && exit 1)


node_modules: node_check package.json
	#
	# NPM update needed.
	#
	npm install
	npm update
	touch -c $@

bower_components: node_modules bower.json
	#
	# Bower update needed.
	#
	$(NODE_MODULES)/bower update
	touch -c $@

clean:
	-rm dist/*

veryclean: clean
	-rm -rf node_modules
	-rm -rf bower_components

lint: node_modules
	$(NODE_MODULES)/jshint --verbose *.js
	$(NODE_MODULES)/jsonlint package.json -q
	$(NODE_MODULES)/jsonlint bower.json -q

test: node_modules dist/prob-min.js

	$(NODE_MODULES)/qunit \
		--cov \
		--timeout 60000 \
		-d Random:$(BOWER_COMPONENTS)/random/lib/random.min.js \
		-c Prob:prob.js \
		-t *-tests.js

	@echo Coverage report at file:///`pwd`/coverage/lcov-report/sim/prob.js.html

#	$(NODE_MODULES)/qunit \
#		--cov \
#		--timeout 60000 \
#		-d Random:$(BOWER_COMPONENTS)/random/lib/random.min.js \
#		-c Prob:dist/prob-min.js \
#		-t *-tests.js

dist/prob.js: prob.js
	cp prob.js dist/prob.js

dist/prob-min.js dist/prob-min.js.map: bower_components dist/prob.js
	cd dist && \
	$(NODE_MODULES)/uglifyjs \
		prob.js \
		-o prob-min.js \
		--compress --comments --lint \
		--source-map prob-min.js.map \
		--source-map-url prob-min.js.map
