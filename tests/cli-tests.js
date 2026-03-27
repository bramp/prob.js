const { execSync } = require('child_process');
const path = require('path');

/**
 * Checks if the current Node.js version is supported by our CLI (yargs 18).
 * yargs 18 requires Node.js ^20.19.0 || ^22.12.0 || >=23
 */
function isCliSupported() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major > 22) return true;
  if (major === 22) return minor >= 12;
  if (major === 21) return false; // yargs strictly follows LTS schedule
  if (major === 20) return minor >= 19;
  return false;
}

QUnit.module('CLI');

if (isCliSupported()) {
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
} else {
  QUnit.test('skipped (unsupported Node.js version)', function (assert) {
    assert.ok(true, `Skipping CLI tests on Node ${process.version}`);
  });
}
