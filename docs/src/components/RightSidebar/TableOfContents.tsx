import type { FunctionalComponent } from 'preact';
import { h, Fragment } from 'preact';
import 'preact/debug';
import { useState, useEffect, useRef, StateUpdater } from 'preact/hooks';

// provided by https://www.emgoto.com/react-table-of-contents/
const useIntersectionObserver = (query: string) => {
  const [activeHeadings, setActiveHeadings] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );

  useEffect(() => {
    const callback: IntersectionObserverCallback = (
      sections: IntersectionObserverEntry[]
    ) => {
      setActiveHeadings((previousActiveHeadings) => {
        return sections.reduce((map, section) => {
          map.set(
            section.target.children[0].getAttribute('id'),
            section.isIntersecting
          );
          return map;
        }, previousActiveHeadings);
      });
    };

    const observer = new IntersectionObserver(callback);

    const headingElements = Array.from(document.querySelectorAll(query));

    // Have the observer watch each `<section/>` that has a heading in it
    headingElements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [activeHeadings, setActiveHeadings, query]);

  return activeHeadings;
};

const TableOfContents: FunctionalComponent<{ headers: any[] }> = ({
  headers = [],
}) => {
  const activeHeadings = useIntersectionObserver('article.content section');

  return (
    <>
      <h2 class="heading">On this page</h2>
      <ul>
        <li
          class={`header-link depth-2 ${
            activeHeadings.get('overview') ? 'active' : ''
          }`.trim()}
        >
          <a href="#overview">Overview</a>
        </li>
        {headers
          .filter(({ depth }) => depth > 1 && depth < 4)
          .map((header) => {
            return (
              <li
                key={header.slug}
                class={`header-link depth-${header.depth} ${
                  activeHeadings.get(header.slug) ? 'active' : ''
                }`.trim()}
              >
                <a href={`#${header.slug}`}>{header.text}</a>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default TableOfContents;
