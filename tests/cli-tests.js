const { execSync } = require('child_process');
const path = require('path');

QUnit.module('CLI');

QUnit.test('normal distribution', function (assert) {
  const cliPath = path.join(__dirname, '../cli/cli.js');
  try {
    const output = execSync(`node ${cliPath} normal --count 5`).toString();
    const numbers = output.trim().split('\n');
    assert.equal(numbers.length, 5, 'Should output 5 numbers');
    numbers.forEach((num) => {
      assert.notOk(isNaN(parseFloat(num)), `Output "${num}" should be a number`);
    });
  } catch (e) {
    assert.ok(false, `CLI failed to run: ${e.message}`);
  }
});

QUnit.test('help output', function (assert) {
  const cliPath = path.join(__dirname, '../cli/cli.js');
  try {
    const output = execSync(`node ${cliPath} --help`).toString();
    assert.ok(output.includes('Usage: cli.js distribution [options]'), 'Help should show usage');
    assert.ok(output.includes('uniform'), 'Help should list uniform distribution');
    assert.ok(output.includes('normal'), 'Help should list normal distribution');
  } catch (e) {
    assert.ok(false, `CLI help failed to run: ${e.message}`);
  }
});
