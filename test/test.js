const assert = require("assert");

const wb = require("../index")("./test/sample.xlsx");

describe("wb.sheets[<Sheet Name>]", () => {
    it("should return undefined if sheet name is incorrect", () => {
        assert.strictEqual(wb.sheets["Sheet4"], undefined);
    });
});
describe("wb.sheets[<Sheet Name>].cell(<Ref e.g. A5 B12>)", () => {
    it("return empty string if out of bounds", () => {
        assert.equal(wb.sheets["Sheet1"].cell("A15"), "");
        assert.equal(wb.sheets["Sheet2"].cell("F3"), "");
        assert.equal(wb.sheets["Sheet3"].cell("A3"), "");
    });
    it("return empty field", () => {
        assert.strictEqual(wb.sheets["Sheet1"].cell("A5"), "  ");
        assert.strictEqual(wb.sheets["Sheet1"].cell("E12", "number"), 0);
    });
});
describe("wb.sheets[<Sheet Name>].lookup", () => {
    it("return empty string if no item", () => {
        assert.equal(wb.sheets["Sheet1"].lookup("A", "Strawberry", "C"), "");
    });
    it("return empty string if out bounds", () => {
        assert.equal(wb.sheets["Sheet1"].lookup("A", "Apple", "D"), "");
    });
    it("return 2 Apples is Sour", () => {
        assert.strictEqual(wb.sheets["Sheet1"].lookup("A", "Apple", "B", "number"), 2);
        assert.strictEqual(wb.sheets["Sheet1"].lookup("A", "Apple", "C"), "Sour");
    });
    it("Level 15 Lizardman Warrior", () => {
        assert.strictEqual(wb.sheets["Sheet2"].lookup("A", "Level", "B", "number"), 15);
        assert.strictEqual(wb.sheets["Sheet2"].lookup("A", "Species", "B"), "Lizardman");
        assert.strictEqual(wb.sheets["Sheet2"].lookup("A", "Class", "B"), "Warrior");
    });
});
describe("wb.sheets[<Sheet Name>].matchCol", () => {
    it("return empty string if no such row", () => {
        assert.equal(wb.sheets["Sheet1"].matchCol(0, "Strawberry"), "");
        assert.equal(wb.sheets["Sheet1"].matchCol(15, "Strawberry"), "");
    });
    it("return empty string if no items in row", () => {
        assert.equal(wb.sheets["Sheet1"].matchCol(1, "Strawberry"), "");
        assert.equal(wb.sheets["Sheet1"].matchCol(9, "Strawberry"), "");
    });
    it("return correctly", () => {
        assert.equal(wb.sheets["Sheet1"].matchCol(1, "Flavour"), "C");
        assert.equal(wb.sheets["Sheet1"].matchCol(11, "SKU"), "C");
        assert.equal(wb.sheets["Sheet1"].matchCol(11, "Name"), "D");
        assert.equal(wb.sheets["Sheet2"].matchCol(1, "Data"), "B");
    });
});
describe("wb.sheets[<Sheet Name>].matchRow", () => {
    it("return -1 if no such column", () => {
        assert.equal(wb.sheets["Sheet1"].matchRow("Z", "Strawberry"), -1);
        assert.equal(wb.sheets["Sheet1"].matchRow("D", "Strawberry"), -1);
    });
    it("return -1 if no items in column", () => {
        assert.equal(wb.sheets["Sheet1"].matchRow("A", "Strawberry"), -1);
        assert.equal(wb.sheets["Sheet1"].matchRow("C", "Strawberry"), -1);
    });
    it("return correctly", () => {
        assert.equal(wb.sheets["Sheet1"].matchRow("A", "Apple"), 2);
        assert.equal(wb.sheets["Sheet1"].matchRow("B", "Quantity"), 1);
        assert.equal(wb.sheets["Sheet1"].matchRow("E", 222), 13);
        assert.equal(wb.sheets["Sheet2"].matchRow("A", "Equipments"), 10);
    });
});