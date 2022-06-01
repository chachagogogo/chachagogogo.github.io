import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '노트',
    Svg: require('@site/static/img/folder.svg').default,
    description: (
      <>
        일하거나 공부하면서 알게 된 지식을 정리합니다. 프론트엔드 웹개발자인만큼 <code>HTML</code>, <code>CSS</code>, <code>JS</code>, <code>React</code> 등이 주요 기록 대상입니다.
      </>
    ),
  },
  {
    title: '블로그',
    Svg: require('@site/static/img/cup.svg').default,
    description: (
      <>
        개발과 관련된 제 생각, 혹은 일지를 적습니다. 차곡차곡 정돈된 노트와는 다르게 그때마다 떠오르는 생각이나 소식 등으로 채울 예정입니다.
      </>
    ),
  },
  {
    title: '소개',
    Svg: require('@site/static/img/id-card.svg').default,
    description: (
      <>
        저에 관한 간략한 소개를 하는 페이지입니다. 꾸준한 성장과 긍정적인 관계를 지향합니다.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
