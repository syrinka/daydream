import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';


import styles from './friends.module.css';

const FriendList = [
    {
        "avatar": "https://avatars.githubusercontent.com/u/29620619",
        "link": "https://yaossg.com/site/",
        "name": "Yaossg"
    },
    {
        "avatar": "https://avatars.githubusercontent.com/u/64351788",
        "link": "https://fullstack-sake.github.io/",
        "name": "sake"
    },
    {
        "avatar": "http://q1.qlogo.cn/g?b=qq&nk=2921349622&s=640",
        "link": "https://www.cnblogs.com/timlzh",
        "name": "Timlzh"
    },
    {
        "avatar": "https://blog.zbwer.work/logo.svg",
        "link": "https://blog.zbwer.work/",
        "name": "zbwer"
    },
    {
        "avatar": "https://avatars.githubusercontent.com/u/108183563",
        "link": "https://zzzremake.github.io/",
        "name": "ZzzRemake"
    },
    {
        "avatar": "https://fattyray.github.io/fattyrays_homepage/profile.jpg",
        "link": "https://fattyray.github.io/fattyrays_homepage/",
        "name": "fattyrays"
    },
]

function FriendCard({ avatar, link, name }) {
    return (
        <div className={clsx('col col--4', styles.cell)}>
            <div className={styles.card}>
                <a href={link}>
                    <div className={styles["friend-ship"]}>
                        <img src={avatar} height="100" width="100" />
                        <div>
                            <h1>{name}</h1>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

function AllFriends() {
    return (
        <section className={styles.features}>
            <header style={{padding: '4rem 0'}}>
                <h1 className='hero__title' style={{ 'text-align': 'center' }}>「星门已部署」</h1>
            </header>
            <div className="container">
                <div className="row">
                    {FriendList.map((props, idx) => (
                        <FriendCard key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}


export default function Friends() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title="Friends">
            <AllFriends />
        </Layout>
    );
}
