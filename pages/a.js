import React, {Component, Fragment} from 'react'
import getConfig from 'next/config'
import {withRouter} from 'next/router'
import dynamic from 'next/dynamic'
// 这里其实是es2019Api的dynamic引入
const Comp = dynamic(import('../components/comp'));
const {serverRuntimeConfig,publicRuntimeConfig} = getConfig();
class App extends Component {
  static getInitialProps = async () => {
    // 执行到该行的时候才会去加载moment
    const moment = await import('moment');
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          name: 'ainuo',
          // 使用的时候使用default方法
          time: moment.default(Date.now() - 60 * 1000).fromNow()
        })
      }, 2000)
    });
    return await promise
  };

  render() {
    const {router, name, time} = this.props;
    console.log(serverRuntimeConfig, publicRuntimeConfig);
    return (
        <Fragment>
          this is {name}, {time}, {process.env.customKey}<br />
          {/*只有当渲染Comp的时候才会去执行改代码*/}
          <Comp/>
        </Fragment>
    )
  }
}

export default withRouter(App)
