'use client';

import { initializeSize, insertColumns, insertRows } from '@/lib/utils';
import '@/styles/globals.scss';
import styles from '@/styles/pages/Home.module.scss';
import {
  Fragment,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaCopy } from 'react-icons/fa';

const DEFAULT_ROW_COUNT = 10;
const DEFAULT_COLUMN_COUNT = 10;

interface TooltipItem {
  icon: ReactNode;
  text: string;
  onClick: MouseEventHandler;
}

export default function Home() {
  const [gridRefs, setGridRefs] = useState(initializeSize(DEFAULT_ROW_COUNT, DEFAULT_COLUMN_COUNT));
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipItems, setTooltipItems] = useState<TooltipItem[]>([]);

  const rowCount = useMemo(() => gridRefs.length || 1, [gridRefs.length]);
  const columnCount = useMemo(() => gridRefs[0]?.length || 1, [gridRefs]);

  const rowIndexArr = useMemo(
    () =>
      Array(rowCount)
        .fill(null)
        .map((_, i) => i),
    [rowCount]
  );

  const colIndexArr = useMemo(
    () =>
      Array(columnCount)
        .fill(null)
        .map((_, i) => i),
    [columnCount]
  );

  const placeTooltip = useCallback(
    (itemArr: TooltipItem[]): MouseEventHandler<HTMLButtonElement> =>
      e => {
        setTooltipItems(itemArr);
        e.preventDefault();
        if (tooltipRef.current) {
          tooltipRef.current.style.top = `${e.clientY - 80}px -`;
          tooltipRef.current.style.left = `${e.clientX - 80}px`;
          setShowTooltip(true);
        }
      },
    []
  );

  return (
    <div className={styles.page}>
      <div
        className={styles.tooltipWrapper}
        ref={tooltipRef}
        data-visible={showTooltip}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={styles.tooltip}>
          {tooltipItems.map(item => (
            <button key={item.text} type="button" onClick={item.onClick}>
              {item.icon}
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.corner}>
          <button
            type="button"
            className={styles.cell}
            onContextMenu={placeTooltip([
              {
                icon: <FaCopy />,
                text: 'Copy',
                onClick: () => {},
              },
            ])}
          />
        </div>
        <div
          className={styles.header}
          style={{
            gridTemplateColumns: `repeat(${columnCount + 1}, 8rem)`,
          }}
        >
          {colIndexArr.map(columnIndex => (
            <div className={styles.cell} key={columnIndex}>
              {columnIndex}
            </div>
          ))}
          <button type="button" onClick={() => setGridRefs(refs => insertColumns(refs))}>
            New
          </button>
        </div>
        <div
          className={styles.side}
          style={{
            gridTemplateRows: `repeat(${rowCount + 1}, 2rem)`,
          }}
        >
          {rowIndexArr.map(rowIndex => (
            <div className={styles.cell} key={rowIndex}>
              {rowIndex}
            </div>
          ))}
          <button type="button" onClick={() => setGridRefs(refs => insertRows(refs))}>
            New
          </button>
        </div>
        <div
          className={styles.cells}
          style={{
            gridTemplateColumns: `repeat(${columnCount}, 8rem)`,
            gridTemplateRows: `repeat(${rowCount}, 2rem)`,
          }}
        >
          {rowIndexArr.map(rowIndex => (
            <Fragment key={rowIndex}>
              {colIndexArr.map(columnIndex => (
                <input
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      // Offset by -1 (up) if shift clicked
                      const yOffset = event.shiftKey ? -1 : 1;
                      const newRow = rowIndex + yOffset;

                      if (newRow < 0 || newRow >= rowCount) return;
                      if (gridRefs[newRow]) gridRefs[newRow][columnIndex].focus();
                    }
                  }}
                  ref={element => {
                    if (gridRefs[rowIndex]) gridRefs[rowIndex][columnIndex] = element;
                  }}
                  type="text"
                  data-row={rowIndex}
                  data-col={columnIndex}
                  // onMouseDown={e => {
                  //   console.log(`Cell pressed: ${rowIndex}, ${columnIndex}`);
                  // }}
                  key={`${rowIndex}-${columnIndex}`}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
