# Copyright 2026 Andrew Brampton
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

.PHONY: all test test-ci clean veryclean lint format fix upgrade

# Disable implicit rules
.SUFFIXES:
MAKEFLAGS += --no-builtin-rules

NODE_MODULES := $(PWD)/node_modules/.bin

all: install format lint test

install: node_modules

node_modules: package.json
	@which node > /dev/null || (echo "node is not installed" && exit 1)
	@which npm > /dev/null || (echo "npm is not installed" && exit 1)

	# NPM update needed.
	npm install
	touch -c $@

clean:
	-rm -rf dist/*
	-rm -rf coverage

veryclean: clean
	-rm -rf node_modules

lint: node_modules
	npm run lint

format: node_modules
	npm run format

fix: node_modules
	npx eslint --fix .
	npm run format

upgrade:
	npm update
	npm install

check-upgrade:
	npm outdated || true

test: node_modules dist/prob-min.js
	# Unminified (with coverage)
	npx c8 $(NODE_MODULES)/qunit \
		--require ./tests/setup.js \
		tests/prob-tests.js tests/import-tests.js tests/cli-tests.js

	# Minified (without coverage)
	$(NODE_MODULES)/qunit \
		--require ./tests/setup-min.js \
		tests/prob-tests.js tests/import-tests.js tests/cli-tests.js

	@echo [test] OK

test-ci: install lint test

site: dist/prob-min.js
	@mkdir -p build/site
	cp site/index.html build/site/
	cp site/demo.js build/site/
	cp dist/prob-min.js build/site/
	cp node_modules/random-js/lib/random.min.js build/site/
	@echo [site] Built site in build/site/

dist/prob.js: prob.js node_modules
	$(eval VERSION := $(shell npx mversion | tail -n 1 | cut -d ' ' -f 2))
	$(eval YEAR := $(shell date +%Y))
	@mkdir -p dist
	echo "/* Prob.js $(VERSION) (c) $(YEAR) Andrew Brampton. License: Apache 2.0 */" > $@
	cat $< >> $@

dist/prob-min.js dist/prob-min.js.map: dist/prob.js node_modules
	@mkdir -p dist
	cd dist && \
	$(NODE_MODULES)/terser \
		prob.js \
		-o prob-min.js \
		--compress --mangle \
		--comments '/Prob.js/' \
		--source-map "url='prob-min.js.map',filename='prob-min.js.map'"
