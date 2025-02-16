export type Styles = {
  action: string;
  cell: string;
  cells: string;
  corner: string;
  divider: string;
  grid: string;
  header: string;
  page: string;
  side: string;
  tooltip: string;
  tooltipWrapper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
