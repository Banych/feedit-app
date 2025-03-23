'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import parse from 'html-react-parser';
import { CSSProperties, OlHTMLAttributes, useMemo } from 'react';

function getOrderedListType(
  counterType?: string
): OlHTMLAttributes<HTMLOListElement>['type'] {
  switch (counterType) {
    case 'lower-alpha':
      return 'a';
    case 'lower-roman':
      return 'i';
    case 'upper-alpha':
      return 'A';
    case 'upper-roman':
      return 'I';
    default:
      return '1';
  }
}

function getOrderedListClass(counterType?: string): string {
  switch (counterType) {
    case 'lower-alpha':
      return 'list-alpha';
    case 'lower-roman':
      return 'list-roman';
    case 'upper-alpha':
      return 'list-alpha-upper';
    case 'upper-roman':
      return 'list-roman-upper';
    default:
      return 'list-decimal';
  }
}

function getSubListClass(
  parentType?: OlHTMLAttributes<HTMLOListElement>['type']
): string {
  switch (parentType) {
    case 'a':
      return 'list-lower-alpha';
    case 'i':
      return 'list-lower-roman';
    case 'A':
      return 'list-upper-alpha';
    case 'I':
      return 'list-upper-roman';
    default:
      return 'list-decimal';
  }
}

type ListItem = {
  content: string;
  items: ListItem[];
  meta: {
    checked?: boolean;
  };
};
type ListRendererData = {
  items: ListItem[];
  meta: {
    start?: number;
    counterType?:
      | 'decimal'
      | 'lower-alpha'
      | 'lower-roman'
      | 'upper-alpha'
      | 'upper-roman';
  };
  style: 'unordered' | 'ordered' | 'checklist';
};

const renderers = {
  ordered: OrderedListRenderer,
  unordered: UnorderedListRenderer,
  checklist: ChecklistRenderer,
};

function ListRenderer({
  data,
  style,
}: {
  data: ListRendererData;
  style: CSSProperties;
}) {
  const { style: styleConf } = data;

  const Component = renderers[styleConf];

  return <Component data={data} style={style} />;
}

function UnorderedListRenderer({
  data,
  style,
}: {
  data: ListRendererData;
  style: CSSProperties;
}) {
  const { items } = data;

  return (
    <ul style={style} className="grid list-inside list-disc gap-1 p-1">
      {items.map((item, index) => (
        <ListItemRenderer key={index} item={item} style={style} />
      ))}
    </ul>
  );
}

function OrderedListRenderer({
  data,
  style,
}: {
  data: ListRendererData;
  style: CSSProperties;
}) {
  const {
    items,
    meta: { counterType, start },
  } = data;

  const type = useMemo(() => getOrderedListType(counterType), [counterType]);
  const listClass = useMemo(
    () => getOrderedListClass(counterType),
    [counterType]
  );

  return (
    <ol
      start={start}
      type={type}
      style={style}
      className={cn('list-inside gap-1 p-1 grid', listClass)}
    >
      {items.map((item, index) => (
        <ListItemRenderer
          key={index}
          item={item}
          parentType={type}
          style={style}
        />
      ))}
    </ol>
  );
}

function ChecklistRenderer({
  data,
  style,
}: {
  data: ListRendererData;
  style: CSSProperties;
}) {
  const { items } = data;

  return (
    <ul style={style} className="grid list-inside gap-1 p-1">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-1">
          <Checkbox checked={item.meta.checked} />
          {item.content}
        </li>
      ))}
    </ul>
  );
}

function ListItemRenderer({
  item,
  parentType,
  style,
}: {
  item: ListItem;
  parentType?: OlHTMLAttributes<HTMLOListElement>['type'];
  style?: CSSProperties;
}) {
  const subListClass = useMemo(() => getSubListClass(parentType), [parentType]);

  return (
    <li>
      {parse(item.content)}
      {item.items.length > 0 && (
        <ul
          style={style}
          className={cn('list-inside gap-1 p-1 grid', subListClass)}
        >
          {item.items.map((subItem, index) => (
            <ListItemRenderer
              key={index}
              item={subItem}
              parentType={parentType}
              style={style}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default ListRenderer;
