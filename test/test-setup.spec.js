/**
 * Created by Alex on 05-Jun-17.
 */
const sinon = require('sinon')
const chai = require('chai')

beforeEach(function () {
    this.sandbox = sinon.sandbox.create()
})

afterEach(function () {
    this.sandbox.restore()
})