"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("source-map-support/register");

var _junitReportBuilder = _interopRequireDefault(require("junit-report-builder"));

var _reporter = _interopRequireDefault(require("@wdio/reporter"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JunitReporter extends _reporter.default {
  constructor(options) {
    super(options);
    this.suiteNameRegEx = this.options.suiteNameFormat instanceof RegExp ? this.options.suiteNameFormat : /[^a-zA-Z0-9]+/;
  }

  onRunnerEnd(runner) {
    const xml = this.prepareXml(runner);
    this.write(xml);
  }

  prepareName(name = 'Skipped test') {
    return name.split(this.suiteNameRegEx).filter(item => item && item.length).join(' ');
  }

  prepareXml(runner) {
    const builder = _junitReportBuilder.default.newBuilder();

    const packageName = this.options.packageName ? `${runner.sanitizedCapabilities}-${this.options.packageName}` : runner.sanitizedCapabilities;

    for (let specId of Object.keys(runner.specs)) {
      for (let suiteKey of Object.keys(this.suites)) {
        /**
         * ignore root before all
         */

        /* istanbul ignore if  */
        if (suiteKey.match(/^"before all"/)) {
          continue;
        }

        const suite = this.suites[suiteKey];
        const suiteName = this.prepareName(suite.title);
        const testSuite = builder.testSuite().name(suiteName).timestamp(suite.start).time(suite._duration / 1000).property('specId', specId).property('suiteName', suite.title).property('capabilities', runner.sanitizedCapabilities).property('file', runner.specs[0].replace(process.cwd(), '.'));

        for (let testKey of Object.keys(suite.tests)) {
          if (testKey !== 'undefined') {
            // fix cucumber hooks crashing reporter
            const test = suite.tests[testKey];
            const testName = this.prepareName(test.title);
            const testCase = testSuite.testCase().className(`${packageName}.${suiteName}`).name(testName).time(test._duration / 1000);

            if (test.state === 'pending' || test.state === 'skipped') {
              testCase.skipped();
            }

            if (test.error) {
              const errorOptions = this.options.errorOptions;

              if (errorOptions) {
                for (const key of Object.keys(errorOptions)) {
                  testCase[key](test.error[errorOptions[key]]);
                }
              } else {
                // default
                testCase.error(test.error.message);
              }

              testCase.standardError(`\n${test.error.stack}\n`);
            }

            const output = this.getStandardOutput(test);
            if (output) testCase.standardOutput(`\n${output}\n`);
          }
        }
      }
    }

    return builder.build();
  }

  getStandardOutput(test) {
    let standardOutput = [];
    test.output.forEach(data => {
      switch (data.type) {
        case 'command':
          standardOutput.push(`COMMAND: ${data.method.toUpperCase()} ` + `${data.endpoint.replace(':sessionId', data.sessionId)} - ${this.format(data.body)}`);
          break;

        case 'result':
          standardOutput.push(`RESULT: ${this.format(data.body)}`);
          break;
      }
    });
    return standardOutput.length ? standardOutput.join('\n') : '';
  }

  format(val) {
    return JSON.stringify((0, _utils.limit)(val));
  }

}

var _default = JunitReporter;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJKdW5pdFJlcG9ydGVyIiwiV0RJT1JlcG9ydGVyIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwic3VpdGVOYW1lUmVnRXgiLCJzdWl0ZU5hbWVGb3JtYXQiLCJSZWdFeHAiLCJvblJ1bm5lckVuZCIsInJ1bm5lciIsInhtbCIsInByZXBhcmVYbWwiLCJ3cml0ZSIsInByZXBhcmVOYW1lIiwibmFtZSIsInNwbGl0IiwiZmlsdGVyIiwiaXRlbSIsImxlbmd0aCIsImpvaW4iLCJidWlsZGVyIiwianVuaXQiLCJuZXdCdWlsZGVyIiwicGFja2FnZU5hbWUiLCJzYW5pdGl6ZWRDYXBhYmlsaXRpZXMiLCJzcGVjSWQiLCJPYmplY3QiLCJrZXlzIiwic3BlY3MiLCJzdWl0ZUtleSIsInN1aXRlcyIsIm1hdGNoIiwic3VpdGUiLCJzdWl0ZU5hbWUiLCJ0aXRsZSIsInRlc3RTdWl0ZSIsInRpbWVzdGFtcCIsInN0YXJ0IiwidGltZSIsIl9kdXJhdGlvbiIsInByb3BlcnR5IiwicmVwbGFjZSIsInByb2Nlc3MiLCJjd2QiLCJ0ZXN0S2V5IiwidGVzdHMiLCJ0ZXN0IiwidGVzdE5hbWUiLCJ0ZXN0Q2FzZSIsImNsYXNzTmFtZSIsInN0YXRlIiwic2tpcHBlZCIsImVycm9yIiwiZXJyb3JPcHRpb25zIiwia2V5IiwibWVzc2FnZSIsInN0YW5kYXJkRXJyb3IiLCJzdGFjayIsIm91dHB1dCIsImdldFN0YW5kYXJkT3V0cHV0Iiwic3RhbmRhcmRPdXRwdXQiLCJidWlsZCIsImZvckVhY2giLCJkYXRhIiwidHlwZSIsInB1c2giLCJtZXRob2QiLCJ0b1VwcGVyQ2FzZSIsImVuZHBvaW50Iiwic2Vzc2lvbklkIiwiZm9ybWF0IiwiYm9keSIsInZhbCIsIkpTT04iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7O0FBRUEsTUFBTUEsYUFBTixTQUE0QkMsaUJBQTVCLENBQXlDO0FB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QVdGLElBQUksQ0FBQ0csTUFBTCxDQUFZQyxXQUFaLEVBQTBCLEdBQXRDLEdBQ0MsR0FBRUosSUFBSSxDQUFDSyxRQUFMLENBQWMzQixPQUFkLENBQXNCLFlBQXRCLEVBQW9Dc0IsSUFBSSxDQUFDTSxTQUF6QyxDQUFvRCxNQUFLLEtBQUtDLE1BQUwsQ0FBWVAsSUFBSSxDQUFDUSxJQUFqQixDQUF1QixFQUZ2RjtBQUlBOztBQUNKLGFBQUssUUFBTDtBQUNJWCxVQUFBQSxjQUFjLENBQUNLLElBQWYsQ0FBcUIsV0FBVSxLQUFLSyxNQUFMLENBQVlQLElBQUksQ0FBQ1EsSUFBakIsQ0FBdUIsRUFBdEQ7QUFDQTtBQVRKO0FBV0gsS0FaRDtBQWFBLFdBQU9YLGNBQWMsQ0FBQzFDLE1BQWYsR0FBd0IwQyxjQUFjLENBQUN6QyxJQUFmLENBQW9CLElBQXBCLENBQXhCLEdBQW9ELEVBQTNEO0FBQ0g7O0FBRURtRCxFQUFBQSxNQUFNLENBQUVFLEdBQUYsRUFBTztBQUNULFdBQU9DLElBQUksQ0FBQ0MsU0FBTCxDQUFlLGtCQUFNRixHQUFOLENBQWYsQ0FBUDtBQUNIOztBQXRHb0M7O2VBeUcxQnZFLGEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQganVuaXQgZnJvbSAnanVuaXQtcmVwb3J0LWJ1aWxkZXInXHJcbmltcG9ydCBXRElPUmVwb3J0ZXIgZnJvbSAnQHdkaW8vcmVwb3J0ZXInXHJcblxyXG5pbXBvcnQgeyBsaW1pdCB9IGZyb20gJy4vdXRpbHMnXHJcblxyXG5jbGFzcyBKdW5pdFJlcG9ydGVyIGV4dGVuZHMgV0RJT1JlcG9ydGVyIHtcclxuICAgIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucylcclxuICAgICAgICB0aGlzLnN1aXRlTmFtZVJlZ0V4ID0gdGhpcy5vcHRpb25zLnN1aXRlTmFtZUZvcm1hdCBpbnN0YW5jZW9mIFJlZ0V4cFxyXG4gICAgICAgICAgICA/IHRoaXMub3B0aW9ucy5zdWl0ZU5hbWVGb3JtYXRcclxuICAgICAgICAgICAgOiAvW15hLXpBLVowLTldKy9cclxuICAgIH1cclxuXHJcbiAgICBvblJ1bm5lckVuZCAocnVubmVyKSB7XHJcbiAgICAgICAgY29uc3QgeG1sID0gdGhpcy5wcmVwYXJlWG1sKHJ1bm5lcilcclxuICAgICAgICB0aGlzLndyaXRlKHhtbClcclxuICAgIH1cclxuXHJcbiAgICBwcmVwYXJlTmFtZSAobmFtZSA9ICdTa2lwcGVkIHRlc3QnKSB7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUuc3BsaXQodGhpcy5zdWl0ZU5hbWVSZWdFeCkuZmlsdGVyKFxyXG4gICAgICAgICAgICAoaXRlbSkgPT4gaXRlbSAmJiBpdGVtLmxlbmd0aFxyXG4gICAgICAgICkuam9pbignICcpXHJcbiAgICB9XHJcblxyXG4gICAgcHJlcGFyZVhtbCAocnVubmVyKSB7XHJcbiAgICAgICAgY29uc3QgYnVpbGRlciA9IGp1bml0Lm5ld0J1aWxkZXIoKVxyXG5cclxuICAgICAgICBjb25zdCBwYWNrYWdlTmFtZSA9IHRoaXMub3B0aW9ucy5wYWNrYWdlTmFtZVxyXG4gICAgICAgICAgICA/IGAke3J1bm5lci5zYW5pdGl6ZWRDYXBhYmlsaXRpZXN9LSR7dGhpcy5vcHRpb25zLnBhY2thZ2VOYW1lfWBcclxuICAgICAgICAgICAgOiBydW5uZXIuc2FuaXRpemVkQ2FwYWJpbGl0aWVzXHJcblxyXG4gICAgICAgIGZvciAobGV0IHNwZWNJZCBvZiBPYmplY3Qua2V5cyhydW5uZXIuc3BlY3MpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHN1aXRlS2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuc3VpdGVzKSkge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBpZ25vcmUgcm9vdCBiZWZvcmUgYWxsXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChzdWl0ZUtleS5tYXRjaCgvXlwiYmVmb3JlIGFsbFwiLykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHN1aXRlID0gdGhpcy5zdWl0ZXNbc3VpdGVLZXldXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWl0ZU5hbWUgPSB0aGlzLnByZXBhcmVOYW1lKHN1aXRlLnRpdGxlKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdFN1aXRlID0gYnVpbGRlci50ZXN0U3VpdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5uYW1lKHN1aXRlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAudGltZXN0YW1wKHN1aXRlLnN0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aW1lKHN1aXRlLl9kdXJhdGlvbiAvIDEwMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLnByb3BlcnR5KCdzcGVjSWQnLCBzcGVjSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnByb3BlcnR5KCdzdWl0ZU5hbWUnLCBzdWl0ZS50aXRsZSlcclxuICAgICAgICAgICAgICAgICAgICAucHJvcGVydHkoJ2NhcGFiaWxpdGllcycsIHJ1bm5lci5zYW5pdGl6ZWRDYXBhYmlsaXRpZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgLnByb3BlcnR5KCdmaWxlJywgcnVubmVyLnNwZWNzWzBdLnJlcGxhY2UocHJvY2Vzcy5jd2QoKSwgJy4nKSlcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0ZXN0S2V5IG9mIE9iamVjdC5rZXlzKHN1aXRlLnRlc3RzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0S2V5ICE9PSAndW5kZWZpbmVkJykgeyAvLyBmaXggY3VjdW1iZXIgaG9va3MgY3Jhc2hpbmcgcmVwb3J0ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IHN1aXRlLnRlc3RzW3Rlc3RLZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlc3ROYW1lID0gdGhpcy5wcmVwYXJlTmFtZSh0ZXN0LnRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXN0Q2FzZSA9IHRlc3RTdWl0ZS50ZXN0Q2FzZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2xhc3NOYW1lKGAke3BhY2thZ2VOYW1lfS4ke3N1aXRlTmFtZX1gKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5hbWUodGVzdE5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGltZSh0ZXN0Ll9kdXJhdGlvbiAvIDEwMDApXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGVzdC5zdGF0ZSA9PT0gJ3BlbmRpbmcnIHx8IHRlc3Quc3RhdGUgPT09ICdza2lwcGVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdENhc2Uuc2tpcHBlZCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0LmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvck9wdGlvbnMgPSB0aGlzLm9wdGlvbnMuZXJyb3JPcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JPcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoZXJyb3JPcHRpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0Q2FzZVtrZXldKHRlc3QuZXJyb3JbZXJyb3JPcHRpb25zW2tleV1dKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RDYXNlLmVycm9yKHRlc3QuZXJyb3IubWVzc2FnZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RDYXNlLnN0YW5kYXJkRXJyb3IoYFxcbiR7dGVzdC5lcnJvci5zdGFja31cXG5gKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXQgPSB0aGlzLmdldFN0YW5kYXJkT3V0cHV0KHRlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQpIHRlc3RDYXNlLnN0YW5kYXJkT3V0cHV0KGBcXG4ke291dHB1dH1cXG5gKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYnVpbGRlci5idWlsZCgpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U3RhbmRhcmRPdXRwdXQgKHRlc3QpIHtcclxuICAgICAgICBsZXQgc3RhbmRhcmRPdXRwdXQgPSBbXVxyXG4gICAgICAgIHRlc3Qub3V0cHV0LmZvckVhY2goKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChkYXRhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnY29tbWFuZCc6XHJcbiAgICAgICAgICAgICAgICBzdGFuZGFyZE91dHB1dC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIGBDT01NQU5EOiAke2RhdGEubWV0aG9kLnRvVXBwZXJDYXNlKCl9IGAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGAke2RhdGEuZW5kcG9pbnQucmVwbGFjZSgnOnNlc3Npb25JZCcsIGRhdGEuc2Vzc2lvbklkKX0gLSAke3RoaXMuZm9ybWF0KGRhdGEuYm9keSl9YFxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAncmVzdWx0JzpcclxuICAgICAgICAgICAgICAgIHN0YW5kYXJkT3V0cHV0LnB1c2goYFJFU1VMVDogJHt0aGlzLmZvcm1hdChkYXRhLmJvZHkpfWApXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gc3RhbmRhcmRPdXRwdXQubGVuZ3RoID8gc3RhbmRhcmRPdXRwdXQuam9pbignXFxuJykgOiAnJ1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdCAodmFsKSB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGxpbWl0KHZhbCkpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEp1bml0UmVwb3J0ZXJcclxuIl19