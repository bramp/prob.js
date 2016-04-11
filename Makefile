# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
################################################################################

.PHONY: all test clean veryclean lint

# Disable implicit rules
.SUFFIXES:
MAKEFLAGS += --no-builtin-rules

NODE_MODULES := $(PWD)/node_modules/.bin
BOWER_COMPONENTS := $(PWD)/bower_components

all: lint dist/prob-min.js test

node_modules: package.json
	@which node > /dev/null || (echo "node is not installed" && exit 1)
	@which npm > /dev/null || (echo "npm is not installed" && exit 1)

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
	# Lint
	$(NODE_MODULES)/jshint --verbose *.js
	$(NODE_MODULES)/jsonlint package.json -q
	$(NODE_MODULES)/jsonlint bower.json -q

	$(NODE_MODULES)/jshint --verbose cli/*.js
	$(NODE_MODULES)/jsonlint cli/package.json -q

	# Code Style.
	$(NODE_MODULES)/jscs --preset=google --fix *.js
	$(NODE_MODULES)/jscs --preset=google --fix cli/*.js


test: node_modules dist/prob-min.js

	# Unminified (with coverage)
	$(NODE_MODULES)/qunit \
		--cov \
		--timeout 60000 \
		-d Random:$(BOWER_COMPONENTS)/random/lib/random.js \
		-c Prob:dist/prob.js \
		-t tests/prob-tests.js tests/import-tests.js
		# BUG: We list both tests, so that we get better test coverage https://github.com/kof/node-qunit/issues/131

	# Minified (without coverage)
	$(NODE_MODULES)/qunit \
		--timeout 60000 \
		-d Random:$(BOWER_COMPONENTS)/random/lib/random.js \
		-c Prob:dist/prob-min.js \
		-t tests/*-tests.js

	@echo Coverage report at file://$(PWD)/coverage/lcov-report/index.html
	@echo [test] OK

#	$(NODE_MODULES)/qunit \
#		--cov \
#		--timeout 60000 \
#		-d Random:$(BOWER_COMPONENTS)/random/lib/random.min.js \
#		-c Prob:dist/prob-min.js \
#		-t *-tests.js

dist/prob.js: prob.js
	$(eval VERSION := $(shell $(NODE_MODULES)/mversion | tail -n 1 | cut -d ' ' -f 2))
	$(eval YEAR := $(shell date +%Y))

	echo "/* Prob.js $(VERSION) (c) $(YEAR) Google, Inc. License: Apache 2.0 */" > $@
	cat $< >> $@

dist/prob-min.js dist/prob-min.js.map: bower_components dist/prob.js

	cd dist && \
	$(NODE_MODULES)/uglifyjs \
		prob.js \
		-o prob-min.js \
		--compress --lint \
		--comments '/Prob.js/' \
		--source-map prob-min.js.map \
		--source-map-url prob-min.js.map
