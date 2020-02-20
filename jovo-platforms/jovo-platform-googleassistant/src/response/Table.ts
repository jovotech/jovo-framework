/**
 * Table card UI element
 */
import { Image } from '../core/Interfaces';

interface TableImage extends Image {}

interface TableButton {
  title: string;
  openUrlAction: {
    url: string;
  };
}

interface Column {
  header: string;
  horizontalAlignment?: string; // LEADING, CENTER, TRAILING
}
interface Row {
  cells: Cell[];
  dividerAfter: boolean;
}
interface Cell {
  text: string;
}

export class Table {
  static HORIZONTAL_ALIGNMENT_LEADING = 'LEADING';
  static HORIZONTAL_ALIGNMENT_CENTER = 'CENTER';
  static HORIZONTAL_ALIGNMENT_TRAILING = 'TRAILING';

  title?: string;
  subtitle?: string;
  image?: TableImage;
  buttons?: TableButton[];
  columnProperties?: Column[] = [];
  rows: Row[] = [];
  /**
   * Constructor
   * @param {Table=} table
   */
  constructor(table?: Table) {
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

  /**
   * Sets title of item
   * @param {string} title
   * @return {Table}
   */
  setTitle(title: string) {
    this.title = title;
    return this;
  }

  /**
   * Sets subtitle of item
   * @param {string} subtitle
   * @return {Table}
   */
  setSubtitle(subtitle: string) {
    this.subtitle = subtitle;
    return this;
  }

  /**
   * Sets image of element
   * @param {BasicCardImage} image
   * @return {OptionItem}
   */
  setImage(image: TableImage) {
    this.image = image;
    return this;
  }

  /**
   * Adds button to table card
   * @param {string} title
   * @param {string} url
   * @return {Table}
   */
  addButton(title: string, url: string) {
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

  /**
   * Adds a row to table
   * @param {array} cellsText
   * @param {boolean} dividerAfter
   * @return {Table}
   */
  addRow(cellsText: string[], dividerAfter = true) {
    const cells: Cell[] = [];
    cellsText.map((text) => {
      cells.push({ text });
    });

    this.rows.push({
      cells,
      dividerAfter,
    });
    return this;
  }

  /**
   * Adds muliple rows to table
   * @param {array} rowsText
   * @return {Table}
   */
  addRows(rowsText: string[][]) {
    rowsText.map((row: string[]) => {
      this.addRow(row, false);
    });
    return this;
  }

  /**
   * Adds a column to table
   * @param {string} header
   * @param {string} horizontalAlignment
   * @return {Table}
   */
  addColumn(header: string, horizontalAlignment = Table.HORIZONTAL_ALIGNMENT_LEADING) {
    if (!this.columnProperties) {
      this.columnProperties = [];
    }
    this.columnProperties.push({
      header,
      horizontalAlignment,
    });
    return this;
  }

  /**
   * Adds multiple columns to table
   * @param {array} columnHeaders
   * @return {Table}
   */
  addColumns(columnHeaders: string[]) {
    if (!columnHeaders) {
      throw new Error('columnHeaders cannot be empty');
    }
    columnHeaders.map((columnHeader: string) => {
      this.addColumn(columnHeader);
    });
    return this;
  }
}
