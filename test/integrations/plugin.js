'use strict';
const App = require('../../lib/app').App;
const Plugin = require('../../lib/integrations/plugin').Plugin;
const expect = require('chai').expect;

describe('plugin', () => {
  describe('register with name', () => {
    it('should be initialized', (done) => {
      const app = new App();
      app.register('plugin', new TestPlugin({
        onInit() {
          expect(this.app).to.equal(app);
          done();
        },
      }));
    });
  });

  describe('register without name', () => {
    it('should be initialized', (done) => {
      const app = new App();
      app.register(new TestPlugin({
        onInit() {
          expect(this.app).to.equal(app);
          done();
        },
      }));
    });
    it('should have a name', () => {
      const app = new App();
      const plugin = new Plugin();
      app.register(plugin);
      expect(app.config.plugins).to.have.property('Plugin', plugin);
    });
  });
});

/**
 * Dummy Plugin for testing.
 */
class TestPlugin extends Plugin {
  /**
   * Invokes the onInit callback passed as option.
   */
  init() {
    this.options.onInit.call(this);
  }
}
