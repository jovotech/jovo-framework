import { Image } from '../core/Interfaces';
interface TableImage extends Image {
}
interface TableButton {
    title: string;
    openUrlAction: {
        url: string;
    };
}
interface Column {
    header: string;
    horizontalAlignment?: string;
}
interface Row {
    cells: Cell[];
    dividerAfter: boolean;
}
interface Cell {
    text: string;
}
export declare class Table {
    static HORIZONTAL_ALIGNMENT_LEADING: string;
    static HORIZONTAL_ALIGNMENT_CENTER: string;
    static HORIZONTAL_ALIGNMENT_TRAILING: string;
    title?: string;
    subtitle?: string;
    image?: TableImage;
    buttons?: TableButton[];
    columnProperties?: Column[];
    rows: Row[];
    constructor(table?: Table);
    setTitle(title: string): this;
    setSubtitle(subtitle: string): this;
    setImage(image: TableImage): this;
    addButton(title: string, url: string): this;
    addRow(cellsText: string[], dividerAfter?: boolean): this;
    addRows(rowsText: string[][]): this;
    addColumn(header: string, horizontalAlignment?: string): this;
    addColumns(columnHeaders: string[]): this;
}
export {};
