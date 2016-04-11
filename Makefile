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

.PHONY: all lint veryclean

# Disable implicit rules
.SUFFIXES:
MAKEFLAGS += --no-builtin-rules

NODE_MODULES := $(PWD)/node_modules/.bin

all: bower_components lint

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
	$(NODE_MODULES)/bower update --force
	touch -c $@

lint: node_modules
	$(NODE_MODULES)/jshint --verbose *.js
	$(NODE_MODULES)/jsonlint package.json -q
	$(NODE_MODULES)/jsonlint bower.json -q
	$(NODE_MODULES)/jscs --preset=google --fix *.js

veryclean:
	-rm -rf node_modules
	-rm -rf bower_components
