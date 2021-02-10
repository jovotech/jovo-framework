"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Table {
    constructor(table) {
        this.columnProperties = [];
        this.rows = [];
        if (table) {
            if (table.title) {
                this.title = table.title;
            }
            if (table.subtitle) {
                this.subtitle = table.subtitle;
            }
            if (table.image) {
                this.image = table.image;
            }
            if (table.buttons) {
                this.buttons = table.buttons;
            }
            if (table.rows) {
                this.rows = table.rows;
            }
            if (table.columnProperties) {
                this.columnProperties = table.columnProperties;
            }
        }
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setSubtitle(subtitle) {
        this.subtitle = subtitle;
        return this;
    }
    setImage(image) {
        this.image = image;
        return this;
    }
    addButton(title, url) {
        if (!this.buttons) {
            this.buttons = [];
        }
        this.buttons.push({
            title,
            openUrlAction: {
                url,
            },
        });
        return this;
    }
    addRow(cellsText, dividerAfter = true) {
        const cells = [];
        cellsText.map((text) => {
            cells.push({ text });
        });
        this.rows.push({
            cells,
            dividerAfter,
        });
        return this;
    }
    addRows(rowsText) {
        rowsText.map((row) => {
            this.addRow(row, false);
        });
        return this;
    }
    addColumn(header, horizontalAlignment = Table.HORIZONTAL_ALIGNMENT_LEADING) {
        if (!this.columnProperties) {
            this.columnProperties = [];
        }
        this.columnProperties.push({
            header,
            horizontalAlignment,
        });
        return this;
    }
    addColumns(columnHeaders) {
        if (!columnHeaders) {
            throw new Error('columnHeaders cannot be empty');
        }
        columnHeaders.map((columnHeader) => {
            this.addColumn(columnHeader);
        });
        return this;
    }
}
exports.Table = Table;
Table.HORIZONTAL_ALIGNMENT_LEADING = 'LEADING';
Table.HORIZONTAL_ALIGNMENT_CENTER = 'CENTER';
Table.HORIZONTAL_ALIGNMENT_TRAILING = 'TRAILING';
//# sourceMappingURL=Table.js.map