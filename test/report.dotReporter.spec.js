"use strict";
const expect = require('chai').expect;
const render = require('../src/report/dotReporter').render;
const deps   = require('./fixtures/cjs-no-dependency-valid.json');

const elFixture = `digraph "dependency-cruiser output"{
    ordering=out
    rankdir=LR
    splines=true
    overlap=false
    nodesep=0.16
    fontname="Helvetica-bold"
    fontsize="9"
    style="rounded,bold"
    compound=true
    node [shape=box style="rounded, filled" fillcolor="#ffffcc" height=0.2 fontname=Helvetica fontsize=9]
    edge [color=black arrowhead=normal fontname="Helvetica" fontsize="9"]

    "fs" [color="grey" fontcolor="grey"]
    "http" [color="grey" fontcolor="grey"]
    subgraph "cluster_/node_modules" {label="node_modules" subgraph "cluster_/node_modules/somemodule" {label="somemodule" subgraph "cluster_/node_modules/somemodule/node_modules" {label="node_modules" subgraph "cluster_/node_modules/somemodule/node_modules/someothermodule" {label="someothermodule" "node_modules/somemodule/node_modules/someothermodule/main.js" [label="main.js"] } } } }
    subgraph "cluster_/node_modules" {label="node_modules" subgraph "cluster_/node_modules/somemodule" {label="somemodule" subgraph "cluster_/node_modules/somemodule/src" {label="src" "node_modules/somemodule/src/moar-javascript.js" [label="moar-javascript.js"] } } }
    subgraph "cluster_/node_modules" {label="node_modules" subgraph "cluster_/node_modules/somemodule" {label="somemodule" subgraph "cluster_/node_modules/somemodule/src" {label="src" "node_modules/somemodule/src/somemodule.js" [label="somemodule.js"] } } }
    "one_only_one.js"
    "one_only_two.js"
    "path" [color="grey" fontcolor="grey"]
    "root_one.js"
    "root_two.js"
    "shared.js" [color="red" fontcolor="red"]
    "somedata.json"
    subgraph "cluster_/sub" {label="sub" "sub/depindir.js" [label="depindir.js"] }
    subgraph "cluster_/sub" {label="sub" "sub/dir.js" [label="dir.js"] }
    "two_only_one.js"

    "node_modules/somemodule/src/somemodule.js" -> "node_modules/somemodule/src/moar-javascript.js" [color="orange" penwidth=2.0]
    "node_modules/somemodule/src/somemodule.js" -> "node_modules/somemodule/node_modules/someothermodule/main.js" [color="orange" penwidth=2.0]
    "one_only_one.js" -> "path" [color="orange" penwidth=2.0]
    "one_only_two.js" -> "path" [color="orange" penwidth=2.0]
    "root_one.js" -> "one_only_one.js" [color="orange" penwidth=2.0]
    "root_one.js" -> "one_only_two.js" [color="orange" penwidth=2.0]
    "root_one.js" -> "shared.js" [color="orange" penwidth=2.0]
    "root_one.js" -> "sub/dir.js" [color="orange" penwidth=2.0]
    "root_one.js" -> "fs" [color="orange" penwidth=2.0]
    "root_one.js" -> "node_modules/somemodule/src/somemodule.js" [color="orange" penwidth=2.0]
    "root_two.js" -> "shared.js" [color="orange" penwidth=2.0]
    "root_two.js" -> "somedata.json" [color="orange" penwidth=2.0]
    "root_two.js" -> "two_only_one.js" [color="orange" penwidth=2.0]
    "root_two.js" -> "http" [color="orange" penwidth=2.0]
    "shared.js" -> "path" [color="orange" penwidth=2.0]
    "sub/depindir.js" -> "path" [color="orange" penwidth=2.0]
    "sub/dir.js" -> "sub/depindir.js" [color="orange" penwidth=2.0]
    "sub/dir.js" -> "path" [color="orange" penwidth=2.0]
    "two_only_one.js" -> "sub/dir.js" [color="orange" penwidth=2.0]
}
`;

describe("dot reporter", () => {
    it("renders a dot - modules in the root don't come in a cluster", () => {
        expect(render(deps)).to.deep.equal(elFixture);
        // console.log(render(deps));
        // expect(1).to.equal(1);
    });
});

/* eslint max-len: 0 */
