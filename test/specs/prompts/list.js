var expect = require("chai").expect;
var sinon = require("sinon");
var EventEmitter = require("events").EventEmitter;

process.charm = require("charm")(process.stdout);
var List = require("../../../lib/prompts/list");


describe("`list` prompt", function() {

  beforeEach(function() {
    this.rl = new EventEmitter();
    this.list = new List({
      message: "",
      choices: [ "foo", "bar" ]
    }, this.rl);
  });

  afterEach(function() {
    this.list.clean();
  });

  it("should default to first choice", function(done) {
    this.list.run(function(answer) {
      expect(answer).to.equal("foo");

      done();
    });

    this.rl.emit("line");
  });

  it("should move selected cursor on keypress", function(done) {

    this.list.run(function(answer) {
      expect(answer).to.equal("bar");
      done();
    });

    this.rl.emit("keypress", "", { name : "down" });
    this.rl.emit("line");
  });

  it("should move selected cursor up and down on keypress", function(done) {

    this.list.run(function(answer) {
      expect(answer).to.equal("foo");
      done();
    });

    this.rl.emit("keypress", "", { name : "down" });
    this.rl.emit("keypress", "", { name : "up" });
    this.rl.emit("line");
  });

  it("should limit moving inside it's choice array boundaries", function(done) {

    var i = 0;
    function complete() {
      i++;
      if (i === 2) {
        done();
      }
    }

    this.list.run(function(answer) {
      expect(answer).to.equal("foo");
      complete();
    });

    this.rl.emit("keypress", "", { name : "up" });
    this.rl.emit("keypress", "", { name : "up" });
    this.rl.emit("line");

    this.list.run(function(answer) {
      expect(answer).to.equal("bar");
      complete();
    });

    this.rl.emit("keypress", "", { name : "down" });
    this.rl.emit("keypress", "", { name : "down" });
    this.rl.emit("line");
  });

  it("should filter input", function(done) {
    var list = new List({
      message: "",
      choices: [ "foo", "bar" ],
      filter: function() {
        return "pass";
      }
    }, this.rl);

    list.run(function(answer) {
      expect(answer).to.equal("pass");
      list.clean(1);
      done();
    });

    this.rl.emit("line");
  });

});